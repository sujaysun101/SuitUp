import React from 'react';

const Sidebar: React.FC = () => (
  <aside className="w-64 bg-gray-950 text-white p-6 flex flex-col gap-8 min-h-screen border-r border-gray-800">
    <div>
      <h2 className="text-lg font-bold mb-4">Job History</h2>
      <ul className="text-sm text-gray-400 space-y-2">
        <li>Job 1</li>
        <li>Job 2</li>
        <li>Job 3</li>
      </ul>
    </div>
    <div>
      <h2 className="text-lg font-bold mb-4">Resume Versions</h2>
      <ul className="text-sm text-gray-400 space-y-2">
        <li>Version A</li>
        <li>Version B</li>
      </ul>
    </div>
    <div>
      <h2 className="text-lg font-bold mb-4">Suggestions</h2>
      <ul className="text-sm text-gray-400 space-y-2">
        <li>Optimize keywords</li>
        <li>Improve formatting</li>
      </ul>
    </div>
  </aside>
);

export default Sidebar;
