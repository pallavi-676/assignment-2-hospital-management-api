import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { HeartPulse, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const validate = () => {
    const errs = {};
    if (!formData.username.trim()) {
      errs.username = 'Username is required';
    }
    if (!formData.password) {
      errs.password = 'Password is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setSubmitting(true);
    try {
      const data = await login({
        username: formData.username.trim(),
        password: formData.password,
      });
      showToast(data.message || 'Login successful', 'success');
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(err.message || 'Invalid username or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FDFD] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle soft cyan backdrop circle */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#E6F6F7]/50 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#CCEEF0]/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Header */}
        <div className="flex items-center justify-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0D5C63] text-white shadow-md shadow-[#0D5C63]/20">
            <HeartPulse className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-heading text-xl font-bold tracking-tight text-[#0B2B2F]">
                CareNexus
              </h1>
              <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />
            </div>
            <p className="text-xs font-semibold text-[#0D5C63]">Hospital Management System</p>
          </div>
        </div>

        <h2 className="mt-7 text-center font-heading text-2xl font-bold tracking-tight text-[#0B2B2F]">
          Welcome back
        </h2>
        <p className="mt-1.5 text-center text-xs text-[#5A7175]">
          Sign in to access the hospital bed management and capacity directory.
        </p>
      </div>

      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-8 rounded-3xl border border-[#E0EEEE] shadow-sm">
          {serverError && (
            <div className="mb-5 p-3.5 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] flex items-center gap-2.5 text-xs font-medium text-[#991B1B] animate-fade-in">
              <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Username Input */}
            <div>
              <label className="block text-xs font-bold text-[#0B2B2F] mb-1.5">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8FA8AB]">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  autoComplete="username"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={(e) => {
                    setFormData({ ...formData, username: e.target.value });
                    if (errors.username) setErrors({ ...errors, username: '' });
                  }}
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border text-sm text-[#0B2B2F] placeholder-[#8FA8AB] focus:outline-none focus:ring-2 focus:ring-[#0D5C63]/20 focus:border-[#0D5C63] transition-all ${
                    errors.username ? 'border-[#DC2626]' : 'border-[#E0EEEE]'
                  }`}
                  disabled={submitting}
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-xs text-[#DC2626]">{errors.username}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold text-[#0B2B2F] mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8FA8AB]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border text-sm text-[#0B2B2F] placeholder-[#8FA8AB] focus:outline-none focus:ring-2 focus:ring-[#0D5C63]/20 focus:border-[#0D5C63] transition-all ${
                    errors.password ? 'border-[#DC2626]' : 'border-[#E0EEEE]'
                  }`}
                  disabled={submitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8FA8AB] hover:text-[#0B2B2F] cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-[#DC2626]">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#0D5C63] hover:bg-[#094449] shadow-sm shadow-[#0D5C63]/25 transition-all cursor-pointer disabled:opacity-60"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Registration Redirect */}
          <div className="mt-6 text-center pt-4 border-t border-[#F0FAFA]">
            <p className="text-xs text-[#5A7175]">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-bold text-[#0D5C63] hover:text-[#094449] transition-colors"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
