import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useApi } from "../hooks/useApi";
import { useToast } from "../components/ToastProvider";
import { authApi } from "../api/authApi";

export default function Login({
  setIsAuth,
}: {
  setIsAuth: (auth: boolean) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { error } = useToast();
  const navigate = useNavigate();
  const { fetchData, loading } = useApi();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("authToken", token);
      setIsAuth(true);
      navigate("/home");
    }
  }, [navigate, setIsAuth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetchData<any, any>(authApi.login(), "POST", {
        body: { emailId: email, password },
      });

      if (response && (response.accessToken || response.token)) {
        const token = response.accessToken || response.token;
        localStorage.setItem("authToken", token);
        if (response.user) {
          localStorage.setItem("demoUser", response.user.email || email);
        } else {
          localStorage.setItem("demoUser", email);
        }

        setIsAuth(true);
        navigate("/home");
      } else {
        error("Invalid response from server. Please try again.");
      }
    } catch (err: any) {
      error(err.message || "An unexpected error occurred during login.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F0FDF4] flex items-center justify-center pt-20 px-4">
      <div className="max-w-[480px] w-full bg-white rounded-[2rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-green-50">
        <div className="flex flex-col items-center mb-10">
          <Link to="/" className="mb-6 hover:opacity-80 transition-opacity">
            <img
              src="/IQponics.png"
              alt="Green Life Ponics"
              className="h-20 w-auto object-contain"
            />
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 font-poppins">
            Welcome Back
          </h1>
          <p className="text-gray-500 font-medium text-sm">
            Sign in to continue your journey with us
          </p>
        </div>


        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-white"
                placeholder="Email Address"
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-12 pr-12 py-4 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-white"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-green-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Eye className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-bold text-green-600 hover:text-green-700 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-green-600/20 text-lg font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all active:scale-[0.98]"
          >
            {loading ? "Signing in..." : "Log In"}
          </button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-xs font-bold text-gray-400 uppercase tracking-widest">
                Or secure log in with
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => window.location.href = authApi.google()}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 border border-gray-200 rounded-2xl shadow-sm bg-white text-gray-700 font-bold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all active:scale-[0.98]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <div className="text-center text-sm font-medium text-gray-500">
            Don't have an account?{' '}
            <Link to="/signup" className="font-bold text-green-600 hover:text-green-700 transition-colors ml-1">
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
