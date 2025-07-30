import React from 'react';

const OnboardingJobSiteModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
    <div className="bg-gray-900 rounded-lg p-8 shadow-lg w-full max-w-md text-center">
      <h2 className="text-2xl font-bold text-white mb-4">Get Started</h2>
      <p className="text-gray-300 mb-6">
        To begin, navigate to a job site, open a job posting, and click the Resume Tailor extension.<br />
        Then click <span className="font-semibold text-indigo-400">Analyze Job and Tailor Resume</span> in the extension popup.
      </p>
      <button
        className="w-full bg-indigo-600 text-white py-2 rounded font-semibold hover:bg-indigo-700 transition"
        onClick={onClose}
      >
        Got it!
      </button>
    </div>
  </div>
);

export default OnboardingJobSiteModal;
