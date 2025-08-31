import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Building2, Calculator, TrendingUp } from 'lucide-react';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, firstName, lastName);
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      {/* Left Panel - Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 text-white p-12 flex-col justify-center">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-8">
            AccuFlow
          </h1>
          <p className="text-xl mb-12 text-blue-100">
            Professional accounting software that integrates with all your payment platforms
          </p>
          
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <Building2 className="h-8 w-8 text-blue-200 mt-1" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Multi-Business Management</h3>
                <p className="text-blue-100">Manage multiple businesses under one account with unlimited sub-accounts</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <Calculator className="h-8 w-8 text-blue-200 mt-1" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Automated Integrations</h3>
                <p className="text-blue-100">Connect banks, Stripe, Square, PayPal, and more for automatic transaction sync</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <TrendingUp className="h-8 w-8 text-blue-200 mt-1" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Real-time Analytics</h3>
                <p className="text-blue-100">Get instant insights with automated categorization and reporting</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">
                {isLogin ? 'Welcome Back' : 'Get Started'}
              </h2>
              <p className="text-slate-600">
                {isLogin ? 'Sign in to your account' : 'Create your account today'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>

            {isLogin && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700 text-center">
                  Demo: Use admin@demo.com / user@demo.com for different roles
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;