import React, { useEffect, useState } from 'react';
import { fetchGoogleDocs } from '../../api/google';

const GoogleDocsList: React.FC<{ onSelect: (docId: string) => void }> = ({ onSelect }) => {
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoogleDocs().then(res => {
      setDocs(res.data.docs || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-gray-400">Loading Google Docs...</div>;

  return (
    <div>
      <h3 className="text-lg font-bold mb-2">Your Google Docs</h3>
      <ul className="space-y-2">
        {docs.map(doc => (
          <li key={doc.id}>
            <button
              className="underline text-blue-400 hover:text-blue-600"
              onClick={() => onSelect(doc.id)}
            >
              {doc.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GoogleDocsList;
