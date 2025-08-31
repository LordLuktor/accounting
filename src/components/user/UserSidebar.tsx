import React from 'react';
import { 
  BarChart3, 
  Building2, 
  FolderTree, 
  ArrowLeftRight, 
  Link, 
  FileText,
  Home
} from 'lucide-react';

interface UserSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const UserSidebar: React.FC<UserSidebarProps> = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'businesses', label: 'Businesses', icon: Building2 },
    { id: 'accounts', label: 'Chart of Accounts', icon: FolderTree },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'integrations', label: 'Integrations', icon: Link },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-full">
      <nav className="p-6">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default UserSidebar;