import React, { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router';
const SignupScreen = () => {
    const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (form.email.length <= 0 || form.fullName.length <= 0 || form.password.length <= 0) {
      alert('All fields must be filled');
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    setIsLoading(true);

    try {
      console.log('Signing up', form);

      const response = await fetch('https://sikshasathi.nebd.in/api/v1/users/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_full_name: form.fullName,
          user_email: form.email,
          user_password: form.password,
          user_phone: form.phone,
        }),
      });

      const data = await response.json();
      console.log('User created', data);

      if (data.detail === 'Email Already exists!') {
        alert('Email Already exists!');
        setIsLoading(false);
        return;
      }

      navigate('/chat')
      // Navigate to OTP page
    //   window.location.href = `/otp?phone=${encodeURIComponent(form.phone)}`;

    } catch (error) {
      console.error('Signup error:', error);
      alert('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSignup();
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 md:p-10">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="bg-indigo-100 p-4 rounded-full">
            <GraduationCap size={56} className="text-indigo-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-3">
          Siksha Sathi
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-lg text-gray-600 text-center mb-8">
          Create your account to get started
        </p>

        {/* Signup Inputs */}
        <div className="w-full space-y-5">
          {/* Full Name Input */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              className="w-full h-12 bg-white border border-gray-300 rounded-lg px-4 text-base text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
              placeholder="Enter your full name"
              autoComplete="name"
              value={form.fullName}
              onChange={(e) => updateForm('fullName', e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="w-full h-12 bg-white border border-gray-300 rounded-lg px-4 text-base text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
              placeholder="Enter your email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => updateForm('email', e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>

          {/* Phone Input */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              className="w-full h-12 bg-white border border-gray-300 rounded-lg px-4 text-base text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
              placeholder="Enter your phone number"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => updateForm('phone', e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full h-12 bg-white border border-gray-300 rounded-lg px-4 text-base text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
              placeholder="Create a password"
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => updateForm('password', e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>

          {/* Confirm Password Input */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="w-full h-12 bg-white border border-gray-300 rounded-lg px-4 text-base text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
              placeholder="Re-enter your password"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={(e) => updateForm('confirmPassword', e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>

        {/* Signup Button */}
        <button
          onClick={handleSignup}
          disabled={isLoading}
          className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg mt-6 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
        >
          <span className="text-white text-lg font-semibold">
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </span>
        </button>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Already a member?</span>
          </div>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <a
            href="/"
            className="inline-flex items-center justify-center w-full h-12 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg transition-colors duration-200"
          >
            Login to Your Account
          </a>
        </div>

        {/* Footer Text */}
        <p className="text-xs text-center text-gray-500 mt-8">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default SignupScreen;