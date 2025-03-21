import React, { useState, useEffect, useRef } from 'react';

function PDFViewer({ documentId, messages }) {
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [highlights, setHighlights] = useState([]);
  const [scale, setScale] = useState(100);
  const iframeRef = useRef(null);
  const viewerInitialized = useRef(false);
  
  // Function to initialize PDF viewer using browser's built-in PDF viewer
  const initPdfViewer = () => {
    if (!documentId || !iframeRef.current || viewerInitialized.current) return;
    
    setIsLoading(true);
    
    // Set iframe source to the PDF with page parameter
    iframeRef.current.src = `/api/document/${documentId}/pdf#page=${pageNumber}&zoom=${scale}`;
    
    // Listen for iframe load event
    iframeRef.current.onload = () => {
      setIsLoading(false);
      viewerInitialized.current = true;
      
      // We'll rely on the API to tell us the total pages instead of trying to access
      // the iframe's content, which might trigger security issues
      fetchPdfMetadata(documentId);
    };
  };
  
  // Fetch PDF metadata from a separate API endpoint
  const fetchPdfMetadata = async (docId) => {
    try {
      const response = await fetch(`/api/document/${docId}/metadata`);
      if (response.ok) {
        const data = await response.json();
        if (data.pageCount) {
          setTotalPages(data.pageCount);
        }
      }
    } catch (error) {
      console.error('Error fetching PDF metadata:', error);
    }
  };
  
  // Initialize viewer when documentId changes
  useEffect(() => {
    if (documentId) {
      viewerInitialized.current = false;
      setPageNumber(1);
      initPdfViewer();
    }
  }, [documentId]);
  
  // Navigate to specific page
  useEffect(() => {
    if (!documentId || !iframeRef.current || !viewerInitialized.current) return;
    
    try {
      // Update iframe source with new page number
      const currentSrc = iframeRef.current.src;
      const baseUrl = currentSrc.split('#')[0];
      iframeRef.current.src = `${baseUrl}#page=${pageNumber}&zoom=${scale}`;
    } catch (error) {
      console.error('Error navigating to page:', error);
    }
  }, [pageNumber, scale, documentId]);
  
  // Extract citations from bot messages
  useEffect(() => {
    if (!messages) return;
    
    const newHighlights = [];
    messages.forEach(msg => {
      if (msg.type === 'bot') {
        // Look for citation patterns like [page 5, paragraph 2]
        const citationRegex = /\[page\s+(\d+)(?:,\s*paragraph\s+(\d+))?\]/g;
        let match;
        while ((match = citationRegex.exec(msg.content)) !== null) {
          newHighlights.push({
            page: parseInt(match[1]),
            paragraph: match[2] ? parseInt(match[2]) : null,
            text: msg.content.substring(Math.max(0, match.index - 40), match.index + match[0].length + 40),
          });
        }
      }
    });
    
    setHighlights(newHighlights);
  }, [messages]);
  
  function changePage(offset) {
    setPageNumber(prevPageNumber => {
      const newPageNumber = prevPageNumber + offset;
      return Math.max(1, totalPages ? Math.min(newPageNumber, totalPages) : newPageNumber);
    });
  }
  
  function zoomIn() {
    setScale(prevScale => Math.min(prevScale + 20, 200));
  }
  
  function zoomOut() {
    setScale(prevScale => Math.max(prevScale - 20, 50));
  }
  
  if (!documentId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
        <p>Select a document to preview</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      <div className="bg-gray-800 p-2 flex justify-between items-center rounded-t-lg">
        <div className="flex gap-2">
          <button 
            onClick={() => changePage(-1)} 
            disabled={pageNumber <= 1}
            className="px-3 py-1 bg-gray-700 rounded-lg disabled:opacity-50"
          >
            ←
          </button>
          <span className="self-center">{pageNumber} {totalPages ? `/ ${totalPages}` : ''}</span>
          <button 
            onClick={() => changePage(1)} 
            disabled={totalPages && pageNumber >= totalPages}
            className="px-3 py-1 bg-gray-700 rounded-lg disabled:opacity-50"
          >
            →
          </button>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={zoomOut}
            className="px-3 py-1 bg-gray-700 rounded-lg"
          >
            –
          </button>
          <span className="self-center">{scale}%</span>
          <button 
            onClick={zoomIn}
            className="px-3 py-1 bg-gray-700 rounded-lg"
          >
            +
          </button>
        </div>
      </div>
      
      <div className="flex-1 relative overflow-hidden bg-gray-900">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="loader animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        <iframe
          ref={iframeRef}
          className="w-full h-full border-0"
          title="PDF Document Viewer"
          sandbox="allow-scripts"
        />
      </div>
      
      {highlights.length > 0 && (
        <div className="mt-2 p-2 bg-gray-800 border-t border-gray-700 text-sm max-h-32 overflow-y-auto">
          <p className="font-semibold mb-1">Citations:</p>
          {highlights.map((highlight, index) => (
            <div 
              key={index} 
              className="mb-1 text-yellow-300 cursor-pointer hover:underline" 
              onClick={() => setPageNumber(highlight.page)}
            >
              Page {highlight.page}: {highlight.text.substring(0, 60)}...
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PDFViewer;