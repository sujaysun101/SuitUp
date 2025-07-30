
import React, { useState } from 'react';
import GoogleConnectButton from '../google/GoogleConnectButton';
import GoogleDocsList from '../google/GoogleDocsList';


const ResumePanel: React.FC = () => {
  // TODO: Replace with real Google auth state from backend or context
  const [googleConnected] = useState(true); // Set to true for demo
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  if (!googleConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="mb-4 text-gray-300">Connect your Google account to access your resume.</p>
        <GoogleConnectButton />
      </div>
    );
  }

  if (!selectedDoc) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <GoogleDocsList onSelect={setSelectedDoc} key={refreshKey} />
        <button
          className="mt-4 bg-gray-800 text-gray-200 px-4 py-2 rounded hover:bg-gray-700 transition"
          onClick={() => setRefreshKey(k => k + 1)}
        >
          Refresh Docs
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="flex items-center gap-4 mb-2 w-full justify-between">
        <p className="text-gray-300">Viewing Resume: <span className="font-mono text-indigo-300">{selectedDoc}</span></p>
        <button
          className="bg-gray-800 text-gray-200 px-3 py-1 rounded hover:bg-gray-700 transition text-sm"
          onClick={() => setSelectedDoc(null)}
        >
          Change Doc
        </button>
      </div>
      <iframe
        src={`https://docs.google.com/document/d/${selectedDoc}/edit`}
        title="Resume Document"
        className="w-full max-w-3xl h-[600px] border rounded shadow-lg"
        allowFullScreen
      />
    </div>
  );
};

export default ResumePanel;
