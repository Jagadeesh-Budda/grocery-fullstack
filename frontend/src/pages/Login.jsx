import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ identifier: '', password: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    const role = formData.identifier.toLowerCase().includes('admin')
      ? 'ROLE_ADMIN'
      : 'ROLE_USER';

    localStorage.setItem(
      'user',
      JSON.stringify({ username: formData.identifier, role })
    );
    localStorage.setItem('token', 'token_val');

    navigate(role === 'ROLE_ADMIN' ? '/admin' : '/groceries');
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-6">
      <div className="max-w-5xl w-full bg-white rounded-[2.5rem] shadow-[0_50px_100px_rgba(59,30,84,0.12)] overflow-hidden flex flex-col md:flex-row min-h-[600px]">

        {/* Left Side: Branding */}
        <div className="md:w-1/2 bg-[#3B1E54] p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4BDAC]/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-16">
              <div className="w-12 h-12 bg-[#D4BDAC] rounded-2xl flex items-center justify-center text-[#3B1E54] shadow-lg">
                <ShoppingCart size={24} strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-black tracking-tight">
                Cartvera
              </span>
            </div>

            <h2 className="text-4xl font-bold leading-tight mb-6">
              Freshness you can <br />
              <span className="text-[#D4BDAC] italic">trust.</span>
            </h2>

            <p className="text-white/70 font-medium leading-relaxed max-w-sm">
              Smart daily groceries delivered reliably to your doorstep.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#D4BDAC]">
            <ShieldCheck size={14} />
            Secure & Trusted Platform
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-1/2 p-16 flex flex-col justify-center bg-white">
          <div className="mb-12">
            <h3 className="text-3xl font-black text-[#3B1E54] mb-3">
              Welcome back to Cartvera
            </h3>
            <p className="text-slate-400 font-semibold text-sm">
              Sign in to manage your daily essentials.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                Email or Mobile
              </label>
              <div className="relative group">
                <User
                  className="absolute left-4 top-4 text-slate-300 group-focus-within:text-[#3B1E54] transition-colors"
                  size={20}
                />
                <input
                  type="text"
                  required
                  value={formData.identifier}
                  onChange={(e) =>
                    setFormData({ ...formData, identifier: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#3B1E54]/20 outline-none transition-all font-semibold text-slate-700"
                  placeholder="Enter email or mobile"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                Password
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-4 text-slate-300 group-focus-within:text-[#3B1E54] transition-colors"
                  size={20}
                />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#3B1E54]/20 outline-none transition-all font-semibold text-slate-700"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#3B1E54] hover:bg-[#2A153D] text-[#D4BDAC] font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] shadow-2xl shadow-[#3B1E54]/20"
            >
              Enter Cartvera
              <ArrowRight size={20} />
            </button>
          </form>

          <p className="mt-10 text-center text-slate-400 text-xs font-bold">
            Not a member?{' '}
            <button className="text-[#3B1E54] hover:underline">
              Create an account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
