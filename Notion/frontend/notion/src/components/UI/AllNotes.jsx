import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, Clock, Paperclip, MoreVertical, Edit3 } from 'lucide-react';
import { format } from 'date-fns';
import PopupContentAdder from './AddButton';
import NoteModal from './NoteModal';

const AllNotes = ({ isDarkMode }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('date');
  const [filterBy, setFilterBy] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setNotes([
        { id: 1, title: 'Project kickoff meeting', content: 'Discuss project goals and timeline', tags: ['work', 'meeting'], folder: 'Work', created_at: '2024-09-01T10:00:00Z', updated_at: '2024-09-01T10:00:00Z', content_word_count: 42 },
        { id: 2, title: 'Grocery list', content: 'Milk, eggs, bread, vegetables', tags: ['personal', 'shopping'], folder: 'Personal', created_at: '2024-09-02T14:30:00Z', updated_at: '2024-09-02T15:45:00Z', content_word_count: 28 },
        { id: 3, title: 'Book review: The Great Gatsby', content: 'Analysis of themes and characters', tags: ['reading', 'literature'], folder: 'Books', created_at: '2024-09-03T20:15:00Z', updated_at: '2024-09-04T09:20:00Z', content_word_count: 156 },
        // Add more mock notes here
      ]);
      setLoading(false);
    }, 1500);
  }, []);

  const handleNoteAction = (action, note) => {
    if (action === 'edit') {
      setSelectedNote(note);
    }
  };

  const handleCloseModal = () => {
    setSelectedNote(null);
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  ).filter(note => filterBy === 'all' || note.folder.toLowerCase() === filterBy.toLowerCase());

  const sortedNotes = filteredNotes.sort((a, b) => {
    if (sortBy === 'date') return new Date(b.created_at) - new Date(a.created_at);
    if (sortBy === 'word_count') return b.content_word_count - a.content_word_count;
    return 0;
  });

  const SkeletonNote = () => (
    <div className={`p-4 rounded-lg animate-pulse h-64 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
      <div className={`h-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded w-3/4 mb-2`}></div>
      <div className={`h-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded w-1/2 mb-2`}></div>
      <div className={`h-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded w-1/4`}></div>
    </div>
  );

  const tagColors = {
    work: 'bg-blue-200 text-blue-800',
    personal: 'bg-green-200 text-green-800',
    books: 'bg-purple-200 text-purple-800',
    shopping: 'bg-orange-200 text-orange-800',
    meeting: 'bg-red-200 text-red-800',
    literature: 'bg-yellow-200 text-yellow-800',
    reading: 'bg-pink-200 text-pink-800'
  };

  const borderColors = {
    work: 'border-blue-500',
    personal: 'border-green-500',
    books: 'border-purple-500',
    shopping: 'border-orange-500',
    meeting: 'border-red-500',
    literature: 'border-yellow-500',
    reading: 'border-pink-500'
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Notes</h2>
        <PopupContentAdder />
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search notes..."
            className={`w-full pl-10 pr-4 py-2 rounded-full ${
              isDarkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className={`absolute left-3 top-2.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} size={16} />
        </div>
        <div className="flex items-center space-x-2">
          <select
            className={`border rounded-md p-1 text-sm ${
              isDarkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'
            }`}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Sort by Date</option>
            <option value="word_count">Sort by Word Count</option>
          </select>
          <select
            className={`border rounded-md p-1 text-sm ${
              isDarkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'
            }`}
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
          >
            <option value="all">All Folders</option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="books">Books</option>
          </select>
        </div>
      </div>

      <AnimatePresence>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <SkeletonNote />
            <SkeletonNote />
            <SkeletonNote />
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {sortedNotes.map((note) => (
              <motion.div
                key={note.id}
                className={`p-4 rounded-lg shadow-sm border ${borderColors[note.tags[0].toLowerCase()] || 'border-gray-600'} hover:shadow-md transition-shadow duration-200 flex flex-col h-full ${
                  isDarkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'
                }`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleNoteAction('edit', note)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold truncate">{note.title}</h3>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => handleNoteAction('star', note.id)}>
                      <Star size={16} className={`${isDarkMode ? 'text-yellow-400 hover:text-yellow-300' : 'text-yellow-400 hover:text-yellow-500'}`} />
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleNoteAction('edit', note)}
                    >
                      <Edit3 size={20} className={`${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-400 hover:text-blue-500'}`} />
                    </motion.button>
                    <button onClick={() => handleNoteAction('more', note.id)}>
                      <MoreVertical size={16} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </button>
                  </div>
                </div>
                <p className="text-sm mb-4 line-clamp-3">{note.content}</p>
                <div className="flex justify-between items-center mt-auto">
                  <div className="flex items-center space-x-2">
                    {note.tags.map((tag, index) => (
                      <span key={index} className={`px-2 py-1 rounded-full text-xs font-semibold ${tagColors[tag.toLowerCase()] || 'bg-gray-300 text-gray-800'}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">{format(new Date(note.created_at), 'MMM dd, yyyy')}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {selectedNote && (
        <NoteModal note={selectedNote} isOpen={!!selectedNote} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default AllNotes;
