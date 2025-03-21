import React, { useState, useEffect, useRef } from 'react';
import PDFViewer from './PDFViewer';
import ReactMarkdown from 'react-markdown'; // Import for markdown support
import { Search, Plus, Copy, Check } from 'lucide-react'; // Import icons

function PDFRagApp(props) {
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState('');
  const [selectedDocName, setSelectedDocName] = useState('None');
  const [uploadStatus, setUploadStatus] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [activeChatTitle, setActiveChatTitle] = useState('New Chat');
  const [showPdfViewer, setShowPdfViewer] = useState(true);
  
  // New state variables for added features
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  
  const messagesEndRef = useRef(null); // Ref for auto-scrolling
  
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user')) || null;
  const token = localStorage.getItem('token') || null;

  useEffect(() => {
    fetchDocuments();
    fetchUserChats();
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMessages(messages);
      return;
    }
    
    const filtered = messages.filter(msg => 
      msg.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredMessages(filtered);
  }, [searchQuery, messages]);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents');
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    }
  };

  const fetchUserChats = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/chats/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setChats(data);
      }
    } catch (error) {
      console.error('Failed to fetch user chats:', error);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setUploadStatus('Please select a file.');
      return;
    }
    
    setIsLoading(true);
    setUploadStatus('Uploading and processing...');
    
    try {
      const formData = new FormData();
      formData.append('pdf', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      if (response.ok) {
        setUploadStatus('Document processed successfully!');
        setFile(null);
        document.getElementById('pdfFile').value = '';
        fetchDocuments();
        
        // Add a system message
        const systemMessage = {
          type: 'system',
          content: `Document "${file.name}" was uploaded and processed successfully!`
        };
        
        setMessages([...messages, systemMessage]);
        
        // If we're in a chat, save this message
        if (activeChatId && selectedDocId) {
          await saveMessageToChat(systemMessage);
        }
      } else {
        setUploadStatus('Error: ' + result.error);
      }
    } catch (error) {
      setUploadStatus('Upload failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentSelect = async (e) => {
    const docId = e.target.value;
    const selectedDoc = documents.find(doc => doc._id === docId);
    
    if (selectedDoc) {
      setSelectedDocId(docId);
      setSelectedDocName(selectedDoc.title);
      
      // Create a new chat for this document
      await createNewChat(docId, selectedDoc.title);
    } else {
      setSelectedDocId('');
      setSelectedDocName('None');
    }
  };

  const createNewChat = async (documentId, documentName) => {
    if (!user) return;
    if (!documentId || !documentName) return;
    
    // Clear current messages
    setMessages([]);
    
    const systemMessage = {
      type: 'system',
      content: `You selected document: "${documentName}"`
    };
    
    setMessages([systemMessage]);
    
    try {
      // Create a new chat in the database
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user.id,
          documentId: documentId,
          title: `Chat about ${documentName}`,
          message: systemMessage
        })
      });
      
      if (response.ok) {
        const newChat = await response.json();
        setActiveChatId(newChat._id);
        setActiveChatTitle(newChat.title);
        
        // Refresh chat list
        fetchUserChats();
      }
    } catch (error) {
      console.error('Failed to create new chat:', error);
    }
  };

  const loadChat = async (chatId) => {
    try {
      const response = await fetch(`/api/chats/${chatId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const chat = await response.json();
        setActiveChatId(chat._id);
        setActiveChatTitle(chat.title);
        setSelectedDocId(chat.documentId._id);
        setSelectedDocName(chat.documentId.title);
        setMessages(chat.messages);
      }
    } catch (error) {
      console.error('Failed to load chat:', error);
    }
  };

  const deleteSelectedChat = async () => {
    if (!activeChatId) return;
    
    try {
      const response = await fetch(`/api/chats/${activeChatId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        // Clear current chat
        setActiveChatId(null);
        setActiveChatTitle('New Chat');
        setMessages([]);
        
        // Refresh chat list
        fetchUserChats();
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  };

  const saveMessageToChat = async (newMessage) => {
    if (!user || !activeChatId) return;
    
    try {
      await fetch('/api/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          chatId: activeChatId,
          userId: user.id,
          documentId: selectedDocId,
          message: newMessage
        })
      });
    } catch (error) {
      console.error('Failed to save message:', error);
    }
  };

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      return;
    }
    
    if (!selectedDocId) {
      const systemMessage = {
        type: 'system',
        content: 'Please select a document first.'
      };
      
      setMessages([...messages, systemMessage]);
      return;
    }
    
    // Add user message
    const userMessage = { type: 'user', content: message, id: Date.now() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setMessage('');
    
    // Save user message to chat
    if (activeChatId) {
      await saveMessageToChat(userMessage);
    } else if (user) {
      // Create a new chat with this message
      try {
        const response = await fetch('/api/chats', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            userId: user.id,
            documentId: selectedDocId,
            title: `Chat about ${selectedDocName}`,
            message: userMessage
          })
        });
        
        if (response.ok) {
          const newChat = await response.json();
          setActiveChatId(newChat._id);
          setActiveChatTitle(newChat.title);
          fetchUserChats();
        }
      } catch (error) {
        console.error('Failed to create new chat:', error);
      }
    }
    
    // Process the query
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          documentId: selectedDocId,
          query: message
        })
      });
      
      const result = await response.json();
      if (response.ok) {
        // Add bot response
        const botMessage = { type: 'bot', content: result.answer, id: Date.now() };
        setMessages([...updatedMessages, botMessage]);
        
        // Save bot message to chat
        if (activeChatId) {
          await saveMessageToChat(botMessage);
        }
      } else {
        const errorMessage = { type: 'system', content: 'Error: ' + result.error, id: Date.now() };
        setMessages([...updatedMessages, errorMessage]);
        
        if (activeChatId) {
          await saveMessageToChat(errorMessage);
        }
      }
    } catch (error) {
      const errorMessage = { type: 'system', content: 'Query failed: ' + error.message, id: Date.now() };
      setMessages([...updatedMessages, errorMessage]);
      
      if (activeChatId) {
        await saveMessageToChat(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle PDF viewer
  const togglePdfViewer = () => {
    setShowPdfViewer(!showPdfViewer);
  };

  // Copy message to clipboard
  const copyMessageToClipboard = (messageId, content) => {
    navigator.clipboard.writeText(content);
    setCopiedMessageId(messageId);
    
    // Reset copied status after 2 seconds
    setTimeout(() => {
      setCopiedMessageId(null);
    }, 2000);
  };

  // Toggle search bar
  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setFilteredMessages(messages);
    } else {
      setSearchQuery('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-72 bg-gray-800 p-5 flex flex-col gap-5 border-r border-gray-700">
          <h2 className="text-lg text-gray-300">My Documents</h2>
          <select
            className="p-2 bg-gray-700 rounded-lg text-white w-full"
            value={selectedDocId}
            onChange={handleDocumentSelect}
          >
            <option value="" disabled>Select a PDF</option>
            {documents.map(doc => (
              <option key={doc._id} value={doc._id}>{doc.title}</option>
            ))}
          </select>
          
          <div className="flex justify-between items-center">
            <h2 className="text-lg text-gray-300">Chat History</h2>
            <button 
              onClick={() => selectedDocId && createNewChat(selectedDocId, selectedDocName)}
              className="p-1 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              disabled={!selectedDocId}
            >
              New
            </button>
          </div>
          
          <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
            {chats.length === 0 ? (
              <div className="text-gray-500 text-sm">No chat history yet</div>
            ) : (
              chats.map(chat => (
                <div 
                  key={chat._id}
                  className={`p-3 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors flex items-center justify-between ${chat._id === activeChatId ? 'bg-gray-600' : 'bg-gray-700'}`}
                  onClick={() => loadChat(chat._id)}
                >
                  <div className="truncate flex-1">{chat.title}</div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (chat._id === activeChatId) {
                        deleteSelectedChat();
                      }
                    }}
                    className="text-gray-400 hover:text-red-400 ml-2"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-gray-900">
          {/* Header */}
          <header className="p-5 bg-gray-800 flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <h1 className="text-2xl font-bold">
                {activeChatId ? activeChatTitle : 'RAG Chat'}
              </h1>
              {selectedDocId && (
                <div className="flex gap-2">
                  <button 
                    onClick={togglePdfViewer}
                    className="py-1 px-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-sm"
                  >
                    {showPdfViewer ? 'Hide PDF' : 'Show PDF'}
                  </button>
                  <button 
                    onClick={toggleSearch}
                    className="py-1 px-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-sm flex items-center gap-1"
                  >
                    <Search size={14} />
                    {showSearch ? 'Hide Search' : 'Search'}
                  </button>
                </div>
              )}
            </div>
            <div className="profile">
              {user ? (
                <div className="flex items-center gap-3">
                  <span>{user.name}</span>
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-blue-500"></div>
              )}
            </div>
          </header>

          {/* Search Bar - Conditionally rendered */}
          {showSearch && (
            <div className="p-3 bg-gray-800 border-b border-gray-700">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search in messages..."
                  className="w-full p-2 pl-10 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-3 text-gray-400" size={16} />
              </div>
            </div>
          )}

          {/* Split View - Chat and PDF Viewer */}
          <div className="flex-1 flex overflow-hidden">
            {/* Chat Area */}
            <div className={`flex-1 p-6 overflow-auto flex flex-col ${showPdfViewer && selectedDocId ? 'w-1/2' : 'w-full'}`}>
              {messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 max-w-lg w-full text-center">
                    <h2 className="text-xl font-semibold mb-4">Upload your PDF</h2>
                    <form className="flex flex-col gap-3">
                      <input
                        type="file"
                        id="pdfFile"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="w-full p-3 bg-gray-700 rounded-lg text-white file:bg-blue-600 file:text-white file:border-0 file:px-4 file:py-2 file:rounded-lg file:cursor-pointer"
                      />
                    </form>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <h2 className="text-xl font-semibold mb-2">Your Documents</h2>
                    <select
                      className="p-3 bg-gray-700 rounded-lg text-white w-64"
                      value={selectedDocId}
                      onChange={handleDocumentSelect}
                    >
                      <option value="" disabled>Select a PDF</option>
                      {documents.map(doc => (
                        <option key={doc._id} value={doc._id}>{doc.title}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col gap-4">
                  {(showSearch ? filteredMessages : messages).map((msg, index) => (
                    <div
                      key={index}
                      className={`relative max-w-3/4 p-4 rounded-lg group ${
                        msg.type === 'user'
                          ? 'bg-blue-600 ml-auto'
                          : msg.type === 'bot'
                          ? 'bg-gray-700'
                          : 'bg-gray-600 text-gray-200 text-sm italic self-center'
                      }`}
                    >
                      {isLoading && index === messages.length - 1 ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-pulse h-2 w-2 bg-gray-400 rounded-full"></div>
                          <div className="animate-pulse h-2 w-2 bg-gray-400 rounded-full" style={{ animationDelay: '0.2s' }}></div>
                          <div className="animate-pulse h-2 w-2 bg-gray-400 rounded-full" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      ) : (
                        <>
                          {/* Markdown rendering for bot messages */}
                          {msg.type === 'bot' ? (
                            <div className="markdown-content">
                              <ReactMarkdown>
                                {msg.content}
                              </ReactMarkdown>
                            </div>
                          ) : (
                            msg.content
                          )}
                          
                          {/* Copy button - only show for non-system messages */}
                          {msg.type !== 'system' && (
                            <button 
                              onClick={() => copyMessageToClipboard(msg.id, msg.content)}
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded bg-gray-800 text-gray-300 hover:bg-gray-700"
                            >
                              {copiedMessageId === msg.id ? (
                                <Check size={14} className="text-green-500" />
                              ) : (
                                <Copy size={14} />
                              )}
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            
            {/* PDF Viewer */}
            {showPdfViewer && selectedDocId && (
              <div className="w-1/2 border-l border-gray-700 overflow-hidden flex flex-col">
                <PDFViewer documentId={selectedDocId} messages={messages} />
              </div>
            )}
          </div>

          {/* Document Selection and Upload */}
          <div className="bg-gray-800 p-4 border-t border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <select
                className="p-2 bg-gray-700 rounded-lg text-white"
                value={selectedDocId}
                onChange={handleDocumentSelect}
              >
                <option value="" disabled>Select a PDF</option>
                {documents.map(doc => (
                  <option key={doc._id} value={doc._id}>{doc.title}</option>
                ))}
              </select>
              
              <div className="flex gap-2">
                <input
                  type="file"
                  id="pdfFile"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="pdfFile" className="py-2 px-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600">
                  Choose PDF
                </label>
                <button
                  onClick={handleUpload}
                  disabled={!file || isLoading}
                  className={`py-2 px-4 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors ${(!file || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? 'Processing...' : 'Upload & Process'}
                </button>
              </div>
            </div>
            
            {/* Chat Input */}
            <form onSubmit={handleMessageSubmit} className="flex gap-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={selectedDocId ? "Ask a question about the document..." : "Select a document first"}
                className="flex-1 p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!selectedDocId || isLoading}
              />
              <button
                type="submit"
                disabled={!selectedDocId || !message.trim() || isLoading}
                className={`py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${(!selectedDocId || !message.trim() || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-pulse h-2 w-2 bg-white rounded-full"></span>
                    <span className="animate-pulse h-2 w-2 bg-white rounded-full" style={{ animationDelay: '0.2s' }}></span>
                    <span className="animate-pulse h-2 w-2 bg-white rounded-full" style={{ animationDelay: '0.4s' }}></span>
                  </span>
                ) : 'Send'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Floating Action Button for New Chat */}
      {selectedDocId && (
        <button
          onClick={() => createNewChat(selectedDocId, selectedDocName)}
          className="fixed bottom-6 right-6 p-4 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-10"
        >
          <Plus size={24} />
        </button>
      )}
    </div>
  );
}

export default PDFRagApp;