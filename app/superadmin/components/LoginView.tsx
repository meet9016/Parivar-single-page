"use client";

import React, { useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useSuperAdmin } from "../context/SuperAdminContext";

export default function LoginView() {
  const { loginError, loginLoading, handleLogin } = useSuperAdmin();
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  const onSubmit = (e: React.FormEvent) => {
    handleLogin(e, loginForm);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f6fc] text-[#080b2a] relative overflow-hidden font-sans p-4">
      {/* Dynamic ambient backgrounds */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '1.5s' }}></div>

      <div className="w-full max-w-md p-8 sm:p-10 bg-white border border-[#e2e8f4] rounded-3xl shadow-xl relative z-10">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-[#4338ca] to-indigo-600 bg-clip-text text-transparent">
            Super Admin Parivar
          </h1>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2 tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              required
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              className="w-full px-4 py-3 bg-white text-[#080b2a] placeholder-slate-400 border border-slate-200 hover:border-slate-300 focus:border-[#4338ca]/50 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#4338ca]/10 transition-all duration-300"
              placeholder="superadmin@gmail.com"
              disabled={loginLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2 tracking-wider">
              Password
            </label>
            <input
              type="password"
              required
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              className="w-full px-4 py-3 bg-white text-[#080b2a] placeholder-slate-400 border border-slate-200 hover:border-slate-300 focus:border-[#4338ca]/50 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#4338ca]/10 transition-all duration-300"
              placeholder="••••••••"
              disabled={loginLoading}
            />
          </div>

          {loginError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loginLoading}
            className="w-full mt-2 bg-[#4338ca] hover:bg-[#3730a3] text-white py-3.5 rounded-2xl font-semibold text-sm tracking-wider transition-all duration-300 shadow-md shadow-indigo-500/20 hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loginLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
            <span>{loginLoading ? "Login..." : "Login"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
