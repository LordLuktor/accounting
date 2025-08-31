import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, Settings, User, Shield, Bell } from 'lucide-react';

interface AdminHeaderProps {
  onSettingsChange: (tab: string) => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onSettingsChange }) => {
  const { user, signOut } = useAuth();
  const [showSettingsMenu, setShowSettingsMenu] = React.useState(false);

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">AccuFlow Admin</h1>
          <p className="text-slate-600">System Administration Dashboard</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-800">{user?.first_name} {user?.last_name}</p>
            <p className="text-xs text-slate-600 capitalize">{user?.role}</p>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowSettingsMenu(!showSettingsMenu)}
              className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Settings className="h-5 w-5" />
            </button>
            
            {showSettingsMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
                <button 
                  onClick={() => {
                    onSettingsChange('admin-profile');
                    setShowSettingsMenu(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors"
                >
                  <User className="h-4 w-4 text-slate-600" />
                  <span className="text-slate-700">Admin Profile</span>
                </button>
                <button 
                  onClick={() => {
                    onSettingsChange('admin-security');
                    setShowSettingsMenu(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors"
                >
                  <Shield className="h-4 w-4 text-slate-600" />
                  <span className="text-slate-700">Security Settings</span>
                </button>
                <button 
                  onClick={() => {
                    onSettingsChange('admin-notifications');
                    setShowSettingsMenu(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors"
                >
                  <Bell className="h-4 w-4 text-slate-600" />
                  <span className="text-slate-700">Admin Notifications</span>
                </button>
                <hr className="my-2 border-slate-200" />
                <button 
                  onClick={() => {
                    onSettingsChange('settings');
                    setShowSettingsMenu(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors"
                >
                  <Settings className="h-4 w-4 text-slate-600" />
                  <span className="text-slate-700">System Preferences</span>
                </button>
              </div>
            )}
          </div>
          
          <button 
            onClick={signOut}
            className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Click outside to close settings menu */}
      {showSettingsMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowSettingsMenu(false)}
        />
      )}
    </header>
  );
};

export default AdminHeader;