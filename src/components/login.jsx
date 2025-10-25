import React, { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router';

const LoginScreen = () => {
    const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (form.email.length <= 0 || form.password.length <= 0) {
      alert('Email or password is missing');
      return;
    }

    setIsLoading(true);

    try {
      // Login API call
      const response = await fetch('https://sikshasathi.nebd.in/api/v1/auth/token', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (data.detail === 'Email and password does not match!') {
        alert('Email and password does not match!');
        setIsLoading(false);
        return;
      }

      console.log('User logged in', data);
      
      // Store token in localStorage
      localStorage.setItem('access_token', data.access_token);
      const token = localStorage.getItem('acce  ss_token');
      console.log('Getting token', token);

      // Fetch user profile
    //   await fetchProfileDetails(token);

      // Redirect to home page
    //   window.location.href = '/chat';
    navigate('/chat')
      
    } catch (error) {
      console.error('Login error:', error);
      alert('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  const fetchProfileDetails = async (token) => {
    try {
      const response = await fetch('https://sikshasathi.nebd.in/api/v1/users/self', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log('Trying to login', data);

      if (data.detail === 'Email and password does not match!') {
        alert('Email and password does not match!');
        return;
      }

      console.log('Fetched user data ->', data);
      
      // Store user data in localStorage (instead of Redux)
      localStorage.setItem('user_data', JSON.stringify({
        user_id: data.user_id,
        name: data.user_full_name,
        email: data.user_email,
        phone: data.user_phone,
      }));

    } catch (error) {
      console.error('Error fetching profile details:', error);
      alert('Something went wrong while fetching profile details');
    }
  };

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-50 p-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-5">
          <GraduationCap size={72} className="text-indigo-600" />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-extrabold text-gray-900 text-center">
          Siksha Sathi
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-gray-600 text-center mt-2 mb-10">
          Welcome back! Please login.
        </p>

        {/* Login Inputs */}
        <div className="w-full space-y-4">
          {/* Email Input */}
          <input
            type="email"
            className="w-full bg-white border border-gray-300 rounded-lg p-4 text-lg text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
            placeholder="Email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => updateForm('email', e.target.value)}
            onKeyPress={handleKeyPress}
          />

          {/* Password Input */}
          <input
            type="password"
            className="w-full bg-white border border-gray-300 rounded-lg p-4 text-lg text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
            placeholder="Password"
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => updateForm('password', e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>

        {/* Forgot Password Link */}
        <div className="flex justify-end mt-3">
          <a
            href="/forgotpass"
            className="text-indigo-600 font-medium text-base hover:text-indigo-700 transition"
          >
            Forgot Password?
          </a>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-lg p-4 mt-8 shadow-lg shadow-indigo-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-white text-xl font-bold">
            {isLoading ? 'Logging in...' : 'Login'}
          </span>
        </button>

        {/* Sign Up Link */}
        <div className="flex justify-center mt-8">
          <span className="text-gray-600 text-base">
            Don't have an account?{' '}
          </span>
          <a
            href="/signup"
            className="text-indigo-600 font-medium text-base hover:text-indigo-700 transition ml-1"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;