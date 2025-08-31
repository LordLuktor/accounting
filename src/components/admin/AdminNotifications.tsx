import React, { useState } from 'react';
import { Bell, Mail, AlertTriangle, Users, DollarSign, Save } from 'lucide-react';

const AdminNotifications: React.FC = () => {
  const [settings, setSettings] = useState({
    systemAlerts: {
      serverDown: true,
      highCpuUsage: true,
      diskSpaceLow: true,
      databaseErrors: true,
      integrationFailures: true,
    },
    userAlerts: {
      newRegistrations: true,
      subscriptionChanges: true,
      paymentFailures: true,
      supportTickets: true,
      suspiciousActivity: true,
    },
    billingAlerts: {
      failedPayments: true,
      chargebacks: true,
      refundRequests: true,
      subscriptionCancellations: true,
    },
    frequency: {
      dailySummary: true,
      weeklySummary: true,
      monthlySummary: false,
      realTimeAlerts: true,
    }
  });

  const handleSave = () => {
    alert('Admin notification settings saved successfully!');
  };

  const updateSystemAlert = (key: string, value: boolean) => {
    setSettings({
      ...settings,
      systemAlerts: {
        ...settings.systemAlerts,
        [key]: value
      }
    });
  };

  const updateUserAlert = (key: string, value: boolean) => {
    setSettings({
      ...settings,
      userAlerts: {
        ...settings.userAlerts,
        [key]: value
      }
    });
  };

  const updateBillingAlert = (key: string, value: boolean) => {
    setSettings({
      ...settings,
      billingAlerts: {
        ...settings.billingAlerts,
        [key]: value
      }
    });
  };

  const updateFrequency = (key: string, value: boolean) => {
    setSettings({
      ...settings,
      frequency: {
        ...settings.frequency,
        [key]: value
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Admin Notifications</h2>
          <p className="text-slate-600">Configure administrative alerts and notifications</p>
        </div>
        
        <button 
          onClick={handleSave}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          <Save className="h-4 w-4" />
          <span>Save Settings</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* System Alerts */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center space-x-3 mb-6">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <h3 className="text-xl font-semibold text-slate-800">System Alerts</h3>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Server Downtime</p>
                <p className="text-sm text-slate-600">Critical system outages</p>
              </div>
              <input
                type="checkbox"
                checked={settings.systemAlerts.serverDown}
                onChange={(e) => updateSystemAlert('serverDown', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">High CPU Usage</p>
                <p className="text-sm text-slate-600">Server performance issues</p>
              </div>
              <input
                type="checkbox"
                checked={settings.systemAlerts.highCpuUsage}
                onChange={(e) => updateSystemAlert('highCpuUsage', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Low Disk Space</p>
                <p className="text-sm text-slate-600">Storage capacity warnings</p>
              </div>
              <input
                type="checkbox"
                checked={settings.systemAlerts.diskSpaceLow}
                onChange={(e) => updateSystemAlert('diskSpaceLow', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Database Errors</p>
                <p className="text-sm text-slate-600">Database connection issues</p>
              </div>
              <input
                type="checkbox"
                checked={settings.systemAlerts.databaseErrors}
                onChange={(e) => updateSystemAlert('databaseErrors', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Integration Failures</p>
                <p className="text-sm text-slate-600">Payment platform connection issues</p>
              </div>
              <input
                type="checkbox"
                checked={settings.systemAlerts.integrationFailures}
                onChange={(e) => updateSystemAlert('integrationFailures', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        {/* User Activity Alerts */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center space-x-3 mb-6">
            <Users className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-semibold text-slate-800">User Activity</h3>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">New Registrations</p>
                <p className="text-sm text-slate-600">New user sign-ups</p>
              </div>
              <input
                type="checkbox"
                checked={settings.userAlerts.newRegistrations}
                onChange={(e) => updateUserAlert('newRegistrations', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Subscription Changes</p>
                <p className="text-sm text-slate-600">Plan upgrades and downgrades</p>
              </div>
              <input
                type="checkbox"
                checked={settings.userAlerts.subscriptionChanges}
                onChange={(e) => updateUserAlert('subscriptionChanges', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Payment Failures</p>
                <p className="text-sm text-slate-600">Failed payment attempts</p>
              </div>
              <input
                type="checkbox"
                checked={settings.userAlerts.paymentFailures}
                onChange={(e) => updateUserAlert('paymentFailures', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Support Tickets</p>
                <p className="text-sm text-slate-600">New support requests</p>
              </div>
              <input
                type="checkbox"
                checked={settings.userAlerts.supportTickets}
                onChange={(e) => updateUserAlert('supportTickets', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Suspicious Activity</p>
                <p className="text-sm text-slate-600">Potential security threats</p>
              </div>
              <input
                type="checkbox"
                checked={settings.userAlerts.suspiciousActivity}
                onChange={(e) => updateUserAlert('suspiciousActivity', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Billing Alerts */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <div className="flex items-center space-x-3 mb-6">
          <DollarSign className="h-6 w-6 text-green-600" />
          <h3 className="text-xl font-semibold text-slate-800">Billing & Revenue Alerts</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Failed Payments</p>
                <p className="text-sm text-slate-600">Payment processing failures</p>
              </div>
              <input
                type="checkbox"
                checked={settings.billingAlerts.failedPayments}
                onChange={(e) => updateBillingAlert('failedPayments', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Chargebacks</p>
                <p className="text-sm text-slate-600">Payment disputes</p>
              </div>
              <input
                type="checkbox"
                checked={settings.billingAlerts.chargebacks}
                onChange={(e) => updateBillingAlert('chargebacks', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
            </label>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Refund Requests</p>
                <p className="text-sm text-slate-600">Customer refund requests</p>
              </div>
              <input
                type="checkbox"
                checked={settings.billingAlerts.refundRequests}
                onChange={(e) => updateBillingAlert('refundRequests', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Subscription Cancellations</p>
                <p className="text-sm text-slate-600">Plan cancellations</p>
              </div>
              <input
                type="checkbox"
                checked={settings.billingAlerts.subscriptionCancellations}
                onChange={(e) => updateBillingAlert('subscriptionCancellations', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Notification Frequency */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <div className="flex items-center space-x-3 mb-6">
          <Mail className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-slate-800">Notification Frequency</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Daily Summary</p>
                <p className="text-sm text-slate-600">Daily activity digest</p>
              </div>
              <input
                type="checkbox"
                checked={settings.frequency.dailySummary}
                onChange={(e) => updateFrequency('dailySummary', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Weekly Summary</p>
                <p className="text-sm text-slate-600">Weekly performance report</p>
              </div>
              <input
                type="checkbox"
                checked={settings.frequency.weeklySummary}
                onChange={(e) => updateFrequency('weeklySummary', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
            </label>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Monthly Summary</p>
                <p className="text-sm text-slate-600">Monthly business insights</p>
              </div>
              <input
                type="checkbox"
                checked={settings.frequency.monthlySummary}
                onChange={(e) => updateFrequency('monthlySummary', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Real-time Alerts</p>
                <p className="text-sm text-slate-600">Immediate critical notifications</p>
              </div>
              <input
                type="checkbox"
                checked={settings.frequency.realTimeAlerts}
                onChange={(e) => updateFrequency('realTimeAlerts', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;