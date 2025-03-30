import axios, { AxiosError } from "axios";
import { Form } from "radix-ui";
import { useState } from "react";
import { UserSignUpDto } from "../../types/interfaces/auth/sign-up.dto";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface NewUserResponse {
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  };
  token: string;
}

export function SignUpForm() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UserSignUpDto>({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post<NewUserResponse>(
        "/api/user/register",
        formData
      );
      setFormData({ name: "", email: "", password: "" });

      localStorage.setItem("authToken", response.data.token); // Store token in local storage
      navigate("/home");
      const userName = response.data.user.name;
      const message =
        i18n.language === "ja"
          ? `ようこそ、${userName}さん！`
          : `${t("signIn.signUp.welcome")}, ${userName}`;

      toast(message);
    } catch (_err) {
      const err = _err as AxiosError;
      setError(err.message || "An error occurred during registration.");
    }
  };

  return (
    <Form.Root onSubmit={handleSubmit} className="space-y-4">
      <Form.Field name="name">
        <Form.Label className="text-slate-600">
          {t("signIn.signUp.name")}
        </Form.Label>
        <Form.Control asChild>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
          />
        </Form.Control>
      </Form.Field>

      <Form.Field name="email">
        <Form.Label className="text-slate-600">
          {t("signIn.signUp.email")}
        </Form.Label>
        <Form.Control asChild>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
          />
        </Form.Control>
      </Form.Field>

      <Form.Field name="password">
        <Form.Label className="text-slate-600">
          {t("signIn.signUp.password")}
        </Form.Label>
        <Form.Control asChild>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
          />
        </Form.Control>
      </Form.Field>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <Form.Submit asChild>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          {t("signIn.signUp.title")}
        </button>
      </Form.Submit>
    </Form.Root>
  );
}
