import React, { useState, useEffect } from 'react';

export default function PDFRagApp() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState('');
  const [selectedDocName, setSelectedDocName] = useState('None');
  const [uploadStatus, setUploadStatus] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      // In a real app, this would be an API call
      const response = await fetch('/api/documents');
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
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
      // In a real app, this would be a real API call
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
        setMessages([...messages, {
          type: 'system',
          content: `Document "${file.name}" was uploaded and processed successfully!`
        }]);
      } else {
        setUploadStatus('Error: ' + result.error);
      }
    } catch (error) {
      setUploadStatus('Upload failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentSelect = (e) => {
    const selectedDoc = documents.find(doc => doc._id === e.target.value);
    if (selectedDoc) {
      setSelectedDocId(selectedDoc._id);
      setSelectedDocName(selectedDoc.title);
      
      // Add a system message
      setMessages([...messages, {
        type: 'system',
        content: `You selected document: "${selectedDoc.title}"`
      }]);
    } else {
      setSelectedDocId('');
      setSelectedDocName('None');
    }
  };

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      return;
    }
    
    if (!selectedDocId) {
      setMessages([...messages, {
        type: 'system',
        content: 'Please select a document first.'
      }]);
      return;
    }
    
    // Add user message
    const updatedMessages = [
      ...messages, 
      { type: 'user', content: message }
    ];
    setMessages(updatedMessages);
    setMessage('');
    
    // Process the query
    setIsLoading(true);
    
    try {
      // In a real app, this would be a real API call
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
        setMessages([
          ...updatedMessages, 
          { type: 'bot', content: result.answer }
        ]);
      } else {
        setMessages([
          ...updatedMessages, 
          { type: 'system', content: 'Error: ' + result.error }
        ]);
      }
    } catch (error) {
      setMessages([
        ...updatedMessages, 
        { type: 'system', content: 'Query failed: ' + error.message }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-72 bg-gray-800 p-5 flex flex-col gap-5 border-r border-gray-700">
          <h2 className="text-lg text-gray-300">Space</h2>
          <h2 className="text-lg text-gray-300">Collection</h2>
          <div>
            <h2 className="text-lg text-gray-300 mb-3">History</h2>
            <div className="flex flex-col gap-2">
              <div className="bg-gray-700 p-3 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors">Chat 1</div>
              <div className="bg-gray-700 p-3 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors">Chat 2</div>
              <div className="bg-gray-700 p-3 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors">Chat 3</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-gray-900">
          {/* Header */}
          <header className="p-5 bg-gray-800 flex justify-between items-center">
            <h1 className="text-2xl font-bold">RAG Chat</h1>
            <div className="profile">
              <div className="w-12 h-12 rounded-full bg-blue-500"></div>
            </div>
          </header>

          {/* Chat Area */}
          <div className="flex-1 p-6 overflow-auto flex flex-col">
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
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`max-w-3/4 p-4 rounded-lg ${
                      msg.type === 'user'
                        ? 'bg-blue-600 ml-auto'
                        : msg.type === 'bot'
                        ? 'bg-gray-700'
                        : 'bg-gray-600 text-gray-200 text-sm italic self-center'
                    }`}
                  >
                    {msg.content}
                  </div>
                ))}
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
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}