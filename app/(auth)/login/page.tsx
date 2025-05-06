'use client';
import { useRouter } from 'next/navigation';
import { FormEvent, ChangeEvent, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiArrowRight, FiLoader, FiAlertCircle } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

interface FormData {
  email: string;
  password: string;
  name: string;
}

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isMounted) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Validate form data
      if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
        throw new Error('Please fill in all fields');
      }
      
      // Successful auth
      router.push('/home');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (!isMounted) return;
    
    setIsGoogleLoading(true);
    setError(null);

    try {
      // Simulate Google auth
      await new Promise(resolve => setTimeout(resolve, 1500));
      router.push('/home');
    } catch (err) {
      setError('Google authentication failed');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleAuthMode = () => {
    if (isLoading || isGoogleLoading) return;
    setIsLogin(!isLogin);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center">
            <h1 className="text-2xl font-bold text-white">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-blue-100 mt-1">
              {isLogin ? 'Sign in to continue' : 'Join us today'}
            </p>
          </div>

          {/* Form container */}
          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center"
                >
                  <FiAlertCircle className="w-5 h-5 mr-2" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Google Sign-In Button */}
            <motion.button
              onClick={handleGoogleAuth}
              disabled={isGoogleLoading || isLoading}
              whileHover={!(isGoogleLoading || isLoading) ? { scale: 1.02 } : {}}
              whileTap={!(isGoogleLoading || isLoading) ? { scale: 0.98 } : {}}
              className={`w-full flex items-center justify-center py-3 px-4 rounded-lg border border-gray-200 mb-4 transition-all ${
                isGoogleLoading || isLoading
                  ? 'bg-gray-100 cursor-not-allowed'
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              {isGoogleLoading ? (
                <FiLoader className="animate-spin mr-2 text-gray-600" />
              ) : (
                <FcGoogle className="w-5 h-5 mr-2" />
              )}
              <span className="text-gray-700 font-medium">
                {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
              </span>
            </motion.button>

            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-3 text-gray-500 text-sm">OR</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Full Name"
                        className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required={!isLogin}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  minLength={6}
                />
              </div>

              <motion.button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                whileHover={!(isLoading || isGoogleLoading) ? { scale: 1.02 } : {}}
                whileTap={!(isLoading || isGoogleLoading) ? { scale: 0.98 } : {}}
                className={`w-full flex items-center justify-center py-3 px-4 rounded-lg transition-all ${
                  isLoading || isGoogleLoading
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white font-medium`}
              >
                {isLoading ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <FiArrowRight className="ml-2" />
                  </>
                )}
              </motion.button>
            </form>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 text-center">
            <p className="text-gray-500 text-sm">
              {isLogin ? "Don't have an account yet?" : 'Already registered?'}{' '}
              <button
                onClick={toggleAuthMode}
                disabled={isLoading || isGoogleLoading}
                className={`text-blue-600 hover:text-blue-800 font-medium ${
                  isLoading || isGoogleLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                type="button"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}