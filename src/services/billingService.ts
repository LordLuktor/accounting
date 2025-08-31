import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { CreditCard, Calendar, Download, AlertCircle, CheckCircle } from 'lucide-react';

const BillingSettings: React.FC = () => {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState('professional');
  
  // If user has a free account, show different content
  if (user?.account_type === 'free' || user?.account_type === 'super_free') {
    const isSuper = user?.account_type === 'super_free';
    
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Account Information</h2>
          <p className="text-slate-600">
            Your {isSuper ? 'super free' : 'free'} invitation-only account details
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-800">
              {isSuper ? 'Super Free Account' : 'Free Account'}
            </h3>
            <span className={`px-3 py-1 border rounded-full text-sm font-medium ${
              isSuper ? 'bg-purple-100 text-purple-800 border-purple-200' : 'bg-green-100 text-green-800 border-green-200'
            }`}>
              Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className={`text-center p-4 rounded-lg border ${
              isSuper ? 'bg-purple-50 border-purple-200' : 'bg-green-50 border-green-200'
            }`}>
              <p className={`text-sm mb-1 ${isSuper ? 'text-purple-600' : 'text-green-600'}`}>Account Type</p>
              <p className={`text-xl font-bold ${isSuper ? 'text-purple-800' : 'text-green-800'}`}>
                {isSuper ? 'Super Free' : 'Free'}
              </p>
              <p className={`text-sm ${isSuper ? 'text-purple-600' : 'text-green-600'}`}>
                {isSuper ? 'Unlimited Access' : 'Invitation Only'}
              </p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600 mb-1">Monthly Limit</p>
              <p className="font-semibold text-slate-800">
                {isSuper ? 'Unlimited' : '500'} Transactions
              </p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600 mb-1">Businesses</p>
              <p className="font-semibold text-slate-800">
                {isSuper ? 'Unlimited' : '1 Maximum'}
              </p>
            </div>
          </div>

          {isSuper ? (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-semibold text-purple-800 mb-2">🚀 Super Free Account</h4>
              <p className="text-sm text-purple-700">
                You have unlimited access to all AccuFlow features including unlimited businesses, 
                transactions, all integrations, advanced reports, API access, and priority support.
              </p>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Want More Features?</h4>
              <p className="text-sm text-blue-700 mb-4">
                Upgrade to a paid plan to unlock unlimited businesses, transactions, and advanced features.
              </p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                View Upgrade Options
              </button>
      features: ['1 Business', '5,000 Transactions/month', 'Basic Integrations (Stripe, Square, PayPal, Bank)', 'Email Support'],
          )}
        </div>
      </div>
    );
  }
  const plans = [
    {
      id: 'starter',
      features: ['3 Businesses', '7,500 Transactions/month', 'All Integrations (includes Venmo, CashApp, NMI, Paysley)', 'Advanced Reports', 'Priority Support'],
      price: 9,
      interval: 'month',
      features: ['1 Business', '1,000 Transactions/month', 'Basic Integrations (Stripe, Square, PayPal, Bank)', 'Email Support'],
      current: user?.subscription_status === 'trial'
    },
    {
      id: 'starter-2k',
      name: 'Starter 2K',
      features: ['5 Businesses', '10,000 Transactions/month', 'All Integrations (includes Venmo, CashApp, NMI, Paysley)', 'Advanced Reports', 'Priority Support'],
      features: ['5 Businesses', '10,000 Transactions/month', 'All Integrations', 'Advanced Reports', 'Priority Support'],
      current: user?.subscription_status === 'active'
    },
    {
      id: 'starter-5k',
      name: 'Starter 5K',
      price: 99,
      features: ['Unlimited Businesses', 'Unlimited Transactions', 'All Integrations + Custom Integrations', 'API Access', '24/7 Support'],
      features: ['Unlimited Businesses', 'Unlimited Transactions', 'Custom Integrations', 'API Access', '24/7 Support'],
      current: false
    }
  ];

  const billingHistory = [
    { date: '2024-01-01', description: 'Professional Plan - Monthly', amount: '$29.00', status: 'paid' },
    { date: '2023-12-01', description: 'Professional Plan - Monthly', amount: '$29.00', status: 'paid' },
    { date: '2023-11-01', description: 'Professional Plan - Monthly', amount: '$29.00', status: 'paid' },
    { date: '2023-10-01', description: 'Starter Plan - Monthly', amount: '$9.00', status: 'paid' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Billing & Subscription</h2>
        <p className="text-slate-600">Manage your subscription plan and billing information</p>
      </div>

      {/* Current Plan */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-slate-800">Current Plan</h3>
          <span className="px-3 py-1 bg-green-100 text-green-800 border border-green-200 rounded-full text-sm font-medium">
            Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-600 mb-1">Current Plan</p>
            <p className="text-xl font-bold text-blue-800">Professional</p>
            <p className="text-sm text-blue-600">$29/month</p>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600 mb-1">Next Billing Date</p>
            <p className="font-semibold text-slate-800">February 1, 2024</p>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600 mb-1">Usage This Month</p>
            <p className="font-semibold text-slate-800">2,847 / 10,000</p>
            <p className="text-xs text-slate-500">transactions</p>
          </div>
        </div>
      </div>

      {/* Available Plans */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-xl font-semibold text-slate-800 mb-6">Available Plans</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className={`border-2 rounded-xl p-6 transition-colors ${
              plan.current ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
            }`}>
              <div className="text-center mb-4">
                <h4 className="text-lg font-semibold text-slate-800 mb-2">{plan.name}</h4>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-slate-800">${plan.price}</span>
                  <span className="text-slate-600">/{plan.interval}</span>
                </div>
                {plan.current && (
                  <span className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    <CheckCircle className="h-4 w-4" />
                    <span>Current Plan</span>
                  </span>
                )}
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm text-slate-600">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {!plan.current && (
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  {plan.price > 29 ? 'Upgrade' : 'Downgrade'}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <div className="flex items-center space-x-3 mb-6">
          <CreditCard className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-slate-800">Payment Method</h3>
        </div>

        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-16 bg-slate-100 rounded flex items-center justify-center">
              <span className="text-xs font-bold text-slate-600">VISA</span>
            </div>
            <div>
              <p className="font-medium text-slate-800">•••• •••• •••• 4242</p>
              <p className="text-sm text-slate-600">Expires 12/25</p>
            </div>
          </div>
          <button className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
            Update
          </button>
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-slate-800">Billing History</h3>
          <button className="flex items-center space-x-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
            <Download className="h-4 w-4" />
            <span>Download All</span>
          </button>
        </div>

        <div className="space-y-4">
          {billingHistory.map((invoice, index) => (
            <div key={index} className="flex items-center justify-between py-4 border-b border-slate-100 last:border-b-0">
              <div className="flex items-center space-x-4">
                <Calendar className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="font-medium text-slate-800">{invoice.description}</p>
                  <p className="text-sm text-slate-600">{invoice.date}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-semibold text-slate-800">{invoice.amount}</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 border border-green-200 rounded-full text-xs font-medium">
                  Paid
                </span>
                <button className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BillingSettings;