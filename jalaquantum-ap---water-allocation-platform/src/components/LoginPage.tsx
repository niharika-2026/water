import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Mail, Eye, EyeOff, User, Phone, MapPin, Building, ArrowRight, CheckCircle } from 'lucide-react';
import { UserRole } from '../types';

interface LoginPageProps {
  onSuccess?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const { login, register } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Login form state
  const [email, setEmail] = useState('dr.narayana@kgbo.gov.in');
  const [password, setPassword] = useState('apwater2026');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('+91 ');
  const [regRole, setRegRole] = useState<UserRole>('Superintendent Engineer');
  const [regDepartment, setRegDepartment] = useState('AP Water Resources Department');
  const [regCommandArea, setRegCommandArea] = useState('Krishna Delta Basin');

  const demoAccounts = [
    {
      name: 'Dr. C.V. Narayana Rao',
      role: 'Chief Hydrologist (KGBO / CWC)',
      email: 'dr.narayana@kgbo.gov.in',
      pass: 'apwater2026',
      badge: 'Director Access',
    },
    {
      name: 'Er. P. Srinivasa Reddy',
      role: 'Superintendent Engineer (NSP Circle)',
      email: 'srinivasa.reddy@irrigation.ap.gov.in',
      pass: 'krishna2026',
      badge: 'Canal Dispatch',
    },
    {
      name: 'Er. K. Anjaneyulu',
      role: 'Canal Gate Controller (Polavaram)',
      email: 'anjaneyulu.k@irrigation.ap.gov.in',
      pass: 'polavaram2026',
      badge: 'Field Ops',
    },
    {
      name: 'Smt. R. Sunitha',
      role: 'CWC/KGBO Liaison Officer',
      email: 'sunitha.r@cwc.nic.in',
      pass: 'cwc2026',
      badge: 'Audit & Compliance',
    },
  ];

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    submitLoginWithCredentials(demoEmail, demoPass);
  };

  const submitLoginWithCredentials = async (loginEmail: string, loginPass: string) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await login(loginEmail, loginPass);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitLoginWithCredentials(email, password);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    try {
      await register({
        name: regName,
        email: regEmail,
        password: regPassword,
        phone: regPhone,
        role: regRole,
        department: regDepartment,
        commandArea: regCommandArea,
      });
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Graphic Scrim */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-15 filter blur-xs"
        style={{ backgroundImage: `url('/src/assets/images/kg_basin_reservoir_1791548773392.jpg')` }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-950/90 via-slate-950/95 to-slate-950" />

      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Informational Column */}
        <div className="lg:col-span-5 space-y-6 text-slate-300">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded">
                Team: Entangled Minds
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Krishna-Godavari Hydro Allocation Platform
            </h1>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Use Case 03: Quantum & ML-driven irrigation optimization, canal release scheduling, and equitable tail-end water security across Andhra Pradesh.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Authority Stakeholders
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Water Resources Dept, Govt. of Andhra Pradesh</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Central Water Commission (CWC) & KGBO</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Nagarjuna Sagar, Polavaram & Delta Canal Boards</span>
              </div>
            </div>
          </div>

          {/* Quick Demo Credentials */}
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
            <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
              <span>Quick Test Access (Pre-Configured Officers)</span>
              <span className="text-[10px] text-cyan-400">Click to Autofill</span>
            </div>
            <div className="space-y-1.5">
              {demoAccounts.map((acc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickLogin(acc.email, acc.pass)}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg bg-slate-950/80 hover:bg-cyan-950/40 border border-slate-800/80 hover:border-cyan-800/60 transition-colors flex items-center justify-between group"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-medium text-slate-200 group-hover:text-cyan-300 truncate">
                      {acc.name}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">{acc.role}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded shrink-0">
                    {acc.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur shadow-2xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {isRegisterMode ? 'Register Official Credential' : 'Secure Official Portal'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isRegisterMode
                  ? 'Enroll new hydrologist or canal engineer account'
                  : 'Sign in to access live reservoir predictions & quantum solver'}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-cyan-950/50 border border-cyan-800/50 text-cyan-400">
              <Shield className="w-5 h-5" />
            </div>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3 rounded-lg bg-rose-950/50 border border-rose-800/50 text-rose-200 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {!isRegisterMode ? (
            /* Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Official Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@irrigation.ap.gov.in"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-slate-300">
                    Security Password
                  </label>
                  <span className="text-[11px] text-slate-500">Encrypted SHA-256</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter security key"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-10 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-md shadow-cyan-950"
                >
                  {loading ? (
                    <span>Authenticating Credentials...</span>
                  ) : (
                    <>
                      <span>Enter Secure Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-3 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(true)}
                  className="text-xs text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  Need new departmental credentials? <span className="underline">Register Official Profile</span>
                </button>
              </div>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Full Official Name</label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      required
                      placeholder="Er. Ramesh Varma"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Official Email</label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      required
                      placeholder="ramesh.varma@ap.gov.in"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Official Role</label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as UserRole)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  >
                    <option value="Chief Hydrologist">Chief Hydrologist</option>
                    <option value="Superintendent Engineer">Superintendent Engineer</option>
                    <option value="Canal Gate Controller">Canal Gate Controller</option>
                    <option value="CWC/KGBO Liaison">CWC/KGBO Liaison</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Phone / Radio Dispatch</label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="text"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+91 866-2489000"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Department / Board</label>
                  <div className="relative">
                    <Building className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="text"
                      value={regDepartment}
                      onChange={(e) => setRegDepartment(e.target.value)}
                      placeholder="AP Water Resources Department"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Command Area Jurisdiction</label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="text"
                      value={regCommandArea}
                      onChange={(e) => setRegCommandArea(e.target.value)}
                      placeholder="e.g. Nagarjuna Sagar Right Canal"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    placeholder="Create secure departmental password"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? 'Creating Official Record...' : 'Complete Registration & Sign In'}
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(false)}
                  className="text-xs text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  Already have access? <span className="underline">Back to Sign In</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
