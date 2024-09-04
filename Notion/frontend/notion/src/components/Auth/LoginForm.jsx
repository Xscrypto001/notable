import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../UI/Input';
import Button from '../UI/Button';
import { login } from '../../services/api';
import { motion } from 'framer-motion';


const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await login(username, password);
      localStorage.setItem('token', response.data.key);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-500 to-blue-500"
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Note-Tastic Login</h1>
        <p className="text-center text-gray-600 mb-6">"Because every great idea starts with a note"</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Input
            label="Username"
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter your note-worthy username"
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your secret note password"
          />
          <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-md hover:from-purple-700 hover:to-blue-700 transition-colors duration-300">
            Sign in
          </Button>
        </form>
        <p className="text-center text-gray-500 mt-6">
          Forgot your password? Don't worry, it happens to the best note-takers!

                
        </p>
        &nbsp;&nbsp;<Link to="/signup" className="item:center font-medium text-indigo-600 hover:text-indigo-500">
            </Link>  
            <p className="text-center text-gray-500 mt-6">
            New Note Taker?  <a href="/signup" className="text-blue-500 hover:underline">lets get you started </a>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginForm;
