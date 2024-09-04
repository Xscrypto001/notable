import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../UI/Input';
import Button from '../UI/Button';
import { signup } from '../../services/api';
import { motion } from 'framer-motion';

const SignupForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password1 !== password2) {
      setError('Passwords do not match');
      return;
    }
    try {
      await signup(username, email, password1, password2);
      navigate('/login');
    } catch (err) {
      setError('Error creating account. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500"
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Note-Tastic Signup</h1>
        <p className="text-center text-gray-600 mb-6">"Join us and never miss a note again"</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Input
            label="Username"
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Pick a unique username"
          />
          <Input
            label="Email address"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Your email address"
          />
          <Input
            label="Password"
            type="password"
            name="password1"
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
            required
            placeholder="Create a strong password"
          />
          <Input
            label="Confirm Password"
            type="password"
            name="password2"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
            placeholder="Re-enter your password"
          />
          <Button type="submit" className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-2 rounded-md hover:from-green-700 hover:to-blue-700 transition-colors duration-300">
            Sign up
          </Button>
        </form>
        <p className="text-center text-gray-500 mt-6">
          Already have an account? <a href="/login" className="text-blue-500 hover:underline">Sign in</a>
        </p>
      </div>
    </motion.div>
  );
};

export default SignupForm;
