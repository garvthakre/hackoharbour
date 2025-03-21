import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Plus, Users, ArrowRight, Loader2 } from 'lucide-react';

const CollaborativeSpace = () => {
  const [view, setView] = useState('main'); // 'main', 'create', 'join'
  const [spaces, setSpaces] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [spaceData, setSpaceData] = useState({
    name: '',
    description: '',
    documentId: '',
    accessToken: ''
  });
  const [joinToken, setJoinToken] = useState('');
  const navigate = useNavigate();

  // Fetch user's spaces and documents on component mount
  useEffect(() => {
    fetchUserSpaces();
    fetchDocuments();
  }, []);

  const fetchUserSpaces = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/spaces', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        setSpaces(data.spaces);
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to fetch spaces');
      }
    } catch (err) {
      setError('Connection error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch documents using the same API endpoint as PDFRagApp
  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents');
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      setError('Failed to fetch documents. Please try again later.');
    }
  };

  const handleInputChange = (e) => {
    setSpaceData({
      ...spaceData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleJoinTokenChange = (e) => {
    setJoinToken(e.target.value);
    setError('');
  };

  const handleCreateSpace = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/spaces/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(spaceData)
      });

      const data = await res.json();
      
      if (res.ok) {
        alert(`Space created! Share this access token with collaborators: ${data.accessToken}`);
        navigate(`/space/${data.spaceId}`);
      } else {
        setError(data.error || 'Failed to create space');
      }
    } catch (err) {
      setError('Connection error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinSpace = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/spaces/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ accessToken: joinToken })
      });

      const data = await res.json();
      
      if (res.ok) {
        navigate(`/space/${data.spaceId}`);
      } else {
        setError(data.error || 'Invalid access token');
      }
    } catch (err) {
      setError('Connection error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderMainView = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Collaborative Spaces</h1>
        <p className="text-zinc-500">Work together with others on PDF documents</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setView('create')}
          className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors"
        >
          <Plus className="h-10 w-10 text-zinc-500 mb-2" />
          <h2 className="text-lg font-medium">Create New Space</h2>
          <p className="text-sm text-zinc-500">Start a new collaborative workspace</p>
        </button>

        <button
          onClick={() => setView('join')}
          className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors"
        >
          <Users className="h-10 w-10 text-zinc-500 mb-2" />
          <h2 className="text-lg font-medium">Join Existing Space</h2>
          <p className="text-sm text-zinc-500">Enter an access token to collaborate</p>
        </button>
      </div>

      {spaces.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Your Spaces</h2>
          <div className="space-y-3">
            {spaces.map(space => (
              <Link
                key={space._id}
                to={`/space/${space._id}`}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-zinc-50"
              >
                <div>
                  <h3 className="font-medium">{space.name}</h3>
                  <p className="text-sm text-zinc-500">{space.description}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-zinc-400" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderCreateView = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Create a Space</h1>
        <p className="text-zinc-500">Set up a new collaborative workspace</p>
      </div>

      <form onSubmit={handleCreateSpace} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Space Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={spaceData.name}
            onChange={handleInputChange}
            required
            className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-950"
            placeholder="Enter a name for your space"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={spaceData.description}
            onChange={handleInputChange}
            className="flex w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-950"
            placeholder="Describe the purpose of this space"
            rows="3"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="documentId" className="text-sm font-medium">
            Select Document
          </label>
          <select
            id="documentId"
            name="documentId"
            value={spaceData.documentId}
            onChange={handleInputChange}
            required
            className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-950"
          >
            <option value="">Select a document</option>
            {documents.map(doc => (
              <option key={doc._id} value={doc._id}>{doc.title}</option>
            ))}
          </select>
        </div>

        {documents.length === 0 && (
          <div className="rounded-md bg-yellow-50 p-3 text-sm text-yellow-700">
            No documents available. Please upload a document in the main app first.
          </div>
        )}

        {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">{error}</div>}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setView('main')}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || documents.length === 0}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="inline mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Space'
            )}
          </button>
        </div>
      </form>
    </div>
  );

  const renderJoinView = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Join a Space</h1>
        <p className="text-zinc-500">Enter the access token to join a workspace</p>
      </div>

      <form onSubmit={handleJoinSpace} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="accessToken" className="text-sm font-medium">
            Access Token
          </label>
          <input
            id="accessToken"
            type="text"
            value={joinToken}
            onChange={handleJoinTokenChange}
            required
            className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-950"
            placeholder="Enter the space access token"
          />
        </div>

        {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">{error}</div>}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setView('main')}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="inline mr-2 h-4 w-4 animate-spin" />
                Joining...
              </>
            ) : (
              'Join Space'
            )}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-md bg-white p-6 rounded-lg shadow-sm">
          {view === 'main' && renderMainView()}
          {view === 'create' && renderCreateView()}
          {view === 'join' && renderJoinView()}
        </div>
      </div>
    </div>
  );
};

export default CollaborativeSpace;