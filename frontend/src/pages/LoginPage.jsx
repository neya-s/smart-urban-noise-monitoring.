import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Volume2, ArrowRight, Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [isStaffMode, setIsStaffMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password.', 'error');
      return;
    }

    try {
      setLoading(true);
      const portal = isStaffMode ? 'staff' : 'citizen';
      const data = await login(email, password, portal);
      showToast(data.message || 'Logged in successfully!', 'success');

      if (data.user.role === 'staff') {
        navigate('/staff/overview');
      } else {
        navigate('/overview');
      }
    } catch (err) {
      showToast(err.message || 'Authentication failed. Please verify credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCitizen = () => {
    setEmail('citizen@urban.gov');
    setMobile('9876543210');
    setPassword('Password123!');
    setIsStaffMode(false);
    showToast('Loaded Demo Citizen credentials.', 'info');
  };

  const fillDemoStaff = () => {
    setEmail('staff@urban.gov');
    setMobile('9840123456');
    setPassword('StaffPassword123!');
    setIsStaffMode(true);
    showToast('Loaded Demo Staff credentials.', 'info');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4 sm:p-6 lg:p-12">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-2 min-h-[640px]">
        {/* Left Side: Dark Hero Panel (Matching Figma PDF Page 1) */}
        <div className="bg-[#08181E] text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background acoustic contour curves */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <svg viewBox="0 0 400 400" className="w-full h-full object-cover">
              <circle cx="200" cy="200" r="80" fill="none" stroke="#2DD4BF" strokeWidth="1" />
              <circle cx="200" cy="200" r="140" fill="none" stroke="#2DD4BF" strokeWidth="1.2" strokeDasharray="6 6" />
              <circle cx="200" cy="200" r="200" fill="none" stroke="#2DD4BF" strokeWidth="1.5" />
              <circle cx="200" cy="200" r="260" fill="none" stroke="#2DD4BF" strokeWidth="1" strokeDasharray="8 8" />
            </svg>
          </div>

          <div className="relative z-10">
            {/* Eyebrow */}
            <div className="flex items-center gap-2 text-teal-400 text-xs font-bold tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-teal-400" />
              A BETTER WAY TO HEAR THE CITY
            </div>

            {/* Display Title */}
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-8 leading-[1.15]">
              Quieter streets start with{' '}
              <span className="text-teal-400 underline decoration-teal-500/40 underline-offset-8">
                being heard.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-300 text-sm sm:text-base mt-6 leading-relaxed max-w-md font-light">
              A shared space for citizens and city teams to understand noise, act on reports, and make neighbourhoods better.
            </p>

            {/* Pill Badge */}
            <div className="mt-8 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-950/70 border border-teal-800 text-teal-300 text-xs font-medium">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Monitor. Report. Improve.</span>
            </div>
          </div>

          {/* Bottom Brand Watermark */}
          <div className="relative z-10 pt-12 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80">
            <span className="font-semibold text-slate-300 tracking-wider uppercase text-[11px]">
              SMART URBAN NOISE
            </span>
            <span>Chennai Municipal Prototype</span>
          </div>
        </div>

        {/* Right Side: Clean Login Form (Matching Figma Page 1) */}
        <div className="p-8 sm:p-12 flex flex-col justify-between bg-white">
          <div>
            {/* Header */}
            <div className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
              {isStaffMode ? 'MUNICIPAL STAFF PORTAL' : 'WELCOME TO A QUIETER CITY'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
              {isStaffMode ? 'Staff Sign In' : 'Welcome'}
            </h2>
            <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
              {isStaffMode
                ? 'Sign in with municipal credentials to inspect and update citizen noise reports.'
                : 'Enter your details to continue. Report and track urban noise pollution in your neighbourhood.'}
            </p>

            {/* Quick Demo Credentials Filler */}
            <div className="mt-6 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <span className="font-semibold text-slate-700 block mb-1.5">
                Evaluation Demo Accounts (Click to Autofill):
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={fillDemoCitizen}
                  className="flex-1 py-1.5 px-2.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 font-medium hover:bg-teal-100 transition-colors"
                >
                  Citizen Demo
                </button>
                <button
                  type="button"
                  onClick={fillDemoStaff}
                  className="flex-1 py-1.5 px-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 font-medium hover:bg-amber-100 transition-colors"
                >
                  Staff Demo
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {!isStaffMode && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Mobile Number
                  </label>
                  <div className="relative flex rounded-lg border border-slate-300 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500 overflow-hidden shadow-2xs">
                    <span className="inline-flex items-center px-3 bg-slate-100 text-slate-500 text-xs font-medium border-r border-slate-300">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="Enter mobile number"
                      className="w-full px-3 py-2 text-sm text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isStaffMode ? 'officer@urban.gov' : 'Enter your email address'}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-2xs"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm transition-colors shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>CONTINUE</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-[11px] text-slate-400">
                A sample account with realistic data is provided for testing / evaluation.
              </p>
            </div>
          </div>

          {/* Bottom Switch Links */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2">
            {!isStaffMode ? (
              <>
                <Link
                  to="/register"
                  className="text-teal-700 hover:text-teal-800 font-semibold"
                >
                  Register New Citizen Account &rarr;
                </Link>
                <button
                  type="button"
                  onClick={() => setIsStaffMode(true)}
                  className="text-slate-500 hover:text-slate-800 font-medium"
                >
                  Municipal Staff? <span className="underline">Staff Login &rarr;</span>
                </button>
              </>
            ) : (
              <>
                <span className="text-slate-400">Municipal Staff Portal</span>
                <button
                  type="button"
                  onClick={() => setIsStaffMode(false)}
                  className="text-teal-700 hover:text-teal-800 font-semibold"
                >
                  &larr; Switch to Citizen Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
