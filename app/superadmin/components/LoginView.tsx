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
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] text-slate-900 font-sans p-4">
      <div className="w-full max-w-sm p-6 sm:p-7 bg-white border border-slate-300 rounded-lg shadow-lg relative z-10">
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-10 h-10 rounded-md bg-[#0B1340] text-white flex items-center justify-center font-black text-base mb-3 shadow-xs">
            SP
          </div>
          <h1 className="text-lg font-bold text-slate-900">
            Super Admin Login
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Enter your credentials to access the management portal
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Email Address <span className="text-rose-600">*</span>
            </label>
            <input
              type="email"
              value={loginForm.email}
              onChange={(e) => {
                setLoginForm({ ...loginForm, email: e.target.value });
                if (formErrors.email) setFormErrors({ ...formErrors, email: "" });
              }}
              className={`w-full px-3 py-2 bg-white text-slate-900 placeholder:text-slate-500 border rounded-md text-xs font-medium outline-none focus:border-[#0B1340] focus:ring-1 focus:ring-[#0B1340] transition-colors ${formErrors.email ? 'border-rose-500' : 'border-slate-300'}`}
              placeholder="superadmin@gmail.com"
              disabled={loginLoading}
            />
            {formErrors.email && (
              <p className="mt-1 text-[11px] text-rose-600 font-semibold">{formErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Password <span className="text-rose-600">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={loginForm.password}
                onChange={(e) => {
                  setLoginForm({ ...loginForm, password: e.target.value });
                  if (formErrors.password) setFormErrors({ ...formErrors, password: "" });
                }}
                className={`w-full px-3 py-2 bg-white text-slate-900 placeholder:text-slate-500 border rounded-md text-xs font-medium outline-none focus:border-[#0B1340] focus:ring-1 focus:ring-[#0B1340] transition-colors pr-10 ${formErrors.password ? 'border-rose-500' : 'border-slate-300'}`}
                placeholder="••••••••"
                disabled={loginLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </button>
            </div>
            {formErrors.password && (
              <p className="mt-1 text-[11px] text-rose-600 font-semibold">{formErrors.password}</p>
            )}
          </div>

          {loginError && (
            <div className="p-2.5 rounded-md bg-rose-50 border border-rose-300 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-700" />
              <span>{loginError}</span>
            </div>
          )}

          <div className="flex items-center gap-2 pt-0.5">
            <input 
              type="checkbox" 
              id="remember" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-slate-300 text-[#0B1340] focus:ring-[#0B1340] cursor-pointer" 
            />
            <label htmlFor="remember" className="text-xs text-slate-700 font-semibold cursor-pointer select-none">
              Remember me on this device
            </label>
          </div>

          <button
            type="submit"
            disabled={loginLoading}
            className="w-full mt-2 bg-[#0B1340] hover:bg-[#070D2B] text-white py-2 rounded-md font-semibold text-xs tracking-wide transition-all shadow-xs disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loginLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
            <span>{loginLoading ? "Authenticating..." : "Login to Portal"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
