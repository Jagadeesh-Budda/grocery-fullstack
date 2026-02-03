import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import freshProduceImage from "../assets/login/fresh-produce.webp";

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
      const user = await login({ username, password });
      setError(""); // ✅ clear error on success
      if (user.role === "ROLE_ADMIN") {
        navigate("/admin");
      } else {
        navigate("/groceries");
      }
    } catch (err) {
      setError("Login failed. Check username or password.");
    }
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="mx-auto grid md:grid-cols-2 min-h-screen">
        {/* Left visual column - hidden on mobile */}
        <div
          className="hidden md:block relative bg-cover bg-center"
          style={{ backgroundImage: `url(${freshProduceImage})` }}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 h-full w-full flex items-center justify-center p-10">
            <h1 className="text-white text-4xl xl:text-5xl font-extrabold tracking-tight">
              Freshness Delivered
            </h1>
          </div>
        </div>

        {/* Right form column */}
        <div className="flex items-center justify-center p-6 lg:p-10">
          <form
            onSubmit={handleLogin}
            className="bg-grocery-card shadow-glass rounded-xl4 w-full max-w-md p-8"
          >
            <h2 className="text-2xl font-bold mb-2 text-grocery-heading text-center">
              Welcome Back
            </h2>
            <p className="text-grocery-body text-center mb-6">
              Sign in to continue your FreshCartFlow
            </p>

            {error && (
              <p className="mb-4 text-sm text-grocery-dangerText text-center">
                {error}
              </p>
            )}

            <div className="mb-4">
              <label className="block text-sm mb-2 text-grocery-body" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl2 border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-grocery-primary"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm mb-2 text-grocery-body" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl2 border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-grocery-primary"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl2 bg-grocery-primary py-2 font-semibold text-white hover:bg-grocery-primaryHover transition-colors"
            >
              Sign In
            </button>

            <div className="mt-4 flex items-center justify-between text-sm">
              <Link to="/forgot-password" className="text-grocery-primary hover:underline">
                Forgot Password
              </Link>
              <div className="text-grocery-body">
                Don't have an account? {" "}
                <Link to="/register" className="text-grocery-primary hover:underline">
                  Sign Up
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
