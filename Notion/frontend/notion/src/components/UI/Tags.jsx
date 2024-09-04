import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tag, Folder, Calendar, Archive, Plus, ChevronRight, X } from 'lucide-react';

// Tags Component
const Tags = () => {
  const [tags, setTags] = useState([
    { id: 1, name: 'Work', color: 'bg-blue-500' },
    { id: 2, name: 'Personal', color: 'bg-green-500' },
    { id: 3, name: 'Ideas', color: 'bg-yellow-500' },
  ]);
  const [newTag, setNewTag] = useState('');

  const addTag = () => {
    if (newTag.trim()) {
      setTags([...tags, { id: Date.now(), name: newTag, color: `bg-${getRandomColor()}-500` }]);
      setNewTag('');
    }
  };

  const getRandomColor = () => {
    const colors = ['red', 'blue', 'green', 'yellow', 'indigo', 'purple', 'pink'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Tags</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag) => (
          <motion.div
            key={tag.id}
            className={`${tag.color} text-white px-3 py-1 rounded-full flex items-center`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Tag size={14} className="mr-2" />
            <span>{tag.name}</span>
          </motion.div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="New tag"
          className="flex-grow px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addTag}
          className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
};


export default Tags;
