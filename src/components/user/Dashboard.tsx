import React from 'react';
import { DollarSign, TrendingUp, Users, Building2, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface DashboardProps {
  businessId: string | null;
}

const Dashboard: React.FC<DashboardProps> = ({ businessId }) => {
  if (!businessId) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <Building2 className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">No Business Selected</h2>
          <p className="text-slate-600 mb-6">Please select a business from the header to view your dashboard</p>
        </div>
      </div>
    );
  }

  const stats = [
    { title: 'Monthly Revenue', value: '$12,847', change: '+8.2%', trend: 'up', icon: DollarSign },
    { title: 'Total Transactions', value: '2,847', change: '+12%', trend: 'up', icon: TrendingUp },
    { title: 'Active Accounts', value: '47', change: '+3', trend: 'up', icon: Users },
    { title: 'Pending Items', value: '12', change: '-5', trend: 'down', icon: Building2 },
  ];

  const recentTransactions = [
    { id: '1', description: 'Stripe Payment - Customer #1234', amount: '+$2,500', date: '2024-01-15', type: 'credit' },
    { id: '2', description: 'Office Supplies - Staples', amount: '-$127.50', date: '2024-01-15', type: 'debit' },
    { id: '3', description: 'Square Payment - POS Sale', amount: '+$89.99', date: '2024-01-14', type: 'credit' },
    { id: '4', description: 'Software Subscription - Adobe', amount: '-$52.99', date: '2024-01-14', type: 'debit' },
    { id: '5', description: 'PayPal Payment - Online Sale', amount: '+$156.00', date: '2024-01-13', type: 'credit' },
  ];

  const quickActions = [
    { label: 'Add Transaction', action: () => alert('Add Transaction clicked!') },
    { label: 'Generate Report', action: () => alert('Generate Report clicked!') },
    { label: 'Sync Integrations', action: () => alert('Sync Integrations clicked!') },
    { label: 'Export Data', action: () => alert('Export Data clicked!') },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Dashboard</h2>
        <p className="text-slate-600">Overview of your business financial data</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight;
          
          return (
            <div key={stat.title} className="bg-white rounded-xl p-6 border border-slate-200 hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 text-blue-700 rounded-lg">
                  <Icon className="h-6 w-6" />
                </div>
                <div className={`flex items-center space-x-1 text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendIcon className="h-4 w-4" />
                  <span>{stat.change}</span>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</h3>
                <p className="text-sm text-slate-600">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors text-center"
            >
              <span className="font-medium text-slate-700">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-800">Recent Transactions</h3>
          <button className="text-blue-600 hover:text-blue-700 font-medium">View All</button>
        </div>
        
        <div className="space-y-4">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0">
              <div>
                <p className="font-medium text-slate-800">{transaction.description}</p>
                <p className="text-sm text-slate-600">{transaction.date}</p>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.amount}
                </p>
                <p className="text-xs text-slate-500 capitalize">{transaction.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;