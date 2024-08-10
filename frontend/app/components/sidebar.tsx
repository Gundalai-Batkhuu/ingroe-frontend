import React, { useState } from 'react';

export const Sidebar: React.FC = () => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className={`bg-gray-800 text-white h-screen ${expanded ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out`}>
      {/* Logo Area */}
      <div className="flex items-center justify-between p-4">
        <div className={`flex items-center ${expanded ? '' : 'justify-center w-full'}`}>
          {expanded ? (
            <span className="text-2xl font-semibold">Logo</span>
          ) : (
            <span className="text-2xl font-semibold">L</span>
          )}
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-white focus:outline-none"
        >
          {expanded ? '←' : '→'}
        </button>
      </div>

      {/* Navigation Area */}
      <nav className="mt-8">
        <ul>
          {[1, 2, 3, 4].map((item) => (
            <li key={item} className="mb-2">
              <a
                href="#"
                className={`flex items-center p-4 hover:bg-gray-700 ${expanded ? '' : 'justify-center'}`}
              >
                <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
                {expanded && <span className="ml-4">Menu Item {item}</span>}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;