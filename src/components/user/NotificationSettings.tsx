import React, { useState } from 'react';
import { Bell, Mail, Smartphone, AlertCircle, Save } from 'lucide-react';

const NotificationSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    emailNotifications: {
      transactionAlerts: true,
      weeklyReports: true,
      billingReminders: true,
      securityAlerts: true,
      productUpdates: false,
      marketingEmails: false,
    },
    pushNotifications: {
      transactionAlerts: true,
      integrationErrors: true,
      billingIssues: true,
      systemMaintenance: true,
    },
    frequency: {
      reportFrequency: 'weekly',
      alertThreshold: 1000,
    }
  });

  const handleSave = () => {
    // In real app, this would save to database
    alert('Notification settings saved successfully!');
  };

  const updateEmailSetting = (key: string, value: boolean) => {
    setSettings({
      ...settings,
      emailNotifications: {
        ...settings.emailNotifications,
        [key]: value
      }
    });
  };

  const updatePushSetting = (key: string, value: boolean) => {
    setSettings({
      ...settings,
      pushNotifications: {
        ...settings.pushNotifications,
        [key]: value
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Notification Settings</h2>
          <p className="text-slate-600">Configure how and when you receive notifications</p>
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
        {/* Email Notifications */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center space-x-3 mb-6">
            <Mail className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-semibold text-slate-800">Email Notifications</h3>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Transaction Alerts</p>
                <p className="text-sm text-slate-600">Get notified of new transactions</p>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications.transactionAlerts}
                onChange={(e) => updateEmailSetting('transactionAlerts', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Weekly Reports</p>
                <p className="text-sm text-slate-600">Receive weekly financial summaries</p>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications.weeklyReports}
                onChange={(e) => updateEmailSetting('weeklyReports', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Billing Reminders</p>
                <p className="text-sm text-slate-600">Payment due dates and renewals</p>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications.billingReminders}
                onChange={(e) => updateEmailSetting('billingReminders', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Security Alerts</p>
                <p className="text-sm text-slate-600">Login attempts and security events</p>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications.securityAlerts}
                onChange={(e) => updateEmailSetting('securityAlerts', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Product Updates</p>
                <p className="text-sm text-slate-600">New features and improvements</p>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications.productUpdates}
                onChange={(e) => updateEmailSetting('productUpdates', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Marketing Emails</p>
                <p className="text-sm text-slate-600">Tips, best practices, and promotions</p>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications.marketingEmails}
                onChange={(e) => updateEmailSetting('marketingEmails', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        {/* Push Notifications */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center space-x-3 mb-6">
            <Smartphone className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-semibold text-slate-800">Push Notifications</h3>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Transaction Alerts</p>
                <p className="text-sm text-slate-600">Instant notifications for transactions</p>
              </div>
              <input
                type="checkbox"
                checked={settings.pushNotifications.transactionAlerts}
                onChange={(e) => updatePushSetting('transactionAlerts', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Integration Errors</p>
                <p className="text-sm text-slate-600">Issues with payment platform connections</p>
              </div>
              <input
                type="checkbox"
                checked={settings.pushNotifications.integrationErrors}
                onChange={(e) => updatePushSetting('integrationErrors', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Billing Issues</p>
                <p className="text-sm text-slate-600">Payment failures and subscription issues</p>
              </div>
              <input
                type="checkbox"
                checked={settings.pushNotifications.billingIssues}
                onChange={(e) => updatePushSetting('billingIssues', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">System Maintenance</p>
                <p className="text-sm text-slate-600">Scheduled maintenance and downtime</p>
              </div>
              <input
                type="checkbox"
                checked={settings.pushNotifications.systemMaintenance}
                onChange={(e) => updatePushSetting('systemMaintenance', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-xl font-semibold text-slate-800 mb-6">Notification Preferences</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Report Frequency</label>
            <select
              value={settings.frequency.reportFrequency}
              onChange={(e) => setSettings({
                ...settings,
                frequency: { ...settings.frequency, reportFrequency: e.target.value }
              })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="never">Never</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Large Transaction Alert ($)</label>
            <input
              type="number"
              value={settings.frequency.alertThreshold}
              onChange={(e) => setSettings({
                ...settings,
                frequency: { ...settings.frequency, alertThreshold: parseInt(e.target.value) }
              })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;