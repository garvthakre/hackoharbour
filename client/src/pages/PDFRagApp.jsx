import React, { useState, useEffect, useRef } from "react";
import PDFViewer from "./PDFViewer";
import ReactMarkdown from "react-markdown";
import { Search, Plus, Copy, Check } from "lucide-react";
import { Link } from "react-router";

function PDFRagApp(props) {
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
  const [showPdfViewer, setShowPdfViewer] = useState(true);

  // New state variables for added features
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [copiedMessageId, setCopiedMessageId] = useState(null);

  // User and token state variables (replacing Redux)
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");

  // New state for model selection
  const [availableModels, setAvailableModels] = useState([
    { id: "llama3-70b-8192", name: "llama3-70b-8192" },
    {
      id: "deepseek-r1-distill-llama-70b",
      name: "deepseek-r1-distill-llama-70b",
    },
    { id: "qwen-2.5-32b", name: "qwen-2.5-32b" },
    { id: "gemma2-9b-it", name: "gemma2-9b-it" },
  ]);
  const [selectedModel, setSelectedModel] = useState("llama3-70b-8192");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    if (storedToken) {
      fetchUserInfo(storedToken);
      fetchDocuments(storedToken);
    } else {
      // If no token found, attempt to fetch without authorization
      fetchDocuments();
    }
  }, []);

  useEffect(() => {
    if (user && user._id) {
      fetchUserChats();
    }
  }, [user]);

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
    try {
      const response = await fetch("/api/user/me", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  };

  const fetchDocuments = async (authToken = null) => {
    try {
      const headers = authToken
        ? {
            Authorization: `Bearer ${authToken}`,
          }
        : {};

      const response = await fetch("/api/documents", { headers });
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    }
  };

  const fetchUserChats = async () => {
    if (!user || !user._id) return;

    try {
      const response = await fetch(`/api/chats/user/${user._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
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

      // Include authorization token with upload if available
      const headers = token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {};

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
        };

        setMessages([...messages, systemMessage]);

        if (activeChatId && selectedDocId) {
          await saveMessageToChat(systemMessage);
        }
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

      await createNewChat(docId, selectedDoc.title);
    } else {
      setSelectedDocId("");
      setSelectedDocName("None");
    }
  };

  const handleModelSelect = (e) => {
    setSelectedModel(e.target.value);
  };

  const createNewChat = async (documentId, documentName) => {
    if (!token) {
      // Handle case where user is not authenticated
      setMessages([
        {
          type: "system",
          content: `You selected document: "${documentName}"`,
        },
      ]);
      return;
    }

    if (!user || !user._id) return;
    if (!documentId || !documentName) return;

    setMessages([]);

    const systemMessage = {
      type: "system",
      content: `You selected document: "${documentName}"`,
    };

    setMessages([systemMessage]);

    try {
      const response = await fetch("/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user._id,
          documentId: documentId,
          title: `Chat about ${documentName}`,
          message: systemMessage,
          model: selectedModel, // Changed from modelId to model
        }),
      });

      if (response.ok) {
        const newChat = await response.json();
        setActiveChatId(newChat._id);
        setActiveChatTitle(newChat.title);

        fetchUserChats();
      }
    } catch (error) {
      console.error("Failed to create new chat:", error);
    }
  };

  const loadChat = async (chatId) => {
    try {
      const response = await fetch(`/api/chats/${chatId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const chat = await response.json();
        setActiveChatId(chat._id);
        setActiveChatTitle(chat.title);
        setSelectedDocId(chat.documentId._id);
        setSelectedDocName(chat.documentId.title);
        setMessages(chat.messages);

        // If the chat has a model, update the selected model
        if (chat.model) {
          setSelectedModel(chat.model);
        }
      }
    } catch (error) {
      console.error("Failed to load chat:", error);
    }
  };

  const deleteSelectedChat = async () => {
    if (!activeChatId) return;

    try {
      const response = await fetch(`/api/chats/${activeChatId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setActiveChatId(null);
        setActiveChatTitle("New Chat");
        setMessages([]);

        fetchUserChats();
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  const saveMessageToChat = async (newMessage) => {
    if (!user || !user._id || !activeChatId || !token) return;

    try {
      await fetch("/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chatId: activeChatId,
          userId: user._id,
          documentId: selectedDocId,
          message: newMessage,
          model: selectedModel, // Changed from modelId to model
        }),
      });
    } catch (error) {
      console.error("Failed to save message:", error);
    }
  };

  const handleMessageSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      return;
    }

    if (!selectedDocId) {
      const systemMessage = {
        type: "system",
        content: "Please select a document first.",
      };

      setMessages([...messages, systemMessage]);
      return;
    }

    const userMessage = { type: "user", content: message, id: Date.now() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setMessage("");

    if (activeChatId && token) {
      await saveMessageToChat(userMessage);
    } else if (user && user._id && token) {
      try {
        const response = await fetch("/api/chats", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: user._id,
            documentId: selectedDocId,
            title: `Chat about ${selectedDocName}`,
            message: userMessage,
            model: selectedModel, // Changed from modelId to model
          }),
        });

        if (response.ok) {
          const newChat = await response.json();
          setActiveChatId(newChat._id);
          setActiveChatTitle(newChat.title);
          fetchUserChats();
        }
      } catch (error) {
        console.error("Failed to create new chat:", error);
      }
    }

    setIsLoading(true);

    try {
      // Include authorization token with query request
      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("/api/query", {
        method: "POST",
        headers,
        body: JSON.stringify({
          documentId: selectedDocId,
          query: message,
          model: selectedModel, // Changed from userSelectedModel to model
          spaceId: activeChatId, // Include spaceId if it's needed by the backend
        }),
      });
      console.log("Model Selected by User: ", selectedModel);
      const result = await response.json();
      if (response.ok) {
        const botMessage = {
          type: "bot",
          content: result.answer,
          id: Date.now(),
        };
        setMessages([...updatedMessages, botMessage]);

        if (activeChatId && token) {
          await saveMessageToChat(botMessage);
        }
      } else {
        const errorMessage = {
          type: "system",
          content:
            "Error: " +
            (result.error || "Access denied. Please ensure you are logged in."),
          id: Date.now(),
        };
        setMessages([...updatedMessages, errorMessage]);

        if (activeChatId && token) {
          await saveMessageToChat(errorMessage);
        }
      }
    } catch (error) {
      const errorMessage = {
        type: "system",
        content: "Query failed: " + error.message,
        id: Date.now(),
      };
      setMessages([...updatedMessages, errorMessage]);

      if (activeChatId && token) {
        await saveMessageToChat(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePdfViewer = () => {
    setShowPdfViewer(!showPdfViewer);
  };

  const copyMessageToClipboard = (messageId, content) => {
    navigator.clipboard.writeText(content);
    setCopiedMessageId(messageId);

    setTimeout(() => {
      setCopiedMessageId(null);
    }, 2000);
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
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-72 bg-gray-800 p-5 flex flex-col gap-5 border-r border-gray-700">
          <h2 className="text-lg text-gray-300">My Documents</h2>
          <Link
            className="border-2 border-white text-center rounded-xl "
            to="/spaces"
          >
            Spaces
          </Link>
          <select
            className="p-2 bg-gray-700 rounded-lg text-white w-full"
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

          {/* Model Selection Dropdown */}
          <div>
            <h2 className="text-lg text-gray-300 mb-2">Model</h2>
            <select
              className="p-2 bg-gray-700 rounded-lg text-white w-full"
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

          <div className="flex justify-between items-center">
            <h2 className="text-lg text-gray-300">Chat History</h2>
            <button
              onClick={() =>
                selectedDocId && createNewChat(selectedDocId, selectedDocName)
              }
              className="p-1 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              disabled={!selectedDocId}
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
            {chats.length === 0 ? (
              <div className="text-gray-500 text-sm">No chat history yet</div>
            ) : (
              chats.map((chat) => (
                <div
                  key={chat._id}
                  className={`p-3 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors flex items-center justify-between ${
                    chat._id === activeChatId ? "bg-gray-600" : "bg-gray-700"
                  }`}
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

          {!token && (
            <div className="bg-yellow-800 p-3 rounded-lg text-yellow-200 text-sm">
              <p className="font-bold">Not logged in</p>
              <p>Some features may be limited without authentication</p>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-gray-900">
          {/* Header */}
          <header className="p-5 bg-gray-800 flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <h1 className="text-2xl font-bold">
                {activeChatId ? activeChatTitle : "RAG Chat"}
              </h1>
              {selectedDocId && (
                <div className="flex gap-2">
                  <button
                    onClick={togglePdfViewer}
                    className="py-1 px-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-sm"
                  >
                    {showPdfViewer ? "Hide PDF" : "Show PDF"}
                  </button>
                  <button
                    onClick={toggleSearch}
                    className="py-1 px-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-sm flex items-center gap-1"
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
                className="py-2 px-4 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Select PDF
              </label>
              <button
                type="submit"
                disabled={isLoading || !file}
                className="py-2 px-4 bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Upload & Process
              </button>
            </form>
          </header>

          {uploadStatus && (
            <div className="p-3 bg-gray-800 text-center border-b border-gray-700">
              {uploadStatus}
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Chat Messages */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {showSearch && (
                <div className="p-3 bg-gray-800 border-b border-gray-700">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search in conversation..."
                    className="w-full p-2 bg-gray-700 rounded-lg text-white"
                  />
                </div>
              )}

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {(showSearch ? filteredMessages : messages).map(
                  (msg, index) => (
                    <div
                      key={msg.id || index}
                      className={`p-4 rounded-lg max-w-3xl ${
                        msg.type === "user"
                          ? "bg-blue-700 ml-auto"
                          : msg.type === "bot"
                          ? "bg-gray-700"
                          : "bg-gray-800 border border-gray-700 text-gray-400 text-sm"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium">
                          {msg.type === "user"
                            ? "You"
                            : msg.type === "bot"
                            ? "AI"
                            : "System"}
                        </span>
                        {msg.type !== "system" && (
                          <button
                            onClick={() =>
                              copyMessageToClipboard(
                                msg.id || index,
                                msg.content
                              )
                            }
                            className="text-gray-400 hover:text-white"
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
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      ) : (
                        <div>{msg.content}</div>
                      )}
                    </div>
                  )
                )}
                <div ref={messagesEndRef} />

                {isLoading && (
                  <div className="p-4 bg-gray-700 rounded-lg animate-pulse max-w-3xl">
                    <p>AI is thinking...</p>
                  </div>
                )}
              </div>

              <form
                onSubmit={handleMessageSubmit}
                className="p-5 bg-gray-800 border-t border-gray-700"
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
                    className="flex-1 p-3 bg-gray-700 rounded-lg text-white disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!selectedDocId || !message.trim() || isLoading}
                    className="px-5 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>

            {/* PDF Viewer Section */}
            {showPdfViewer && selectedDocId && (
              <div className="w-1/2 border-l border-gray-700 overflow-hidden">
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
