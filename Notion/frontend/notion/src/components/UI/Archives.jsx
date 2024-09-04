import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tag, Folder, Calendar, Archive, Plus, ChevronRight, X } from 'lucide-react';

const Archives = () => {
  const [archivedNotes, setArchivedNotes] = useState([
    { id: 1, title: 'Old Project Notes', archivedDate: '2024-08-15' },
    { id: 2, title: 'Completed To-Do List', archivedDate: '2024-08-20' },
    { id: 3, title: 'Past Meeting Minutes', archivedDate: '2024-08-25' },
  ]);

  const unarchiveNote = (id) => {
    setArchivedNotes(archivedNotes.filter(note => note.id !== id));
    // In a real app, you'd also move this note back to the active notes
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Archives</h2>
      <div className="space-y-3">
        {archivedNotes.map((note) => (
          <motion.div
            key={note.id}
            className="bg-gray-100 p-3 rounded-md flex items-center justify-between"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div>
              <h3 className="font-semibold">{note.title}</h3>
              <p className="text-sm text-gray-500">Archived on {note.archivedDate}</p>
            </div>
            <button
              onClick={() => unarchiveNote(note.id)}
              className="text-blue-500 hover:text-blue-600"
            >
              <ChevronRight size={20} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};


export default Archives;
