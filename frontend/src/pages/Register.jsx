import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import api from "../api/axios";
import freshProduceImage from "../assets/login/fresh-produce.webp";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      await api.post("/auth/register", formData);

      alert("Registration successful! Welcome to the circle.");
      navigate("/login"); 
    } catch (err) {
      alert(err.response?.data || "Registration failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-6">
      <div className="max-w-5xl w-full bg-white rounded-[2.5rem] shadow-[0_50px_100px_rgba(59,30,84,0.12)] overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Side: Branding (Matches FreshCartFlow Login) */}
        <div
          className="hidden md:block md:w-1/2 relative bg-cover bg-center"
          style={{ backgroundImage: `url(${freshProduceImage})` }}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 h-full w-full flex items-center justify-center p-10">
            <h1 className="text-white text-4xl xl:text-5xl font-extrabold tracking-tight text-center">
              Your Fresh Journey Begins
            </h1>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-1/2 p-12 flex flex-col justify-center bg-white">
          <div className="mb-10 text-center md:text-left">
            <h3 className="text-3xl font-black text-[#3B1E54] mb-2">Create Account</h3>
            <p className="text-slate-400 font-semibold text-sm">Experience groceries at a higher standard.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="relative group">
              <User size={20} className="absolute left-4 top-4 text-slate-300 group-focus-within:text-[#3B1E54] transition-colors" />
              <input 
                type="text" placeholder="Username" required
                value={formData.username}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#3B1E54]/20 outline-none transition-all font-semibold"
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>

            <div className="relative group">
              <Mail size={20} className="absolute left-4 top-4 text-slate-300 group-focus-within:text-[#3B1E54] transition-colors" />
              <input 
                type="email" placeholder="Email Address" required
                value={formData.email}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#3B1E54]/20 outline-none transition-all font-semibold"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="relative group">
              <Lock size={20} className="absolute left-4 top-4 text-slate-300 group-focus-within:text-[#3B1E54] transition-colors" />
              <input 
                type="password" placeholder="Secure Password" required
                value={formData.password}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#3B1E54]/20 outline-none transition-all font-semibold"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full bg-[#3B1E54] hover:bg-[#2A153D] text-[#D4BDAC] font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Become a Member"}
              <ArrowRight size={20} />
            </button>
          </form>

          <p className="mt-8 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
            Already a member? <button onClick={() => navigate('/login')} className="text-[#3B1E54] hover:underline">Sign In</button>
          </p>
        </div>
      </div>
    </div>
  );
}