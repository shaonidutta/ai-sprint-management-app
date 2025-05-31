import React from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../../components/common';

const Register = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement registration logic
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <Input
              id="name"
              name="name"
              type="text"
              label="Full name"
              required
              fullWidth
            />
            <Input
              id="email"
              name="email"
              type="email"
              label="Email address"
              required
              fullWidth
            />
            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              required
              fullWidth
            />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm password"
              required
              fullWidth
            />
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create account
            </button>
          </div>

          <div className="text-sm text-center">
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register; 