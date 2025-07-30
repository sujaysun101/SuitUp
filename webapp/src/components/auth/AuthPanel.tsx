import React from 'react';

const AuthPanel: React.FC<{ onSignIn: () => void }> = ({ onSignIn }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-800 to-indigo-900">
    <h1 className="text-4xl font-extrabold text-white mb-4">Resume Tailor</h1>
    <p className="text-lg text-gray-300 mb-8">Sign in with Google to get started</p>
    <button
      onClick={onSignIn}
      className="bg-white text-gray-900 font-semibold px-6 py-3 rounded shadow hover:bg-gray-200 transition"
    >
      Sign in with Google
    </button>
  </div>
);

export default AuthPanel;
