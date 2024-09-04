import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search, ChevronDown, Bell, Settings, User, Plus, FileText, Tag, Folder, Archive, Calendar, ChevronRight, Sun, Moon } from 'lucide-react';

import AllNotes from '../components/ui/AllNotes';
import Tags from '../components/ui/Tags';
import Folders from '../components/ui/Folders';
import Archives from '../components/ui/Archives';
import Calendars from '../components/ui/Calendars'; 



const NotesDashboard = () => {

  

const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [activeMenuItem, setActiveMenuItem] = useState('All Notes');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const menuItems = [
    { name: 'All Notes', icon: <FileText size={15} /> },
    { name: 'Tags', icon: <Tag size={15} /> },
    { name: 'Folders', icon: <Folder size={15} /> },
    { name: 'Archive', icon: <Archive size={15} /> },
    { name: 'Calendar', icon: <Calendar size={15} /> },
  ];

  const filterKeywords = ['Title', 'Content', 'Tags', 'Date'];

  const renderContent = () => {
    switch (activeMenuItem) {
      case 'All Notes':
        return <AllNotes />;
      case 'Tags':
        return <Tags />;
      case 'Folders':
        return <Folders />;
      case 'Archive':
        return <Archives />;
      case 'Calendar':
        return <Calendars />;
      default:
        return <AllNotes />;
    }
  };

  return (
    <div className={`flex h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} font-sans`}>
      {/* Left Sidebar */}
      <motion.div
        className={`w-64 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} p-4 overflow-y-auto`}
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-extrabold mb-6">Notion</h1>
        {menuItems.map((item) => (
          <motion.button
            key={item.name}
            className={`flex items-center w-full p-2 rounded-lg text-sm mb-2 ${
              activeMenuItem === item.name
                ? isDarkMode
                  ? 'bg-blue-600 text-blue-200'
                  : 'bg-blue-100 text-blue-600'
                : isDarkMode
                ? 'hover:bg-gray-700'
                : 'hover:bg-gray-200'
            }`}
            onClick={() => setActiveMenuItem(item.name)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="mr-2">{item.icon}</span>
            {item.name}
            {activeMenuItem === item.name && (
              <motion.div
                className="ml-auto"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight size={16} />
              </motion.div>
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-16 border-b border-gray-200 flex items-center px-4 space-x-4">
          <h1 className="text-2xl font-extrabold tracking-tight"></h1>
          <div className="flex-1 max-w-x98 relative">
            <input
              type="text"
              placeholder="Search..."
              className={`w-full pl-10 pr-4 py-2 rounded-md ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100'} focus:${
                isDarkMode ? 'bg-gray-800 ring-blue-500' : 'bg-white ring-blue-500'
              } focus:ring-2 transition-all duration-300 text-sm`}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={10} />
          </div>
        


          <div className="relative">
      <button
        className={`flex items-center space-x-2 text-sm ${
          isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
        } p-2 rounded-md transition-colors duration-200`}
        onClick={() => setIsFilterOpen(!isFilterOpen)}
      >
        <span className="font-medium">Filter</span>
        <ChevronDown size={8} />
      </button>
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`absolute right-0 mt-2 w-64 ${
              isDarkMode
                ? 'bg-gray-800 text-white'
                : 'bg-white text-gray-800'
            } rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5`}
          >
            {filterKeywords.map((keyword) => (
              <button
                key={keyword}
                className={`flex items-center w-full text-left p-3 ${
                  isDarkMode
                    ? 'hover:bg-gray-700'
                    : 'hover:bg-gray-100'
                } rounded text-sm transition-colors duration-200`}
              >
                <Filter className="mr-3" size={10}>
                  <line x1="4" y1="6" x2="20" y2="6" strokeWidth="2" />
                  <line x1="4" y1="12" x2="14" y2="12" strokeWidth="2" />
                  <line x1="4" y1="18" x2="8" y2="18" strokeWidth="2" />
                </Filter>
                <span className="font-medium" >{keyword}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>






          {/* Theme Switch Button */}
          <button
            className={`p-2 rounded-full transition-colors duration-200 ${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800'}`}
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Notifications Button with Dropdown */}
          <div className="relative">
            <button
              className={`p-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-full transition-colors duration-200`}
              onClick={() => toggleDropdown('notifications')}
            >
              <Bell size={18} />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
            </button>
            <AnimatePresence>
              {activeDropdown === 'notifications' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute right-0 mt-2 w-64 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5`}
                >
                  <div className="px-4 py-2 text-sm font-medium">Notifications</div>
                  {/* Add notification items here */}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Settings Button with Dropdown */}
          <div className="relative">
            <button
              className={`p-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-full transition-colors duration-200`}
              onClick={() => toggleDropdown('settings')}
            >
              <Settings size={18} />
            </button>
            <AnimatePresence>
              {activeDropdown === 'settings' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute right-0 mt-2 w-48 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5`}
                >
                  <div className="px-4 py-2 text-sm font-medium">Settings</div>
                  {/* Add settings items here */}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Button with Dropdown */}
          <div className="relative">
            <button
              className={`w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-black text-sm font-medium`}
              onClick={() => toggleDropdown('profile')}
            >
              JD
            </button>
            <AnimatePresence>
              {activeDropdown === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute right-0 mt-2 w-48 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5`}
                >
                  <div className="px-4 py-2 text-sm font-medium">Profile</div>
                  {/* Add profile items here */}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="flex-1 p-4 overflow-y-auto">{renderContent()}</div>

        
      </div>
    </div>
  );
};

export default NotesDashboard;
