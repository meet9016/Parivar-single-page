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

    // Save or clear login details
    if (rememberMe) {
      localStorage.setItem("parivar_saved_login", JSON.stringify(loginForm));
    } else {
      localStorage.removeItem("parivar_saved_login");
    }

    handleLogin(e, loginForm, rememberMe);
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

        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2 tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              value={loginForm.email}
              onChange={(e) => {
                setLoginForm({ ...loginForm, email: e.target.value });
                if (formErrors.email) setFormErrors({ ...formErrors, email: "" });
              }}
              className={`w-full px-4 py-3 bg-white text-[#080b2a] placeholder-slate-400 border hover:border-slate-300 focus:border-[#4338ca]/50 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#4338ca]/10 transition-all duration-300 ${formErrors.email ? 'border-rose-400' : 'border-slate-200'}`}
              placeholder="superadmin@gmail.com"
              disabled={loginLoading}
            />
            {formErrors.email && (
              <p className="mt-1.5 text-xs text-rose-500 font-medium">{formErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2 tracking-wider">
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
                className={`w-full px-4 py-3 bg-white text-[#080b2a] placeholder-slate-400 border hover:border-slate-300 focus:border-[#4338ca]/50 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#4338ca]/10 transition-all duration-300 pr-12 ${formErrors.password ? 'border-rose-400' : 'border-slate-200'}`}
                placeholder="••••••••"
                disabled={loginLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
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
              <p className="mt-1.5 text-xs text-rose-500 font-medium">{formErrors.password}</p>
            )}
          </div>

          {loginError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <div className="flex items-center gap-2 mt-2">
            <input 
              type="checkbox" 
              id="remember" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-[#4338ca] focus:ring-[#4338ca]" 
            />
            <label htmlFor="remember" className="text-sm text-slate-600 font-medium cursor-pointer select-none">
              Save Login Details
            </label>
          </div>

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
