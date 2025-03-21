import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Share2, Users, FileText, MessageSquare, Loader2 } from 'lucide-react';

const CollaborativeWorkspace = () => {
  const { spaceId } = useParams();
  const navigate = useNavigate();
  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [queryLoading, setQueryLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  // Fetch space data on component mount
  useEffect(() => {
    fetchSpaceData();
  }, [spaceId]);

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

  const handleSubmitQuery = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setQueryLoading(true);
    const newQuestion = {
      type: 'question',
      content: query,
      timestamp: new Date().toISOString()
    };
    
    // Add to chat history immediately
    setChatHistory(prev => [...prev, newQuestion]);
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          documentId: space.documentId._id,
          query: query,
          spaceId: spaceId // Include spaceId to track conversation in the space
        })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // Add response to chat history
        setChatHistory(prev => [
          ...prev, 
          {
            type: 'answer',
            content: data.answer,
            timestamp: new Date().toISOString()
          }
        ]);
        setQuery(''); // Clear input
      } else {
        setError(data.error || 'Failed to get answer');
      }
    } catch (err) {
      setError('Connection error. Please try again later.');
    } finally {
      setQueryLoading(false);
    }
  };

  // Share space with others
  const shareSpace = () => {
    if (space) {
      navigator.clipboard.writeText(space.accessToken);
      alert('Access token copied to clipboard! Share this with collaborators.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6">
          <div className="text-center">
            <h1 className="text-xl font-semibold text-red-600 mb-2">Error</h1>
            <p className="text-zinc-700">{error}</p>
            {error.includes('Access denied') && (
              <p className="mt-4 text-zinc-500">Redirecting to spaces page...</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!space) {
    return (
      <div className="min-h-screen bg-zinc-50 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6">
          <div className="text-center">
            <h1 className="text-xl font-semibold mb-2">Space Not Found</h1>
            <p className="text-zinc-700">The collaborative space you're looking for doesn't exist or you don't have access.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{space.name}</h1>
              <p className="text-zinc-500">{space.description}</p>
              
              <div className="flex items-center mt-4 space-x-6">
                <div className="flex items-center text-sm text-zinc-600">
                  <FileText className="h-4 w-4 mr-1" />
                  <span>{space.documentId.title || space.documentId.filename}</span>
                </div>
                
                <div className="flex items-center text-sm text-zinc-600">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{space.members.length} collaborators</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={shareSpace}
              className="flex items-center rounded-md bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </button>
          </div>
        </div>
        
        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat area */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Document Q&A</h2>
            </div>
            
            {/* Chat history */}
            <div className="h-96 overflow-y-auto mb-4 border rounded-lg p-3 bg-zinc-50">
              {chatHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <MessageSquare className="h-10 w-10 text-zinc-300 mb-2" />
                  <p className="text-zinc-500">Ask questions about the document</p>
                  <p className="text-sm text-zinc-400">All collaborators will see the conversation</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {chatHistory.map((message, index) => (
                    <div 
                      key={index}
                      className={`rounded-lg p-3 max-w-[80%] ${
                        message.type === 'question' 
                          ? 'bg-zinc-200 ml-auto' 
                          : 'bg-blue-100'
                      }`}
                    >
                      <div className="text-sm">{message.content}</div>
                      <div className="text-xs text-zinc-500 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Query input */}
            <form onSubmit={handleSubmitQuery} className="flex items-center space-x-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask a question about the document..."
                className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={queryLoading || !query.trim()}
                className="bg-blue-600 text-white rounded-md px-4 py-2 disabled:bg-blue-300"
              >
                {queryLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Ask'}
              </button>
            </form>
          </div>
          
          {/* Sidebar with members */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Collaborators</h2>
            <div className="space-y-3">
              {space.members.map((member, index) => (
                <div key={index} className="flex items-center p-2 rounded hover:bg-zinc-50">
                  <div className="w-8 h-8 bg-zinc-200 rounded-full flex items-center justify-center text-zinc-700 mr-3">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-xs text-zinc-500">{member.email}</p>
                  </div>
                  {member._id === space.createdBy._id && (
                    <span className="ml-auto text-xs bg-zinc-100 px-2 py-1 rounded">
                      Creator
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborativeWorkspace;