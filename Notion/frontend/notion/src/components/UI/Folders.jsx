import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Folder, Plus, X } from 'lucide-react';

const Folders = () => {
  const [folders, setFolders] = useState([
    { id: 1, name: 'Work Projects', notes: 5, color: 'bg-blue-500' },
    { id: 2, name: 'Personal Journal', notes: 3, color: 'bg-green-500' },
    { id: 3, name: 'Travel Plans', notes: 2, color: 'bg-purple-500' },
  ]);
  const [newFolder, setNewFolder] = useState('');
  const [showModal, setShowModal] = useState(false);

  const addFolder = () => {
    if (newFolder.trim()) {
      const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-pink-500'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      setFolders([...folders, { id: Date.now(), name: newFolder, notes: 0, color: randomColor }]);
      setNewFolder('');
      setShowModal(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Folders</h2>
        <button
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
          onClick={() => setShowModal(true)}
        >
          <Plus size={16} />
          <span>New Folder</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {folders.map((folder) => (
          <motion.div
            key={folder.id}
            className={`${folder.color} p-4 rounded-lg shadow-md text-white`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <Folder size={24} className="mr-3" />
              <span className="text-sm font-medium">{folder.notes} notes</span>
            </div>
            <h3 className="mt-2 text-xl font-semibold">{folder.name}</h3>
          </motion.div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            className="bg-white rounded shadow-lg p-6 relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-0 right-0 p-2"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold mb-4">Create New Folder</h2>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newFolder}
                onChange={(e) => setNewFolder(e.target.value)}
                placeholder="Folder name"
                className="flex-grow px-4 py-2 border border-gray-300 rounded-md"
              />
              <button
                onClick={addFolder}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Create
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Folders;
