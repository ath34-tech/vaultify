// api.js - EmailJS OTP + Backend API
import emailjs from '@emailjs/browser';

// EmailJS Configuration
const EMAILJS_SERVICE_ID = 'service_mxxz34r';
const EMAILJS_TEMPLATE_ID = 'template_5390dul';
const EMAILJS_PUBLIC_KEY = 'yXiUX6ktrILX1BDKv';
// api.js - EmailJS OTP + Backend API


// OTP Generation and Storage
// api.js – Backend OTP + Backend API
export const getAuthToken = () => localStorage.getItem('authToken');

const API_BASE_URL = 'https://vaultify-ndul.onrender.com/api/user';
const VAULT_BASE_URL = 'https://vaultify-ndul.onrender.com/api/vault';

const handleResponse = async (res) => {
    console.log(res);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Network error' }));
    throw new Error(err.message || 'Something went wrong');
  }
  return res.json();
};

export const userAPI = {
  register: (data) =>
    fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        mobile_number: data.mobile,
        password: data.password,
      }),
    }).then(handleResponse),

  login: (creds) =>
    fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(creds),
    }).then(
        handleResponse
        ),

  requestOTP: async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login/otp/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await handleResponse(response);

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        { email: email, passcode: data.otp.code },
        EMAILJS_PUBLIC_KEY
      );

      return data;
    } catch (error) {
      console.error('Failed to send OTP:', error);
      throw error;
    }
  },

  verifyOTP: (email, otp) =>
    fetch(`${API_BASE_URL}/login/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    }).then(handleResponse),

  getProfile: () =>
    fetch(`${API_BASE_URL}/profile`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    }).then(handleResponse),

  updateProfile: (data) =>
    fetch(`${API_BASE_URL}/profile/update`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(handleResponse),
};

export const vaultAPI = {
  addItem: (item) =>
    fetch(`${VAULT_BASE_URL}/addItem`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        platform: item.platform,
        email: item.email || '',
        mobile_number: item.mobile || '',
        username: item.username || '',
        password: item.password,
      }),
    }).then(handleResponse),

  updateItem: (id, item) =>
    fetch(`${VAULT_BASE_URL}/updateItem/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        platform: item.platform,
        email: item.email || '',
        mobile_number: item.mobile || '',
        username: item.username || '',
        password: item.password,
      }),
    }).then(handleResponse),

  getAllItems: () =>
    fetch(`${VAULT_BASE_URL}/getallItems`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    }).then(handleResponse),

  deleteItem: (id) =>
    fetch(`${VAULT_BASE_URL}/deleteItem/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    }).then(handleResponse),
};

export const authUtils = {
  setToken: (t) => localStorage.setItem('authToken', t),
  removeToken: () => localStorage.removeItem('authToken'),
  isAuthenticated: () => !!getAuthToken(),
};
