
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarItem {
  name: string;
  path: string;
  icon: string;
}

const sidebarItems: SidebarItem[] = [
  { name: 'Overview', path: '/', icon: '📊' },
  { name: 'Demographics', path: '/demographics', icon: '👥' },
  { name: 'Survey Analysis', path: '/survey', icon: '📋' },
  { name: 'Comparative Analysis', path: '/comparative', icon: '⚖️' },
  { name: 'Clustering', path: '/clustering', icon: '🎯' },
  { name: 'Correlational Analysis', path: '/correlational', icon: '🔗' },
  { name: 'Technology', path: '/technology', icon: '💻' },
  { name: 'Partnership', path: '/partnership', icon: '🤝' },
  { name: 'Reports', path: '/reports', icon: '📄' },
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed md:relative inset-y-0 left-0 z-50 w-64 bg-sidebar transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">MS</span>
              </div>
              <span className="text-xl font-bold text-sidebar-foreground">MSME Analytics</span>
            </div>
            <button
              onClick={onToggle}
              className="md:hidden text-sidebar-foreground hover:bg-sidebar-accent p-1 rounded"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`sidebar-item group ${isActive ? 'active' : ''}`}
                  onClick={() => window.innerWidth < 768 && onToggle()}
                >
                  <span className="text-xl mr-3">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="text-xs text-sidebar-foreground/60 text-center">
              MSME Analytics Dashboard v1.0
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
