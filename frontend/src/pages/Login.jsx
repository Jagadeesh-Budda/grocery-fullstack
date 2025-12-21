import React from "react";
import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
  e.preventDefault();
  console.log("🔥 handleLogin triggered");

  fetch("http://localhost:8080/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ username, password }),
    credentials: "include",
  })
    .then((res) => {
  if (!res.ok) throw new Error("Invalid credentials");

  // 🔥 THIS WAS MISSING
  localStorage.setItem("isLoggedIn", "true");

  window.location.href = "/groceries";
})

    .catch(() => alert("Invalid credentials"));
};
return (
  <div className="login-page">
    <div className="login-card">
      <h2>Welcome Back</h2>
      <p>Login to manage your groceries</p>

      <form onSubmit={handleLogin}>
        <label>Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />

        <button type="submit" className="login-btn">
          Login
        </button>
      </form>

      <div className="login-footer">
        Don’t have an account? <a href="/register">Sign up</a>
      </div>
    </div>
  </div>
);
}