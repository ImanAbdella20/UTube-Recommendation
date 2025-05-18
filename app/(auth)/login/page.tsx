'use client';
import { useRouter } from 'next/navigation';
import { FormEvent, ChangeEvent, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiArrowRight, FiLoader, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '@/context/AuthContext';

interface FormData {
  email: string;
  password: string;
  name: string;
}

interface AuthError {
  title: string;
  message: string;
  type: 'error' | 'success';
}

const getFirebaseError = (error: any): AuthError => {
  switch (error.code) {
    case 'auth/invalid-email':
      return {
        title: 'Invalid Email',
        message: 'Please enter a valid email address',
        type: 'error'
      };
    case 'auth/user-disabled':
      return {
        title: 'Account Disabled',
        message: 'This account has been disabled',
        type: 'error'
      };
    case 'auth/user-not-found':
      return {
        title: 'Account Not Found',
        message: 'No account exists with this email',
        type: 'error'
      };
    case 'auth/wrong-password':
      return {
        title: 'Incorrect Password',
        message: 'The password you entered is incorrect',
        type: 'error'
      };
    case 'auth/email-already-in-use':
      return {
        title: 'Email In Use',
        message: 'This email is already registered',
        type: 'error'
      };
    case 'auth/weak-password':
      return {
        title: 'Weak Password',
        message: 'Password should be at least 6 characters',
        type: 'error'
      };
    case 'auth/popup-closed-by-user':
      return {
        title: 'Sign In Cancelled',
        message: 'You closed the Google sign-in popup',
        type: 'error'
      };
    case 'auth/too-many-requests':
      return {
        title: 'Too Many Attempts',
        message: 'Access temporarily disabled due to many failed attempts',
        type: 'error'
      };
    case 'auth/account-exists-with-different-credential':
      return {
        title: 'Account Exists',
        message: 'An account already exists with the same email but different sign-in method',
        type: 'error'
      };
    case 'auth/popup-blocked':
      return {
        title: 'Popup Blocked',
        message: 'Please allow popups for this site to sign in with Google',
        type: 'error'
      };
    case 'auth/network-request-failed':
      return {
        title: 'Network Error',
        message: 'Please check your internet connection and try again',
        type: 'error'
      };
    default:
      console.error('Unhandled auth error:', error);
      return {
        title: 'Authentication Error',
        message: error.message || 'An unknown error occurred',
        type: 'error'
      };
  }
};

export default function AuthPage() {
  const router = useRouter();
  const { user, loading: authLoading, signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    name: ''
  });
  const [authError, setAuthError] = useState<AuthError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      router.push('/home');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    try {
      if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
        throw { code: 'validation/empty-fields', message: 'Please fill in all fields' };
      }

      if (isLogin) {
        await signInWithEmail(formData.email, formData.password);
      } else {
        await signUpWithEmail(formData.email, formData.password, formData.name);
        setAuthError({
          title: 'Account Created!',
          message: 'Your account has been successfully created',
          type: 'success'
        });
      }
    } catch (err) {
      const error = getFirebaseError(err);
      setAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsGoogleLoading(true);
    setAuthError(null);

    try {
      await signInWithGoogle();
      // No need to redirect here - the useEffect will handle it when user changes
    } catch (err) {
      const error = getFirebaseError(err);
      setAuthError(error);
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
    setAuthError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full">
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
              {authError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`mb-4 p-4 rounded-lg border ${
                    authError.type === 'error'
                      ? 'bg-red-50 border-red-200 text-red-600'
                      : 'bg-green-50 border-green-200 text-green-600'
                  }`}
                >
                  <div className="flex items-start">
                    {authError.type === 'error' ? (
                      <FiAlertTriangle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                    ) : (
                      <FiCheckCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <h3 className="font-medium">{authError.title}</h3>
                      <p className="text-sm mt-1">{authError.message}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Google Sign-In Button */}
            <motion.button
              onClick={handleGoogleAuth}
              disabled={isGoogleLoading || isLoading}
              whileHover={!(isGoogleLoading || isLoading) ? { scale: 1.02 } : {}}
              whileTap={!(isGoogleLoading || isLoading) ? { scale: 0.98 } : {}}
              className={`w-full flex items-center justify-center py-3 px-4 rounded-lg border ${
                isGoogleLoading || isLoading
                  ? 'bg-gray-100 border-gray-200 cursor-not-allowed'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              } transition-all mb-6`}
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
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
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