import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { Link } from "react-router-dom";
import * as Form from "@radix-ui/react-form";

interface UserSignUpDto {
  name: string;
  email: string;
  password: string;
}

export function SignUp() {
  const [formData, setFormData] = useState<UserSignUpDto>({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("/api/user/register", formData);
      setSuccess("User registered successfully!");
      setFormData({ name: "", email: "", password: "" });
      console.log(response.data);
    } catch (_err) {
      const err = _err as AxiosError;
      setError(err.message || "An error occurred during registration.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="w-full max-w-md p-8 space-y-4 bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-center text-gray-100 mb-4">
          Sign Up
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && (
          <p className="text-green-500 text-center mb-4">{success}</p>
        )}

        <Form.Root onSubmit={handleSubmit} className="space-y-4">
          <Form.Field name="name">
            <Form.Label className="block text-gray-300">Name</Form.Label>
            <Form.Control asChild>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring focus:border-blue-500"
              />
            </Form.Control>
          </Form.Field>

          <Form.Field name="email">
            <Form.Label className="block text-gray-300">Email</Form.Label>
            <Form.Control asChild>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
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
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring focus:border-blue-500"
              />
            </Form.Control>
          </Form.Field>

          <Form.Submit asChild>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Sign Up
            </button>
          </Form.Submit>
        </Form.Root>

        <div className="text-center">
          <Link to="/sign-in" className="text-indigo-500 hover:underline">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
