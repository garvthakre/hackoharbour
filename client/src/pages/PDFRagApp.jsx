import React, { useState, useEffect, useRef } from "react";
import PDFViewer from "./PDFViewer";
import ReactMarkdown from "react-markdown";
import { Search, Plus, Copy, Check, Trash2 } from "lucide-react";
import { Link } from "react-router";

function PDFRagApp() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState("");
  const [selectedDocName, setSelectedDocName] = useState("None");
  const [uploadStatus, setUploadStatus] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [activeChatTitle, setActiveChatTitle] = useState("New Chat");
  const [showPdfViewer, setShowPdfViewer] = useState(false);

  // Search and UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [copiedMessageId, setCopiedMessageId] = useState(null);

  // User and auth state
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");

  // Model selection
  const [availableModels, setAvailableModels] = useState([
    { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B Versatile" },
  { id: "deepseek-r1-distill-llama-70b", name: "DeepSeek R1 Distill Llama 70B" },
  { id: "qwen/qwen3-32b", name: "Qwen 3 32B" },
  { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B Instant" },
  { id: "gemma2-9b-it", name: "Gemma2 9B IT" },
  { id: "moonshotai/kimi-k2-instruct", name: "Kimi K2 Instruct" },
  ]);
  const [selectedModel, setSelectedModel] = useState("llama-3.1-8b-instant");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    if (storedToken) {
      fetchUserInfo(storedToken);
      fetchDocuments(storedToken);
      fetchUserChats(storedToken);
    } else {
      fetchDocuments();
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredMessages(messages);
      return;
    }

    const filtered = messages.filter((msg) =>
      msg.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMessages(filtered);
  }, [searchQuery, messages]);

const fetchUserInfo = async (authToken) => {
  console.log(" Fetching user info with token:", authToken ? "EXISTS" : "MISSING");
  
  try {
    const response = await fetch("/api/user/me", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    console.log("👤 User fetch response status:", response.status);

    if (response.ok) {
      const userData = await response.json();
      console.log(" User data fetched:", userData);
      setUser(userData);
    } else {
      const errorText = await response.text();
      console.error(" User fetch failed:", response.status, errorText);
      
      // If user fetch fails, try to decode token manually to get user ID
      if (authToken) {
        try {
          const payload = JSON.parse(atob(authToken.split('.')[1]));
          console.log(" Manual token decode:", payload);
          // Create minimal user object from token
          setUser({ id: payload.id });
        } catch (e) {
          console.error(" Token decode failed:", e);
          setUser(null);
        }
      }
    }
  } catch (error) {
    console.error(" Failed to fetch user info:", error);
    
    // Fallback: try to decode token manually
    if (authToken) {
      try {
        const payload = JSON.parse(atob(authToken.split('.')[1]));
        console.log(" Fallback token decode:", payload);
        setUser({ id: payload.id });
      } catch (e) {
        console.error(" Fallback token decode failed:", e);
        setUser(null);
      }
    }
  }
};

  const fetchDocuments = async (authToken = null) => {
    try {
      const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
      const response = await fetch("/api/documents", { headers });
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    }
  };

  const fetchUserChats = async (authToken = null) => {
    if (!authToken) return;

    try {
      const response = await fetch("/api/chat/user", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setChats(data);
      }
    } catch (error) {
      console.error("Failed to fetch user chats:", error);
    }
  };

  
  const loadChat = async (chatId) => {
    if (!token) return;

    try {
      const response = await fetch(`/api/chat/chat/${chatId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const chat = await response.json();
        setActiveChatId(chat._id);
        setActiveChatTitle(chat.title);
        
        // Set document if chat has one
        if (chat.documentId) {
          setSelectedDocId(chat.documentId._id);
          setSelectedDocName(chat.documentId.title);
        }
        
        // Set model
        if (chat.model) {
          setSelectedModel(chat.model);
        }

        // Load messages
        setMessages(chat.messages || []);
      }
    } catch (error) {
      console.error("Failed to load chat:", error);
    }
  };

  const deleteChat = async (chatId) => {
    if (!token) return;

    try {
      const response = await fetch(`/api/chat/chat/${chatId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // If deleted chat was active, create new chat
        if (chatId === activeChatId) {
          setActiveChatId(null);
          setActiveChatTitle("New Chat");
          setMessages([]);
        }
        fetchUserChats(token);
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
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
      setUploadStatus("Please select a file.");
      return;
    }

    setIsLoading(true);
    setUploadStatus("Uploading and processing...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch("/api/upload", {
        method: "POST",
        headers,
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setUploadStatus("Document processed successfully!");
        setFile(null);
        document.getElementById("pdfFile").value = "";
        fetchDocuments(token);

        const systemMessage = {
          type: "system",
          content: `Document "${file.name}" was uploaded and processed successfully!`,
          id: Date.now(),
        };

        setMessages([...messages, systemMessage]);
      } else {
        setUploadStatus("Error: " + result.error);
      }
    } catch (error) {
      setUploadStatus("Upload failed: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentSelect = async (e) => {
    const docId = e.target.value;
    const selectedDoc = documents.find((doc) => doc._id === docId);

    if (selectedDoc) {
      setSelectedDocId(docId);
      setSelectedDocName(selectedDoc.title);

      // Update current chat's document if we have an active chat
      if (activeChatId && token) {
        try {
          await fetch(`/api/chat/chat/${activeChatId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              title: `Chat about ${selectedDoc.title}`,
            }),
          });
          setActiveChatTitle(`Chat about ${selectedDoc.title}`);
        } catch (error) {
          console.error("Failed to update chat title:", error);
        }
      }
    } else {
      setSelectedDocId("");
      setSelectedDocName("None");
    }
  };

  const handleModelSelect = (e) => {
    setSelectedModel(e.target.value);
  };
const handleMessageSubmit = async (e) => {
  e.preventDefault();

  if (!message.trim()) return;

  if (!selectedDocId) {
    const systemMessage = {
      type: "system",
      content: "Please select a document first.",
      id: Date.now(),
    };
    setMessages([...messages, systemMessage]);
    return;
  }

  const userMessage = { type: "user", content: message, id: Date.now() };
  const updatedMessages = [...messages, userMessage];
  setMessages(updatedMessages);
  
  const currentMessage = message;
  setMessage("");
  setIsLoading(true);

  let chatIdToUse = activeChatId;
  
  console.log(" Starting message submit");
  console.log(" Current activeChatId:", activeChatId);
  console.log(" Token exists:", !!token);
  console.log(" User exists:", !!user);

  // If user has token but no active chat, create one first
  // Don't require user object - token is enough
  if (token && !chatIdToUse) {
    console.log("💡 Need to create chat first (token-based)");
    
    try {
      const createResponse = await fetch("/api/chat/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          documentId: selectedDocId,
          title: `Chat about ${selectedDocName}`,
          model: selectedModel,
        }),
      });

      console.log("Chat creation response status:", createResponse.status);

      if (createResponse.ok) {
        const newChat = await createResponse.json();
        chatIdToUse = newChat._id;
        setActiveChatId(newChat._id);
        setActiveChatTitle(newChat.title);
        console.log(" Chat created successfully:", newChat._id);
        fetchUserChats(token); // Update chat list
      } else {
        const errorText = await createResponse.text();
        console.error(" Chat creation failed:", errorText);
        // Continue without chat - messages won't be saved but query will work
        chatIdToUse = null;
      }
    } catch (error) {
      console.error(" Chat creation error:", error);
      // Continue without chat - messages won't be saved but query will work
      chatIdToUse = null;
    }
  }

  console.log(" Final chatId to use:", chatIdToUse);

  // Now send the query
  try {
    const queryPayload = {
      documentId: selectedDocId,
      query: currentMessage,
      model: selectedModel,
    };

    // Only add chatId if we have one
    if (chatIdToUse) {
      queryPayload.chatId = chatIdToUse;
      console.log(" Sending with chatId:", chatIdToUse);
    } else {
      console.log(" Sending without chatId - messages won't be saved to history");
    }

    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    console.log(" Final query payload:", queryPayload);

    const response = await fetch("/api/query", {
      method: "POST",
      headers,
      body: JSON.stringify(queryPayload),
    });

    const result = await response.json();

    if (response.ok) {
      const botMessage = {
        type: "bot",
        content: result.answer,
        id: Date.now(),
      };
      setMessages([...updatedMessages, botMessage]);
      
      console.log(" Query successful");
      if (result.debug) {
        console.log(" Backend debug:", result.debug);
      }
    } else {
      console.error("Query failed:", result);
      const errorMessage = {
        type: "system",
        content: "Error: " + (result.error || "Failed to get response"),
        id: Date.now(),
      };
      setMessages([...updatedMessages, errorMessage]);
    }
  } catch (error) {
    console.error(" Query request error:", error);
    const errorMessage = {
      type: "system",
      content: "Query failed: " + error.message,
      id: Date.now(),
    };
    setMessages([...updatedMessages, errorMessage]);
  } finally {
    setIsLoading(false);
  }
};
const createNewChat = async () => {
  alert("Creating new chat - check console"); // This will help us see if function is called
  console.log("SIMPLE: Creating new chat");
  console.log("SIMPLE: Token:", token ? "EXISTS" : "MISSING");
  console.log("SIMPLE: User:", user ? "EXISTS" : "MISSING");
  
  if (!token || !user) {
    console.log("SIMPLE: Not authenticated, clearing local chat");
    setMessages([]);
    setActiveChatId(null);
    setActiveChatTitle("New Chat");
    return;
  }

  try {
    console.log("SIMPLE: Making fetch request to create chat");
    const response = await fetch("/api/chat/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        documentId: selectedDocId || null,
        title: selectedDocId ? `Chat about ${selectedDocName}` : "New Chat",
        model: selectedModel,
      }),
    });

    console.log("SIMPLE: Response status:", response.status);
    
    if (response.ok) {
      const newChat = await response.json();
      console.log("SIMPLE: Chat created successfully:", newChat);
      setActiveChatId(newChat._id);
      setActiveChatTitle(newChat.title);
      setMessages([]);
      fetchUserChats(token);
      alert("Chat created with ID: " + newChat._id); // Visual confirmation
    } else {
      const errorText = await response.text();
      console.error("SIMPLE: Failed to create chat:", errorText);
      alert("Failed to create chat: " + errorText);
    }
  } catch (error) {
    console.error("SIMPLE: Chat creation error:", error);
    alert("Chat creation error: " + error.message);
  }
};

  const copyMessageToClipboard = (messageId, content) => {
    navigator.clipboard.writeText(content);
    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setFilteredMessages(messages);
    } else {
      setSearchQuery("");
    }
  };

  return (
   <div className="min-h-screen bg-zinc-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-72 bg-white p-5 flex flex-col gap-5 border-r-2 border-zinc-200 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-800">My Documents</h2>
          
          <Link
            className="border-2 border-amber-600 text-center rounded-lg py-2 text-amber-700 font-medium hover:bg-amber-50 transition-colors"
            to="/spaces"
          >
            Collaborative Spaces
          </Link>

          <select
            className="p-2 bg-white border-2 border-amber-200 rounded-lg text-zinc-700 w-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            value={selectedDocId}
            onChange={handleDocumentSelect}
          >
            <option value="" disabled>
              Select a PDF
            </option>
            {documents.map((doc) => (
              <option key={doc._id} value={doc._id}>
                {doc.title}
              </option>
            ))}
          </select>

          {/* Model Selection */}
          <div>
            <h3 className="text-sm font-medium text-zinc-700 mb-2">AI Model</h3>
            <select
              className="p-2 bg-white border-2 border-green-200 rounded-lg text-zinc-700 w-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={selectedModel}
              onChange={handleModelSelect}
            >
              {availableModels.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>

          {/* Chat History Section */}
          <div className="flex justify-between items-center border-b-2 border-zinc-200 pb-2">
            <h3 className="text-lg font-semibold text-zinc-800">Chat History</h3>
            <button
              onClick={createNewChat}
              className="p-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              title="New Chat"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
            {chats.length === 0 ? (
              <div className="text-zinc-500 text-sm">No chat history yet</div>
            ) : (
              chats.map((chat) => (
                <div
                  key={chat._id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors group border-2 ${
                    chat._id === activeChatId 
                      ? "bg-amber-50 border-amber-300" 
                      : "bg-white border-zinc-200 hover:border-amber-200 hover:bg-amber-50"
                  }`}
                  onClick={() => loadChat(chat._id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="truncate flex-1 text-sm text-zinc-800">
                      {chat.title}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(chat._id);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-600 ml-2 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">
                    {new Date(chat.lastMessageAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>

          {!token && (
            <div className="bg-yellow-50 border-2 border-yellow-200 p-3 rounded-lg text-sm">
              <p className="font-semibold text-yellow-800">Not logged in</p>
              <p className="text-yellow-700">Chat history won't be saved</p>
              <div className="flex gap-2 mt-2">
                <Link 
                  to="/login" 
                  className="text-amber-600 hover:text-amber-700 underline font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="text-amber-600 hover:text-amber-700 underline font-medium"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Header */}
          <header className="p-5 bg-white flex justify-between items-center border-b-2 border-zinc-200 shadow-sm">
            <div className="flex gap-4 items-center">
              <h1 className="text-2xl font-bold text-amber-600">
                {activeChatTitle}
              </h1>
              {selectedDocId && (
                <div className="flex gap-2">
                  <button
                    onClick={toggleSearch}
                    className="py-1 px-3 bg-white border-2 border-green-600 text-green-700 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium flex items-center gap-1"
                  >
                    <Search size={14} />
                    {showSearch ? "Hide Search" : "Search"}
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={handleUpload} className="flex gap-2">
              <input
                type="file"
                id="pdfFile"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="pdfFile"
                className="py-2 px-4 bg-white border-2 border-amber-600 text-amber-700 rounded-lg hover:bg-amber-50 transition-colors cursor-pointer text-sm font-medium"
              >
                Select New PDF
              </label>
              <button
                type="submit"
                disabled={isLoading || !file}
                className="py-2 px-4 bg-green-600 border-2 border-green-600 text-white rounded-lg hover:bg-green-700 hover:border-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                Upload & Process
              </button>
            </form>
          </header>

          {uploadStatus && (
            <div className="p-3 bg-zinc-50 text-center border-b-2 border-zinc-200 text-zinc-700">
              {uploadStatus}
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Chat Messages */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {showSearch && (
                <div className="p-3 bg-zinc-50 border-b-2 border-zinc-200">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search in conversation..."
                    className="w-full p-2 bg-white border-2 border-amber-200 rounded-lg text-zinc-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              )}

              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-zinc-50">
                {messages.length === 0 ? (
                  <div className="text-center text-zinc-500 mt-10">
                    <h3 className="text-xl mb-2 font-semibold text-zinc-700">Welcome to PDF RAG Chat!</h3>
                    <p>Select a document and start asking questions</p>
                  </div>
                ) : (
                  (showSearch ? filteredMessages : messages).map((msg, index) => (
                    <div
                      key={msg.id || index}
                      className={`p-4 rounded-lg max-w-3xl border-2 shadow-sm ${
                        msg.type === "user"
                          ? "bg-green-100 border-green-600 ml-auto"
                          : msg.type === "bot"
                          ? "bg-amber-100 border-amber-600"
                          : "bg-white border-zinc-200 text-zinc-600 text-sm"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-zinc-800">
                          {msg.type === "user"
                            ? "You"
                            : msg.type === "bot"
                            ? "AI Assistant"
                            : "System"}
                        </span>
                        {msg.type !== "system" && (
                          <button
                            onClick={() =>
                              copyMessageToClipboard(msg.id || index, msg.content)
                            }
                            className="text-zinc-500 hover:text-zinc-700"
                          >
                            {copiedMessageId === (msg.id || index) ? (
                              <Check size={16} />
                            ) : (
                              <Copy size={16} />
                            )}
                          </button>
                        )}
                      </div>
                      {msg.type === "bot" ? (
                        <ReactMarkdown className="text-zinc-800">{msg.content}</ReactMarkdown>
                      ) : (
                        <div className="text-zinc-800">{msg.content}</div>
                      )}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />

                {isLoading && (
                  <div className="p-4 bg-amber-100 border-2 border-amber-300 rounded-lg animate-pulse max-w-3xl">
                    <p className="text-amber-800">wait cooking...</p>
                  </div>
                )}
              </div>

              <form
                onSubmit={handleMessageSubmit}
                className="p-5 bg-white border-t-2 border-zinc-200"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={
                      selectedDocId
                        ? "Ask a question about the document..."
                        : "Please select a document first"
                    }
                    disabled={!selectedDocId || isLoading}
                    className="flex-1 p-3 bg-white border-2 border-amber-200 rounded-lg text-zinc-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    disabled={!selectedDocId || !message.trim() || isLoading}
                    className="px-5 bg-amber-600 border-2 border-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 hover:border-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>

            {/* PDF Viewer Section */}
            {showPdfViewer && selectedDocId && (
              <div className="w-1/2 border-l-2 border-zinc-200 overflow-hidden">
                <PDFViewer documentId={selectedDocId} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PDFRagApp;