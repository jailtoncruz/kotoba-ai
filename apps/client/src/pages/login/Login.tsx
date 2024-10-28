import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Form from '@radix-ui/react-form';
import axios from 'axios';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/user/login', { email, password });
      const { token } = response.data;
      localStorage.setItem('authToken', token); // Store token in local storage
      navigate('/home'); // Redirect to dashboard or main page
    } catch (err) {
      console.error(err);
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800">Login</h2>

        {error && (
          <div className="p-3 text-red-600 bg-red-100 border border-red-400 rounded">
            {error}
          </div>
        )}

        <Form.Root onSubmit={handleLogin} className="space-y-4">
          <Form.Field name="email">
            <Form.Label className="block text-gray-600">Email</Form.Label>
            <Form.Control asChild>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </Form.Control>
          </Form.Field>

          <Form.Field name="password">
            <Form.Label className="block text-gray-600">Password</Form.Label>
            <Form.Control asChild>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </Form.Control>
          </Form.Field>

          <Form.Submit asChild>
            <button
              type="submit"
              className="w-full px-4 py-2 font-semibold text-white bg-indigo-500 rounded hover:bg-indigo-600"
            >
              Login
            </button>
          </Form.Submit>
        </Form.Root>
      </div>
    </div>
  );
};