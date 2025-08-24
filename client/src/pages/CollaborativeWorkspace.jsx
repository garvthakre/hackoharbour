import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Share2, Users, FileText, MessageSquare, Loader2 } from 'lucide-react';

const CollaborativeWorkspace = () => {
  const { spaceId } = useParams();
  const navigate = useNavigate();
  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [queryLoading, setQueryLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const chatContainerRef = useRef(null);

  // Fetch space data on component mount
  useEffect(() => {
    fetchSpaceData();
    if (spaceId) {
      fetchChatHistory();
    }
  }, [spaceId]);

  // Scroll to bottom of chat when history changes
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const fetchSpaceData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/spaces/${spaceId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        setSpace(data.space);
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to fetch space data');
        
        // Redirect if unauthorized
        if (res.status === 403) {
          setTimeout(() => navigate('/spaces'), 3000);
        }
      }
    } catch (err) {
      setError('Connection error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchChatHistory = async () => {
    console.log('Fetching chat history for spaceId:', spaceId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/chat/${spaceId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Chat history response status:', res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log('Chat history data:', data);
        
        // Handle both possible response structures
        const messages = data.messages || data || [];
        console.log('Processed messages:', messages);
        setChatHistory(messages);
      } else {
        const errorData = await res.json();
        console.error('Failed to fetch chat history:', errorData);
      }
    } catch (err) {
      console.error('Error fetching chat history:', err);
    }
  };

  const handleSubmitQuery = async (e) => {
    e.preventDefault();
    if (!query.trim() || !space?.documentId?._id) return;
    
    console.log('Submitting query:', {
      documentId: space.documentId._id,
      query: query,
      spaceId: spaceId,
      model: "llama3-70b-8192"
    });
    
    setQueryLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({
          documentId: space.documentId._id,
          query: query,
          spaceId: spaceId,
          model: "llama3-70b-8192"
        })
      });
      
      console.log('Query response status:', res.status);
      const data = await res.json();
      console.log('Query response data:', data);
      
      if (res.ok) {
        // Add a small delay before fetching chat history
        setTimeout(async () => {
          await fetchChatHistory();
          setQuery(''); // Clear input
        }, 500);
      } else {
        console.error('Query failed:', data);
        setError(data.error || 'Failed to get answer');
      }
    } catch (err) {
      console.error('Query error:', err);
      setError('Connection error. Please try again later.');
    } finally {
      setQueryLoading(false);
    }
  };

  // Share space with others
  const shareSpace = () => {
    if (space?.accessToken) {
      navigator.clipboard.writeText(space.accessToken);
      alert('Access token copied to clipboard! Share this with collaborators.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-amber-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-4 md:p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg border-2 border-red-500 p-6">
          <div className="text-center">
            <h1 className="text-xl font-semibold text-red-600 mb-2">Error</h1>
            <p className="text-gray-700">{error}</p>
            {error.includes('Access denied') && (
              <p className="mt-4 text-gray-500">Redirecting to spaces page...</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!space) {
    return (
      <div className="min-h-screen bg-white p-4 md:p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg border-2 border-amber-300 p-6">
          <div className="text-center">
            <h1 className="text-xl font-semibold mb-2">Space Not Found</h1>
            <p className="text-gray-700">The collaborative space you're looking for doesn't exist or you don't have access.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border-2 border-amber-600 p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{space.name}</h1>
              <p className="text-gray-500">{space.description}</p>
              
              <div className="flex flex-wrap items-center mt-4 gap-4 md:gap-6">
                <div className="flex items-center text-sm text-gray-600">
                  <FileText className="h-4 w-4 mr-1 text-amber-600" />
                  <span>{space.documentId?.title || space.documentId?.filename || 'Document'}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-1 text-green-600" />
                  <span>{space?.members?.length || 0} collaborators</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={shareSpace}
              className="flex items-center rounded-md bg-white border-2 border-green-600 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-green-50 transition-colors"
            >
              <Share2 className="h-4 w-4 mr-2 text-green-600" />
              Share
            </button>
          </div>
        </div>
        
        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat area */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border-2 border-amber-600 p-4 md:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Document Q&A</h2>
              <span className="text-sm text-gray-500">Messages: {chatHistory.length}</span>
            </div>
            
            {/* Chat history */}
            <div 
              ref={chatContainerRef}
              className="h-96 overflow-y-auto mb-4 border-2 border-gray-200 rounded-lg p-3 bg-white"
            >
              {chatHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <MessageSquare className="h-10 w-10 text-amber-300 mb-2" />
                  <p className="text-gray-500">Ask questions about the document</p>
                  <p className="text-sm text-gray-400">All collaborators will see the conversation</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {chatHistory.map((message) => {
                    console.log('Rendering message:', message); // Debug log
                    return (
                      <div 
                        key={message._id || message.id} // Use _id first, fallback to id
                        className={`rounded-lg p-3 max-w-[80%] ${
                          message.type === 'question' 
                            ? 'bg-green-100 border-2 border-green-600 ml-auto' 
                            : 'bg-amber-100 border-2 border-amber-600'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs font-medium text-gray-800">
                            {message.type === 'question' 
                              ? (message.userId?.name || message.user?.name || 'You') 
                              : 'AI Assistant'
                            }
                          </span>
                          <span className="text-xs text-gray-500">
                            {message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : 'Now'}
                          </span>
                        </div>
                        <div className="text-sm whitespace-pre-wrap text-gray-800">
                          {message.content || 'No content'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* Query input */}
            <form onSubmit={handleSubmitQuery} className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask a question about the document..."
                className="w-full border-2 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-amber-600"
              />
              <button
                type="submit"
                disabled={queryLoading || !query.trim()}
                className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white rounded-md px-6 py-2 disabled:bg-amber-300 transition-colors"
              >
                {queryLoading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 'Ask'}
              </button>
            </form>
          </div>
          
          {/* Sidebar with members */}
          <div className="bg-white rounded-lg shadow-sm border-2 border-green-600 p-4 md:p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Collaborators</h2>
            <div className="space-y-3">
              {space?.members && space.members.length > 0 ? (
                space.members.map((member, index) => (
                  <div key={member._id || index} className="flex items-center p-2 rounded hover:bg-gray-50 border border-gray-100">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 mr-3 border border-amber-300">
                      {member?.name ? member.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{member?.name || 'User'}</p>
                      <p className="text-xs text-gray-500">{member?.email || ''}</p>
                    </div>
                    {space.createdBy && member?._id === space.createdBy._id && (
                      <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-1 rounded border border-green-300">
                        Creator
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No collaborators yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborativeWorkspace;