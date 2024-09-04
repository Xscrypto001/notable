import axios from 'axios';



const API_URL = 'http://localhost:8000/api';

export const login = (username, password) => {
  return axios.post(`${API_URL}/auth/login/`, { username, password });
};

export const signup = (username, email, password1, password2) => {
  return axios.post(`${API_URL}/auth/registration/`, { username, email, password1, password2 });
};

export const logout = () => {
  return axios.post(`${API_URL}/auth/logout/`);
};
