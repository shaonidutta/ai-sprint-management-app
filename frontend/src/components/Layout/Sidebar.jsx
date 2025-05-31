import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HomeIcon, ViewBoardsIcon, ProjectIcon, 
  SprintIcon, SettingsIcon, AIIcon 
} from '../common/Icons';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { path: '/dashboard', icon: HomeIcon, label: 'Dashboard' },
    { path: '/projects', icon: ProjectIcon, label: 'Projects' },
    { path: '/boards', icon: ViewBoardsIcon, label: 'Boards' },
    { path: '/sprints', icon: SprintIcon, label: 'Sprints' },
    { path: '/ai-features', icon: AIIcon, label: 'AI Features' },
    { path: '/settings', icon: SettingsIcon, label: 'Settings' },
  ];

  return (
    <aside 
      className={`
        bg-gray-900 text-white transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
        {!isCollapsed && (
          <span className="text-xl font-semibold">Sprint Manager</span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded hover:bg-gray-800"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-4">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => `
              flex items-center px-4 py-3 text-sm
              ${isActive ? 'bg-blue-600' : 'hover:bg-gray-800'}
              transition-colors duration-200
            `}
          >
            <Icon className={`h-5 w-5 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
            {!isCollapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User Section */}
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
        {!isCollapsed && (
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-700 mr-3" />
            <div className="flex-1">
              <div className="text-sm font-medium">John Doe</div>
              <div className="text-xs text-gray-400">john@example.com</div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
