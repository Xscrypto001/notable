import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Type, Image, Mic } from 'lucide-react';

const PopupContentAdder = ({ isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('text');

  const togglePopup = () => setIsOpen(!isOpen);

  const TabButton = ({ icon, label, tabName }) => (
    <motion.button
      className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg ${
        activeTab === tabName
          ? 'bg-white text-blue-600'
          : 'bg-blue-100 text-blue-800'
      }`}
      whileHover={{ y: -2 }}
      onClick={() => setActiveTab(tabName)}
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  );

  const TextInput = () => (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Title"
        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <textarea
        placeholder="Contents"
        className="w-full p-2 border rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
        Add
      </button>
    </div>
  );

  const ImageToText = () => (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
        Submit
      </button>
    </div>
  );

  const SpeechToText = () => (
    <div className="space-y-4">
      <button className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center justify-center w-full hover:bg-red-600 transition">
        <Mic className="mr-2" /> Start Recording
      </button>
      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-600 transition">
        Submit
      </button>
    </div>
  );

  return (
    <div className="relative">
      <motion.button
        className={`${
          isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
        } p-2 rounded-full`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={togglePopup}
      >
        <Plus size={20} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 100, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-12 right-20 w-96 bg-white rounded-lg shadow-xl p-4"
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={togglePopup}
            >
              <X size={20} />
            </button>
            <div className="flex space-x-2 mb-4">
              <TabButton icon={<Type size={16} />} label="Text" tabName="text" />
              <TabButton icon={<Image size={16} />} label="Image" tabName="image" />
              <TabButton icon={<Mic size={16} />} label="Speech" tabName="speech" />
            </div>
            {activeTab === 'text' && <TextInput />}
            {activeTab === 'image' && <ImageToText />}
            {activeTab === 'speech' && <SpeechToText />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PopupContentAdder;
