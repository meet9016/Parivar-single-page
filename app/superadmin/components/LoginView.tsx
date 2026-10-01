"use client";

import React, { useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useSuperAdmin } from "../context/SuperAdminContext";

export default function LoginView() {
  const { loginError, loginLoading, handleLogin } = useSuperAdmin();
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [formErrors, setFormErrors] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  React.useEffect(() => {
    const saved = localStorage.getItem("parivar_saved_login");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.email && parsed.password) {
          setLoginForm({ email: parsed.email, password: parsed.password });
          setRememberMe(true);
        }
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;
    const errors = { email: "", password: "" };

    if (!loginForm.email.trim()) {
      errors.email = "Email is required";
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.email)) {
      errors.email = "Please enter a valid email";
      hasError = true;
    }

    if (!loginForm.password) {
      errors.password = "Password is required";
      hasError = true;
    }
    if (hasError) {
      setFormErrors(errors);
      return;
    }
    if (rememberMe) {
      localStorage.setItem("parivar_saved_login", JSON.stringify(loginForm));
    } else {
      localStorage.removeItem("parivar_saved_login");
    }

    handleLogin(e, loginForm, rememberMe);
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-inter p-4 relative overflow-hidden bg-slate-50">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100 blur-[100px] opacity-70"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100 blur-[100px] opacity-70"></div>

      <div className="w-full max-w-md p-8 sm:p-10 bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative z-10">
        <div className="flex flex-col items-center mb-8 text-center">
          {/* <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0B1340] to-indigo-900 text-white flex items-center justify-center font-black text-xl mb-5 shadow-lg shadow-indigo-900/20">
            SP
          </div> */}
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Super Admin Access
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">
            Securely login to manage the Parivar ecosystem
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">
              Email Address
            </label>
            <input
              type="email"
              value={loginForm.email}
              onChange={(e) => {
                setLoginForm({ ...loginForm, email: e.target.value });
                if (formErrors.email) setFormErrors({ ...formErrors, email: "" });
              }}
              className={`w-full px-4 py-3 bg-white/50 text-slate-900 placeholder:text-slate-400 border rounded-xl text-sm outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 ${formErrors.email ? 'border-rose-300 bg-rose-50/50 focus:border-rose-500 focus:ring-rose-500/10' : 'border-slate-200'}`}
              placeholder="admin@parivar.me"
              disabled={loginLoading}
            />
            {formErrors.email && (
              <p className="text-xs text-rose-500 font-medium animate-in fade-in slide-in-from-top-1">{formErrors.email}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={loginForm.password}
                onChange={(e) => {
                  setLoginForm({ ...loginForm, password: e.target.value });
                  if (formErrors.password) setFormErrors({ ...formErrors, password: "" });
                }}
                className={`w-full px-4 py-3 bg-white/50 text-slate-900 placeholder:text-slate-400 border rounded-xl text-sm outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 pr-12 ${formErrors.password ? 'border-rose-300 bg-rose-50/50 focus:border-rose-500 focus:ring-rose-500/10' : 'border-slate-200'}`}
                placeholder="••••••••"
                disabled={loginLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </button>
            </div>
            {formErrors.password && (
              <p className="text-xs text-rose-500 font-medium animate-in fade-in slide-in-from-top-1">{formErrors.password}</p>
            )}
          </div>

          {loginError && (
            <div className="p-3.5 rounded-xl bg-rose-50/80 border border-rose-200 text-rose-700 text-sm font-medium flex items-center gap-3 animate-in fade-in zoom-in-95">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
              <span>{loginError}</span>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600/20 cursor-pointer accent-indigo-600 transition-all"
            />
            <label htmlFor="remember" className="text-sm text-slate-600 font-medium cursor-pointer select-none hover:text-slate-900 transition-colors">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={loginLoading}
            className="w-full mt-4 bg-gradient-to-r from-[#0B1340] to-indigo-900 hover:from-indigo-900 hover:to-[#0B1340] text-white py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 shadow-lg shadow-indigo-900/25 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform active:scale-[0.98] cursor-pointer"
          >
            {loginLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
            <span>{loginLoading ? "Authenticating securely..." : "Sign in to Dashboard"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
