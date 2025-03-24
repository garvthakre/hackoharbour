import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Plus, Users, ArrowRight, Loader2, FileText, BarChart2 } from 'lucide-react';

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
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-amber-600">Collaborative Spaces</h1>
        <p className="text-lg text-zinc-600">Work together seamlessly on PDF documents</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => setView('create')}
          className="flex flex-col items-center justify-center p-8 border-2 border-amber-600 rounded-lg hover:bg-amber-50 transition-colors duration-300 shadow-md"
        >
          <Plus className="h-12 w-12 text-amber-600 mb-4" />
          <h2 className="text-xl font-semibold text-amber-700">Create New Space</h2>
          <p className="text-zinc-600 mt-2 text-center">Start a new collaborative workspace and invite others</p>
        </button>

        <button
          onClick={() => setView('join')}
          className="flex flex-col items-center justify-center p-8 border-2 border-green-600 rounded-lg hover:bg-green-50 transition-colors duration-300 shadow-md"
        >
          <Users className="h-12 w-12 text-green-600 mb-4" />
          <h2 className="text-xl font-semibold text-green-700">Join Existing Space</h2>
          <p className="text-zinc-600 mt-2 text-center">Enter an access token to collaborate with others</p>
        </button>
      </div>

      {isLoading && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-10 w-10 text-amber-600 animate-spin" />
        </div>
      )}

      {spaces.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-6 text-green-700 border-b-2 border-green-600 pb-2">Your Spaces</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {spaces.map(space => (
              <Link
                key={space._id}
                to={`/space/${space._id}`}
                className="flex items-center justify-between p-4 border-2 border-zinc-200 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-all duration-300 shadow-sm"
              >
                <div className="flex items-center">
                  <div className="bg-amber-100 p-3 rounded-full mr-4">
                    <FileText className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{space.name}</h3>
                    <p className="text-sm text-zinc-600">{space.description || "No description"}</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-green-600" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {spaces.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center p-8 bg-zinc-50 rounded-lg border border-zinc-200">
          <BarChart2 className="h-16 w-16 text-zinc-300 mb-4" />
          <p className="text-zinc-500 text-center">You haven't created or joined any spaces yet.</p>
          <p className="text-zinc-500 text-center">Get started by creating a new space or joining an existing one.</p>
        </div>
      )}
    </div>
  );

  const renderCreateView = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-amber-600">Create a New Space</h1>
        <p className="text-zinc-600">Set up a collaborative workspace to share with your team</p>
      </div>

      <form onSubmit={handleCreateSpace} className="space-y-6 mt-8">
        <div className="space-y-2">
          <label htmlFor="name" className="text-md font-medium text-zinc-700">
            Space Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={spaceData.name}
            onChange={handleInputChange}
            required
            className="flex h-12 w-full rounded-md border-2 border-amber-200 bg-white px-4 py-2 text-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
            placeholder="Enter a name for your space"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-md font-medium text-zinc-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={spaceData.description}
            onChange={handleInputChange}
            className="flex w-full rounded-md border-2 border-amber-200 bg-white px-4 py-2 text-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
            placeholder="Describe the purpose of this space"
            rows="3"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="documentId" className="text-md font-medium text-zinc-700">
            Select Document
          </label>
          <select
            id="documentId"
            name="documentId"
            value={spaceData.documentId}
            onChange={handleInputChange}
            required
            className="flex h-12 w-full rounded-md border-2 border-amber-200 bg-white px-4 py-2 text-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
          >
            <option value="">Select a document</option>
            {documents.map(doc => (
              <option key={doc._id} value={doc._id}>{doc.title || doc.filename}</option>
            ))}
          </select>
        </div>

        {documents.length === 0 && (
          <div className="rounded-md bg-yellow-50 p-4 text-md text-yellow-700 border border-yellow-200">
            <p className="font-medium">No documents available</p>
            <p className="mt-1">Please upload a document in the main app before creating a space.</p>
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-4 text-md text-red-600 border border-red-200">
            {error}
          </div>
        )}

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={() => setView('main')}
            className="rounded-md border-2 border-zinc-300 px-6 py-3 text-md font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || documents.length === 0}
            className="rounded-md bg-amber-600 border-2 border-amber-600 px-6 py-3 text-md font-medium text-white hover:bg-amber-700 hover:border-amber-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center">
                <Loader2 className="inline mr-2 h-5 w-5 animate-spin" />
                Creating...
              </span>
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
        <h1 className="text-3xl font-bold tracking-tight text-green-600">Join a Space</h1>
        <p className="text-zinc-600">Enter the access token to join a collaborative workspace</p>
      </div>

      <form onSubmit={handleJoinSpace} className="space-y-6 mt-8">
        <div className="space-y-2">
          <label htmlFor="accessToken" className="text-md font-medium text-zinc-700">
            Access Token
          </label>
          <input
            id="accessToken"
            type="text"
            value={joinToken}
            onChange={handleJoinTokenChange}
            required
            className="flex h-12 w-full rounded-md border-2 border-green-200 bg-white px-4 py-2 text-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            placeholder="Enter the space access token"
          />
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 text-md text-red-600 border border-red-200">
            {error}
          </div>
        )}

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={() => setView('main')}
            className="rounded-md border-2 border-zinc-300 px-6 py-3 text-md font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-md bg-green-600 border-2 border-green-600 px-6 py-3 text-md font-medium text-white hover:bg-green-700 hover:border-green-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center">
                <Loader2 className="inline mr-2 h-5 w-5 animate-spin" />
                Joining...
              </span>
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
        <div className="mx-auto max-w-3xl bg-white p-8 rounded-lg shadow-lg border-2 border-zinc-100">
          {view === 'main' && renderMainView()}
          {view === 'create' && renderCreateView()}
          {view === 'join' && renderJoinView()}
        </div>
      </div>
    </div>
  );
};

export default CollaborativeSpace;