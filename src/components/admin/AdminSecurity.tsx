import React, { useState } from 'react';
import { Shield, Key, AlertTriangle, CheckCircle, Save, Eye, EyeOff } from 'lucide-react';

const AdminSecurity: React.FC = () => {
  const [settings, setSettings] = useState({
    twoFactorEnabled: true,
    sessionTimeout: 60,
    passwordExpiry: 90,
    loginAttempts: 5,
    ipWhitelist: '',
    auditLogging: true,
    emailAlerts: true,
  });

  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey] = useState('ak_live_51HyWnLkdIwHu7ixaJttfMxqHVDAapmqcgqC8w6dXSxOtpCV7FH4wfqnwxS1pQbCqhPdlMnqRjlHXMuDHjjh00LlMIzVLq');

  const securityEvents = [
    { event: 'Admin login', user: 'admin@demo.com', ip: '192.168.1.100', time: '2024-01-15 10:30', status: 'success' },
    { event: 'Failed login attempt', user: 'unknown@hacker.com', ip: '45.123.45.67', time: '2024-01-15 08:15', status: 'blocked' },
    { event: 'Password changed', user: 'admin@demo.com', ip: '192.168.1.100', time: '2024-01-14 16:45', status: 'success' },
    { event: 'API key generated', user: 'admin@demo.com', ip: '192.168.1.100', time: '2024-01-14 14:20', status: 'success' },
  ];

  const handleSave = () => {
    alert('Security settings saved successfully!');
  };

  const regenerateApiKey = () => {
    if (confirm('Are you sure you want to regenerate the API key? This will invalidate the current key.')) {
      alert('New API key generated successfully!');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Security Settings</h2>
          <p className="text-slate-600">Manage administrator security and access controls</p>
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
        {/* Authentication Settings */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-semibold text-slate-800">Authentication</h3>
          </div>

          <div className="space-y-6">
            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Two-Factor Authentication</p>
                <p className="text-sm text-slate-600">Require 2FA for admin accounts</p>
              </div>
              <input
                type="checkbox"
                checked={settings.twoFactorEnabled}
                onChange={(e) => setSettings({ ...settings, twoFactorEnabled: e.target.checked })}
                className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
            </label>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Session Timeout (minutes)</label>
              <input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password Expiry (days)</label>
              <input
                type="number"
                value={settings.passwordExpiry}
                onChange={(e) => setSettings({ ...settings, passwordExpiry: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Max Login Attempts</label>
              <input
                type="number"
                value={settings.loginAttempts}
                onChange={(e) => setSettings({ ...settings, loginAttempts: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Access Control */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center space-x-3 mb-6">
            <Key className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-semibold text-slate-800">Access Control</h3>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">IP Whitelist</label>
              <textarea
                value={settings.ipWhitelist}
                onChange={(e) => setSettings({ ...settings, ipWhitelist: e.target.value })}
                placeholder="Enter IP addresses, one per line"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
              />
              <p className="text-xs text-slate-500 mt-1">Leave empty to allow all IPs</p>
            </div>

            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Audit Logging</p>
                <p className="text-sm text-slate-600">Log all admin actions</p>
              </div>
              <input
                type="checkbox"
                checked={settings.auditLogging}
                onChange={(e) => setSettings({ ...settings, auditLogging: e.target.checked })}
                className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Security Email Alerts</p>
                <p className="text-sm text-slate-600">Email notifications for security events</p>
              </div>
              <input
                type="checkbox"
                checked={settings.emailAlerts}
                onChange={(e) => setSettings({ ...settings, emailAlerts: e.target.checked })}
                className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
            </label>
          </div>
        </div>
      </div>

      {/* API Key Management */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <div className="flex items-center space-x-3 mb-6">
          <Key className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-slate-800">API Key Management</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Admin API Key</label>
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  readOnly
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <button
                onClick={regenerateApiKey}
                className="px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Regenerate
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1">Use this key for administrative API access</p>
          </div>
        </div>
      </div>

      {/* Recent Security Events */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-xl font-semibold text-slate-800 mb-6">Recent Security Events</h3>
        
        <div className="space-y-4">
          {securityEvents.map((event, index) => (
            <div key={index} className="flex items-center justify-between py-4 border-b border-slate-100 last:border-b-0">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${
                  event.status === 'success' ? 'bg-green-100 text-green-600' : 
                  event.status === 'blocked' ? 'bg-red-100 text-red-600' : 
                  'bg-yellow-100 text-yellow-600'
                }`}>
                  {event.status === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                </div>
                <div>
                  <p className="font-medium text-slate-800">{event.event}</p>
                  <p className="text-sm text-slate-600">{event.user} from {event.ip}</p>
                </div>
              </div>
              <span className="text-sm text-slate-500">{event.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminSecurity;