// pages/SignUp.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import CustomSelect from '../components/CustomSelect';
import { useToast } from '../components/ToastProvider';

export default function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('customer');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const { success, error } = useToast();
  const navigate = useNavigate();
  const { fetchData, loading } = useApi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptTerms) {
      error('You must accept the terms and conditions.');
      return;
    }

    try {
      const response = await fetchData<any, any>("/auth/register", "POST", {
        body: {
          firstname: firstName,
          lastname: lastName,
          emailId: email,
          password,
          role: userType
        },
      });

      success('Signup successful! Redirecting to login...');

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err: any) {
      error(err.message || 'Signup failed.');
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-leaf-50 via-white to-leaf-50 flex items-center justify-center pt-24 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-2xl shadow-leaf-100/50 border border-leaf-100">
        <div className="flex flex-col items-center">
          <Link to="/" className="mb-6 hover:scale-105 transition-transform duration-300">
            <img
              src="/IQponics.png"
              alt="IQ Green Life Ponics"
              className="h-24 w-auto object-contain"
            />
          </Link>
          <h2 className="text-center text-3xl font-bold text-charcoal-900 font-poppins tracking-tight">Create Account</h2>
          <p className="mt-2 text-center text-sm text-gray-500 font-sans">
            Become part of the natural revolution
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-leaf-600 transition-colors" />
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-leaf-50/30 border border-leaf-100 rounded-xl text-charcoal-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-leaf-500/20 focus:border-leaf-500 transition-all font-sans"
                  placeholder="First Name"
                />
              </div>
              <div className="relative group">
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full pl-4 pr-4 py-4 bg-leaf-50/30 border border-leaf-100 rounded-xl text-charcoal-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-leaf-500/20 focus:border-leaf-500 transition-all font-sans"
                  placeholder="Last Name"
                />
              </div>
            </div>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-leaf-600 transition-colors" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-leaf-50/30 border border-leaf-100 rounded-xl text-charcoal-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-leaf-500/20 focus:border-leaf-500 transition-all font-sans"
                placeholder="Email Address"
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-leaf-600 transition-colors" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-leaf-50/30 border border-leaf-100 rounded-xl text-charcoal-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-leaf-500/20 focus:border-leaf-500 transition-all font-sans"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-leaf-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center flex-1">
              <input
                id="terms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="h-4 w-4 text-leaf-600 focus:ring-leaf-500 border-leaf-300 rounded bg-white shadow-sm transition-all"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-600 font-medium">
                I agree to the{' '}
                <a href="#" className="text-leaf-600 hover:text-leaf-700 font-bold transition-colors">
                  Terms and Conditions
                </a>
              </label>
            </div>
            <CustomSelect
              value={userType}
              onChange={setUserType}
              options={[
                { value: 'vendor', label: 'Vendor' },
                { value: 'customer', label: 'Customer' }
              ]}
              className="w-32"
            />
          </div>

          <button
            type="submit"
            disabled={!acceptTerms || loading}
            className={`w-full py-4 bg-leaf-600 hover:bg-leaf-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-leaf-200/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${!acceptTerms || loading ? 'opacity-50 cursor-not-allowed grayscale' : ''
              }`}
          >
            {loading ? 'Planting Seeds...' : 'Complete Sign Up'}
          </button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-leaf-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold text-gray-400">
              <span className="px-3 bg-white">Or join with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`}
            className="w-full flex items-center justify-center gap-3 py-4 px-4 border border-leaf-100 rounded-xl text-charcoal-800 bg-white hover:bg-leaf-50 focus:outline-none focus:ring-2 focus:ring-leaf-500/20 transition-all font-bold group shadow-sm"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <div className="text-center text-sm font-medium text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-leaf-600 hover:text-leaf-700 transition-colors ml-1">
              Log In
            </Link>
            <div className="mt-4 pt-4 border-t border-leaf-100 flex items-center justify-center gap-2 grayscale brightness-125">
              <span className="w-2 h-2 bg-leaf-400 rounded-full animate-pulse"></span>
              <p className="text-[10px] uppercase tracking-tighter font-bold text-leaf-600/60 font-sans">
                Demo Registration • No Backend Required
              </p>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}
