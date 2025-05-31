import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  SearchIcon, BellIcon, QuestionIcon, 
  CreateIcon 
} from '../common/Icons';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const userMenuItems = [
    { label: 'Profile', path: '/profile' },
    { label: 'Account settings', path: '/settings/account' },
    { label: 'Sign out', path: '/logout' },
  ];

  const createMenuItems = [
    { label: 'Create project', path: '/projects/new' },
    { label: 'Create board', path: '/boards/new' },
    { label: 'Create issue', path: '/issues/new' },
  ];

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="h-16 px-4 flex items-center justify-between">
        {/* Left section - Search */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center space-x-4">
          {/* Create button */}
          <div className="relative">
            <button
              onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
              className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              <CreateIcon className="h-4 w-4 mr-2" />
              Create
            </button>

            {/* Create dropdown menu */}
            {isCreateMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                {createMenuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsCreateMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Help */}
          <button className="p-2 text-gray-400 hover:text-gray-500">
            <QuestionIcon className="h-5 w-5" />
          </button>

          {/* Notifications */}
          <button className="p-2 text-gray-400 hover:text-gray-500">
            <BellIcon className="h-5 w-5" />
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center"
            >
              <img
                src="https://via.placeholder.com/32"
                alt="User avatar"
                className="h-8 w-8 rounded-full"
              />
            </button>

            {/* User dropdown menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                {userMenuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
