import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Form } from "radix-ui";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/user/login", { email, password });
      const { token } = response.data;
      localStorage.setItem("authToken", token); // Store token in local storage
      navigate("/home"); // Redirect to dashboard or main page
    } catch (err) {
      console.error(err);
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="w-full max-w-md p-8 space-y-4 bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-center text-gray-100 mb-4">
          Login
        </h2>

        {error && (
          <div className="p-3 text-red-600 bg-red-100 border border-red-400 rounded">
            {error}
          </div>
        )}

        <Form.Root onSubmit={handleLogin} className="space-y-4">
          <Form.Field name="email">
            <Form.Label className="block text-gray-300">Email</Form.Label>
            <Form.Control asChild>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring focus:border-blue-500"
              />
            </Form.Control>
          </Form.Field>

          <Form.Field name="password">
            <Form.Label className="block text-gray-300">Password</Form.Label>
            <Form.Control asChild>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring focus:border-blue-500"
              />
            </Form.Control>
          </Form.Field>

          <Form.Submit asChild>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Login
            </button>
          </Form.Submit>
        </Form.Root>
        <div className="text-center">
          <Link to="sign-up" className="text-indigo-500 hover:underline">
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
