import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, X } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Calendars = () => {
  const [events, setEvents] = useState([
    { id: 1, title: 'Team Meeting', date: '2024-09-05', time: '10:00' },
    { id: 2, title: 'Project Deadline', date: '2024-09-15', time: '23:59' },
    { id: 3, title: 'Vacation Start', date: '2024-09-20', time: '09:00' },
  ]);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '' });
  const [isAddingEvent, setIsAddingEvent] = useState(false);

  const addEvent = () => {
    if (newEvent.title && newEvent.date && newEvent.time) {
      setEvents([...events, { ...newEvent, id: Date.now() }]);
      setNewEvent({ title: '', date: '', time: '' });
      setIsAddingEvent(false);
    }
  };

  const handleDateClick = (date) => {
    setNewEvent({ ...newEvent, date: date.toISOString().split('T')[0] });
    setIsAddingEvent(true);
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Calendar</h2>
        <button 
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
          onClick={() => setIsAddingEvent(!isAddingEvent)}
        >
          {isAddingEvent ? <X size={16} /> : <Plus size={16} />}
          <span>{isAddingEvent ? 'Cancel' : 'New Event'}</span>
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold mb-4">Select a Date</h3>
        <DatePicker
          inline
          selected={new Date()}
          onSelect={handleDateClick}
          calendarClassName="bg-white p-4 rounded-lg shadow-md"
        />
      </div>

      {isAddingEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h3 className="text-xl font-bold mb-4">Add New Event</h3>
            <div className="mb-4">
              <input
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="Event note"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <button
              onClick={addEvent}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add Event
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {events.sort((a, b) => new Date(a.date) - new Date(b.date)).map((event) => (
          <motion.div
            key={event.id}
            className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white">
              <div className="text-center">
                <div className="text-xs font-bold">{formatDate(event.date).split(',')[0]}</div>
                <div className="text-lg font-bold">{new Date(event.date).getDate()}</div>
              </div>
            </div>
            <div className="flex-grow">
              <h3 className="text-sm font-semibold text-gray-800">{event.title}</h3>
              <p className="text-xs text-gray-500">
                {formatDate(event.date)}, {event.time}
              </p>
            </div>
            <Calendar size={24} className="text-blue-500 flex-shrink-0" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Calendars;
