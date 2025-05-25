
import React from 'react';

interface HeaderProps {
  title: string;
  onSidebarToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onSidebarToggle }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onSidebarToggle}
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-maastricht-blue">{title}</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
