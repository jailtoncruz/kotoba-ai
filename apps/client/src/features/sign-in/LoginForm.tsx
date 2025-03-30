import axios from "axios";
import { Form } from "radix-ui";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export function LoginForm() {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
    <Form.Root onSubmit={handleLogin} className="space-y-4">
      <Form.Field name="email">
        <Form.Label className="text-slate-600">
          {t("signIn.login.email")}
        </Form.Label>
        <Form.Control asChild>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
          />
        </Form.Control>
      </Form.Field>

      <Form.Field name="password">
        <Form.Label className="text-slate-600">
          {t("signIn.login.password")}
        </Form.Label>
        <Form.Control asChild>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
          />
        </Form.Control>
      </Form.Field>

      {error && (
        <div className="p-3 text-red-600 bg-red-100 border border-red-400 rounded">
          {error}
        </div>
      )}

      <Form.Submit asChild>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition duration-200"
        >
          {t("signIn.login.title")}
        </button>
      </Form.Submit>
    </Form.Root>
  );
}
