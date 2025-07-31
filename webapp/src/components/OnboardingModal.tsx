import React from 'react';

const OnboardingModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
    <div className="bg-gray-900 rounded-lg p-8 shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold text-white mb-4">Welcome to Resume Tailor!</h2>
      <p className="text-gray-300 mb-6">Connect your Google account and upload or locate your resume to get started.</p>
      <button
        className="w-full bg-indigo-600 text-white py-2 rounded font-semibold hover:bg-indigo-700 transition mb-2"
        onClick={onClose}
      >
        Connect Google Account
      </button>
      <button
        className="w-full bg-gray-700 text-gray-200 py-2 rounded font-semibold hover:bg-gray-600 transition"
        onClick={onClose}
      >
        Upload Resume
      </button>
    </div>
  </div>
);

export default OnboardingModal;
