import React from 'react';
import { Users, DollarSign, Building2, TrendingUp } from 'lucide-react';

const AdminOverview: React.FC = () => {
  const stats = [
    { title: 'Total Users', value: '2,847', change: '+12%', icon: Users, color: 'blue' },
    { title: 'Monthly Revenue', value: '$24,890', change: '+8%', icon: DollarSign, color: 'green' },
    { title: 'Active Businesses', value: '1,293', change: '+15%', icon: Building2, color: 'purple' },
    { title: 'Growth Rate', value: '18%', change: '+3%', icon: TrendingUp, color: 'orange' },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      green: 'bg-green-50 text-green-700 border-green-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200',
      orange: 'bg-orange-50 text-orange-700 border-orange-200',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Dashboard Overview</h2>
        <p className="text-slate-600">Monitor system performance and user activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-xl p-6 border border-slate-200 hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg border ${getColorClasses(stat.color)}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</h3>
                <p className="text-sm text-slate-600">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent User Activity</h3>
          <div className="space-y-3">
            {[
              { user: 'John Smith', action: 'Created new business account', time: '2 hours ago' },
              { user: 'Sarah Johnson', action: 'Connected Stripe integration', time: '4 hours ago' },
              { user: 'Mike Davis', action: 'Upgraded to Professional plan', time: '6 hours ago' },
              { user: 'Lisa Chen', action: 'Added bank account connection', time: '8 hours ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0">
                <div>
                  <p className="font-medium text-slate-800">{activity.user}</p>
                  <p className="text-sm text-slate-600">{activity.action}</p>
                </div>
                <span className="text-xs text-slate-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">System Health</h3>
          <div className="space-y-4">
            {[
              { metric: 'API Response Time', value: '124ms', status: 'good' },
              { metric: 'Database Performance', value: '99.8%', status: 'excellent' },
              { metric: 'Integration Uptime', value: '99.9%', status: 'excellent' },
              { metric: 'Active Connections', value: '1,247', status: 'good' },
            ].map((metric, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-slate-700">{metric.metric}</span>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-slate-800">{metric.value}</span>
                  <div className={`w-2 h-2 rounded-full ${
                    metric.status === 'excellent' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;