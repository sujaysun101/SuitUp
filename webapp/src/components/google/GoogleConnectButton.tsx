import React from 'react';
import { connectGoogle } from '../../api/google';

const GoogleConnectButton: React.FC = () => (
  <button
    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
    onClick={connectGoogle}
  >
    Connect Google Account
  </button>
);

export default GoogleConnectButton;
