import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Save, User, Mail, Lock, Shield } from 'lucide-react';

const AdminProfile: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, this would update admin profile
    alert('Admin profile updated successfully!');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    // In real app, this would update password
    alert('Password updated successfully!');
    setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Admin Profile</h2>
        <p className="text-slate-600">Manage your administrator account information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Information */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center space-x-3 mb-6">
            <User className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-semibold text-slate-800">Personal Information</h3>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
          </form>
        </div>

        {/* Password Change */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center space-x-3 mb-6">
            <Lock className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-semibold text-slate-800">Change Password</h3>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
              <input
                type="password"
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <Lock className="h-4 w-4" />
              <span>Update Password</span>
            </button>
          </form>
        </div>
      </div>

      {/* Admin Information */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <div className="flex items-center space-x-3 mb-6">
          <Shield className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-slate-800">Administrator Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-600 mb-1">Admin Level</p>
            <p className="font-semibold text-blue-800 capitalize">Super Admin</p>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600 mb-1">Last Login</p>
            <p className="font-semibold text-slate-800">Today, 9:30 AM</p>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600 mb-1">Admin Since</p>
            <p className="font-semibold text-slate-800">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;