const originalFetch = window.fetch;

window.fetch = async (...args) => {
  const isServerActive = import.meta.env.VITE_IS_SERVER_ACTIVE;
  if (isServerActive && isServerActive.toLowerCase() === 'false') {
    window.alert("Server is temporarily down");
    return Promise.reject(new Error("Server is temporarily down"));
  }

  let [resource, config] = args;
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (backendUrl && typeof resource === 'string' && resource.startsWith('/')) {
     
      const cleanBackendUrl = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
      resource = `${cleanBackendUrl}${resource}`;
  }

  return originalFetch(resource, config);
};
