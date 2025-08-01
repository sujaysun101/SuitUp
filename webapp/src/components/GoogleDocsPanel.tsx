import React, { useEffect, useState, useRef } from "react";

const SCOPES = [
  "https://www.googleapis.com/auth/drive.readonly",
  "https://www.googleapis.com/auth/drive.file", 
  "https://www.googleapis.com/auth/documents.readonly",
  "https://www.googleapis.com/auth/documents",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email"
].join(" ");


const GoogleDocsPanel: React.FC = () => {
  const [gisLoaded, setGisLoaded] = useState(false);
  const [gapiLoaded, setGapiLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [iframeUrl, setIframeUrl] = useState<string>('https://docs.google.com/document/u/0/?usp=docs_web&tgif=d');
  
  const clientRef = useRef<any>(null);

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  
  console.log("Environment check:");
  console.log("- VITE_GOOGLE_CLIENT_ID:", clientId);
  console.log("- All env vars:", import.meta.env);
  console.log("- Mode:", import.meta.env.MODE);

  // Load Google Identity Services and GAPI
  useEffect(() => {
    console.log("Loading Google APIs...");
    
    // Load Google Identity Services (GIS)
    const gisScript = document.createElement("script");
    gisScript.src = "https://accounts.google.com/gsi/client";
    gisScript.onload = () => {
      console.log("Google Identity Services loaded");
      setGisLoaded(true);
    };
    gisScript.onerror = () => {
      console.error("Failed to load Google Identity Services");
      setError("Failed to load Google Identity Services");
    };
    document.body.appendChild(gisScript);

    // Load Google API Platform Library (GAPI)
    const gapiScript = document.createElement("script");
    gapiScript.src = "https://apis.google.com/js/api.js";
    gapiScript.onload = () => {
      console.log("Google API Platform Library loaded");
      setGapiLoaded(true);
    };
    gapiScript.onerror = () => {
      console.error("Failed to load Google API Platform Library");
      setError("Failed to load Google API Platform Library");
    };
    document.body.appendChild(gapiScript);

    return () => {
      if (document.body.contains(gisScript)) {
        document.body.removeChild(gisScript);
      }
      if (document.body.contains(gapiScript)) {
        document.body.removeChild(gapiScript);
      }
    };
  }, []);

  // Initialize Google APIs when both are loaded
  useEffect(() => {
    if (!gisLoaded || !gapiLoaded || !clientId) {
      console.log("APIs not ready:", { gisLoaded, gapiLoaded, clientId: !!clientId });
      return;
    }

    console.log("Initializing Google APIs with clientId:", clientId);

    // Initialize GAPI client
    // @ts-ignore
    window.gapi.load("client", async () => {
      try {
        // @ts-ignore
        await window.gapi.client.init({
          discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
            "https://www.googleapis.com/discovery/v1/apis/docs/v1/rest"
          ]
        });
        console.log("GAPI client initialized successfully");
        
        // Initialize Google Identity Services client
        // @ts-ignore
        clientRef.current = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: SCOPES,
          callback: (response: any) => {
            console.log("Token response:", response);
            if (response.access_token) {
              setAccessToken(response.access_token);
              setIsSignedIn(true);
              setError(null);
              // @ts-ignore
              window.gapi.client.setToken({ access_token: response.access_token });
            } else {
              console.error("No access token received");
              setError("Authentication failed - no access token received");
            }
          },
          error_callback: (error: any) => {
            console.error("OAuth error:", error);
            if (error.type === 'access_denied') {
              setError(`Access denied. Please add your email (${error.details || 'your email'}) as a test user in Google Cloud Console → OAuth consent screen → Test users.`);
            } else {
              setError(`Authentication failed: ${error.type || 'Unknown error'}`);
            }
          }
        });
        
        console.log("Google Identity Services client initialized");
        setError(null);
      } catch (error: any) {
        console.error("Google API initialization failed:", error);
        console.error("Error details:", JSON.stringify(error, null, 2));
        const currentOrigin = window.location.origin;
        setError(`Google API initialization failed. Please add ${currentOrigin} to your Google Cloud Console OAuth authorized origins. Error: ${error.message || 'Unknown error'}`);
      }
    });
  }, [gisLoaded, gapiLoaded, clientId]);

  // Sign in/out handlers
  const handleSignIn = async () => {
    try {
      console.log("Attempting Google sign in with modern GIS...");
      if (!clientRef.current) {
        console.error("Google Identity Services client not initialized");
        setError("Google authentication not initialized. Please refresh the page.");
        return;
      }
      
      console.log("Requesting access token...");
      clientRef.current.requestAccessToken();
    } catch (error: any) {
      console.error("Sign in error:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      setError(`Sign in failed: ${error.message || 'Unknown error'}`);
    }
  };
  
  const handleSignOut = () => {
    console.log("Signing out...");
    if (accessToken) {
      // @ts-ignore
      window.google.accounts.oauth2.revoke(accessToken, () => {
        console.log("Token revoked");
      });
    }
    setIsSignedIn(false);
    setAccessToken(null);
    setError(null);
    // @ts-ignore
    if (window.gapi.client) {
      // @ts-ignore
      window.gapi.client.setToken(null);
    }
  };

  return (
    <div className="flex-1 mx-4 my-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg flex flex-col items-center p-8">
      <div className="text-white/80 text-xl mb-6">📝 Google Docs Integration</div>
      
      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm max-w-md text-center">
          {error}
        </div>
      )}
      
      {!isSignedIn ? (
        <div className="text-center">
          <p className="text-white/70 mb-6 max-w-md">
            Connect your Google account to access and edit your resume directly in Google Docs. 
            All changes will be automatically saved to your Google Drive.
          </p>
          <button 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 mb-6 disabled:opacity-50" 
            onClick={handleSignIn}
            disabled={!!error}
          >
            🔗 Connect Google Account
          </button>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div className="text-white/70 text-sm">✅ Connected to Google Docs</div>
            <div className="flex gap-2">
              <button
                onClick={() => setIframeUrl('https://docs.google.com/document/u/0/?usp=docs_web&tgif=d')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                📝 Docs Home
              </button>
              <button
                onClick={() => setIframeUrl('https://docs.google.com/document/create?usp=docs_web')}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                ➕ New Doc
              </button>
              <button 
                className="bg-red-500/80 hover:bg-red-500 text-white px-3 py-1 rounded text-sm transition-colors" 
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </div>
          </div>
          
          <div className="flex-1 bg-white rounded-lg overflow-hidden shadow-2xl relative">
            {/* Embedded Google Docs Interface */}
            <iframe
              title="Google Docs"
              src={iframeUrl}
              className="w-full h-full border-none min-h-[600px]"
              allow="clipboard-read; clipboard-write; camera; microphone"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads allow-modals allow-storage-access-by-user-activation"
            />
            
            {/* Fallback message if iframe is blocked */}
            <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-white p-4 rounded-lg shadow-lg text-center max-w-md pointer-events-auto">
                <p className="text-gray-700 mb-3">
                  If Google Docs doesn't load above, it may be due to browser security settings.
                </p>
                <button
                  onClick={() => window.open(iframeUrl, '_blank')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                >
                  Open in New Tab
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <div className="text-white/60 text-sm mb-2">
              💡 <strong>How to use:</strong>
            </div>
            <div className="text-white/50 text-xs max-w-2xl mx-auto">
              Use Google Docs above to edit your resume. Click "New Doc" to create a fresh resume or "Docs Home" to access existing documents. 
              All changes are automatically saved to your Google Drive. Use the AI chat on the right for personalized suggestions.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleDocsPanel;
