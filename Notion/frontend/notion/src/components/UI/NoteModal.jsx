import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Trash, X } from 'lucide-react';

const NoteModal = ({ note, isOpen, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [noteContent, setNoteContent] = useState('');

  useEffect(() => {
    if (note) {
      setNoteContent(note.content);
    }
  }, [note]);

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => setIsEditing(false);
  const handleChange = (e) => setNoteContent(e.target.value);
  const handleDelete = () => {
    // Add delete logic here
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && note && (
        <motion.div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute top-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 "
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
          >
            <button onClick={onClose} className="absolute top-1 left-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <X size={20} />
            </button>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">{note.title}</h3>
              <div className="flex space-x-2">
                <button onClick={handleEdit}>
                  <Edit3 size={20} className="text-blue-500" />
                </button>
                <button onClick={handleDelete}>
                  <Trash size={20} className="text-red-500" />
                </button>
              </div>
            </div>
            {isEditing ? (
              <textarea
                className="w-full p-2 rounded border border-gray-300 dark:bg-gray-700 dark:text-white"
                rows="10"
                value={noteContent}
                onChange={handleChange}
              />
            ) : (
              <p className="text-gray-800 dark:text-gray-300">{noteContent}</p>
            )}
            {isEditing && (
              <div className="flex justify-end mt-4">
                <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Save
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NoteModal;
