import React from "react";
import { useState } from "react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      if (!res.ok) {
        throw new Error("Registration failed");
      }

      alert("Registration successful. Please login.");
      window.location.href = "/login";
    } catch (err) {
      alert("User already exists or invalid data");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-md border border-slate-200 p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            G
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              Create account
            </h1>
            <p className="text-sm text-slate-500">
              Register to manage your groceries
            </p>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Username */}
          <input
            type="text"
            required
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2.5 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-green-400"
          />

          {/* Email */}
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-green-400"
          />

          {/* Password */}
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-green-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-medium disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Register"}
          </button>
        </form>

        <div className="text-center text-sm text-slate-600 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-green-600 font-medium hover:underline">
            Login here
          </a>
        </div>
      </div>
    </div>
  );
}
