import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError(""); // ✅ always clear old errors

    try {
      await login({ username, password });
      setError(""); // ✅ clear error on success
      navigate("/groceries");
    } catch (err) {
      setError("Login failed. Check username or password.");
    }
  }

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form
            onSubmit={handleLogin}
            className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            Welcome back
          </h2>

          {error && (
              <p className="mb-4 text-sm text-red-600 text-center">
                {error}
              </p>
          )}

          <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mb-4 w-full rounded-lg border px-4 py-2"
              required
          />

          <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-6 w-full rounded-lg border px-4 py-2"
              required
          />

          <button
              type="submit"
              className="w-full rounded-lg bg-purple-700 py-2 font-semibold text-white hover:bg-purple-800"
          >
            Enter groceRythm →
          </button>
        </form>
      </div>
  );
}
