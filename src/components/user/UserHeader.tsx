import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, Settings, User, Bell, ChevronDown, Building2 } from 'lucide-react';

interface UserHeaderProps {
  selectedBusinessId: string | null;
  onBusinessChange: (businessId: string) => void;
  onSettingsChange: (tab: string) => void;
}

const UserHeader: React.FC<UserHeaderProps> = ({ 
  selectedBusinessId, 
  onBusinessChange, 
  onSettingsChange 
}) => {
  const { user, signOut } = useAuth();
  const [showBusinessDropdown, setShowBusinessDropdown] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  // Mock businesses data - in real app, this would come from props or context
  const businesses = [
    { id: '1', name: 'Acme Corp', industry: 'Technology' },
    { id: '2', name: 'Smith Consulting', industry: 'Professional Services' },
    { id: '3', name: 'Green Energy LLC', industry: 'Energy' },
  ];

  const selectedBusiness = businesses.find(b => b.id === selectedBusinessId);

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">AccuFlow</h1>
            <p className="text-slate-600">Professional Accounting Platform</p>
          </div>
          
          {/* Business Selector */}
          <div className="relative">
            <button 
              onClick={() => setShowBusinessDropdown(!showBusinessDropdown)}
              className="flex items-center space-x-3 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Building2 className="h-5 w-5 text-slate-600" />
              <div className="text-left">
                <p className="font-medium text-slate-800">
                  {selectedBusiness ? selectedBusiness.name : 'Select Business'}
                </p>
                {selectedBusiness && (
                  <p className="text-xs text-slate-600">{selectedBusiness.industry}</p>
                )}
              </div>
              <ChevronDown className="h-4 w-4 text-slate-600" />
            </button>
            
            {showBusinessDropdown && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
                {businesses.map((business) => (
                  <button
                    key={business.id}
                    onClick={() => {
                      onBusinessChange(business.id);
                      setShowBusinessDropdown(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors ${
                      selectedBusinessId === business.id ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
                    }`}
                  >
                    <Building2 className="h-4 w-4 text-slate-500" />
                    <div>
                      <p className="font-medium">{business.name}</p>
                      <p className="text-xs text-slate-500">{business.industry}</p>
                    </div>
                  </button>
                ))}
                <hr className="my-2 border-slate-200" />
                <button 
                  onClick={() => {
                    onSettingsChange('businesses');
                    setShowBusinessDropdown(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors text-slate-700"
                >
                  <Settings className="h-4 w-4 text-slate-500" />
                  <span>Manage Businesses</span>
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-800">{user?.first_name} {user?.last_name}</p>
            <p className="text-xs text-slate-600 capitalize">
              {user?.account_type === 'super_free' ? 'Super Free' : 
               user?.account_type === 'free' ? 'Free Account' : 
               user?.subscription_status}
            </p>
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
                    onSettingsChange('profile');
                    setShowSettingsMenu(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors"
                >
                  <User className="h-4 w-4 text-slate-600" />
                  <span className="text-slate-700">Profile Settings</span>
                </button>
                <button 
                  onClick={() => {
                    onSettingsChange('billing');
                    setShowSettingsMenu(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors"
                >
                  <Bell className="h-4 w-4 text-slate-600" />
                  <span className="text-slate-700">Billing & Subscription</span>
                </button>
                <button 
                  onClick={() => {
                    onSettingsChange('notifications');
                    setShowSettingsMenu(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors"
                >
                  <Bell className="h-4 w-4 text-slate-600" />
                  <span className="text-slate-700">Notifications</span>
                </button>
                <hr className="my-2 border-slate-200" />
                <button 
                  onClick={signOut}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Click outside handlers */}
      {showBusinessDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowBusinessDropdown(false)}
        />
      )}
      {showSettingsMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowSettingsMenu(false)}
        />
      )}
    </header>
  );
};

export default UserHeader;