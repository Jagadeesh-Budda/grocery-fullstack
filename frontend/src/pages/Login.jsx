import React, { useState } from "react";

export default function Login() {
  const [identifier, setIdentifier] = useState(""); // username OR email
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: identifier, // Spring Security expects "username"
          password: password,
        }),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Invalid credentials");
      }

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", identifier);
      window.location.href = "/groceries";
    } catch (err) {
      alert("Invalid username/email or password");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Illustration - visible only on large screens */}
        <div className="hidden lg:flex items-center justify-center p-8 bg-gradient-to-br from-green-50 to-white">
          <div className="max-w-xs text-center">
            <div className="mx-auto mb-6 w-32 h-32 flex items-center justify-center rounded-lg bg-gradient-to-br from-green-400 to-green-600 text-white text-3xl font-bold shadow-sm">
              G
            </div>

            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              Welcome to GroceryHub
            </h2>
            <p className="text-sm text-slate-600">
              Organize your lists, discover recipes, and shop smarter.
            </p>

            <div className="mt-6">
              <svg
                className="w-full h-40 mx-auto"
                viewBox="0 0 200 160"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <rect
                  x="6"
                  y="40"
                  width="188"
                  height="96"
                  rx="10"
                  fill="#F8FAFC"
                />
                <path
                  d="M30 40c0-11 9-20 20-20h100c11 0 20 9 20 20"
                  stroke="#D1D5DB"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="54" cy="88" r="10" fill="#34D399" />
                <circle cx="94" cy="88" r="10" fill="#60A5FA" />
                <circle cx="134" cy="88" r="10" fill="#FBBF24" />
                <path
                  d="M48 112h104"
                  stroke="#E2E8F0"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-8">
          <div className="flex items-center gap-4 mb-6 lg:hidden">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
              G
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">
                Welcome back
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Sign in to manage your groceries
              </p>
            </div>
          </div>

          <form
            onSubmit={handleLogin}
            className="space-y-5"
            aria-label="Login form"
          >
            <label className="block">
              <span className="text-sm text-slate-600">
                Username or Email
              </span>
              <div className="mt-2 relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter username or email"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-sm text-slate-600">Password</span>
              <div className="mt-2 relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 11c1.657 0 3 1.343 3 3v2H9v-2c0-1.657 1.343-3 3-3z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 11V8a5 5 0 1110 0v3"
                    />
                  </svg>
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg shadow-sm hover:shadow-md transition disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="text-center text-sm text-slate-600 mt-6">
            Don’t have an account?{" "}
            <a
              href="/register"
              className="text-green-600 hover:text-green-700 font-medium hover:underline"
            >
              Create account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
