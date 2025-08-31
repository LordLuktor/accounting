import React, { useState } from 'react';
import UserSidebar from './UserSidebar';
import UserHeader from './UserHeader';
import Dashboard from './Dashboard';
import BusinessManager from './BusinessManager';
import AccountManager from './AccountManager';
import TransactionManager from './TransactionManager';
import IntegrationManager from './IntegrationManager';
import ReportsManager from './ReportsManager';
import ProfileSettings from './ProfileSettings';
import BillingSettings from './BillingSettings';
import NotificationSettings from './NotificationSettings';

const UserDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>('1');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard businessId={selectedBusinessId} />;
      case 'businesses':
        return <BusinessManager onBusinessSelect={setSelectedBusinessId} />;
      case 'accounts':
        return <AccountManager businessId={selectedBusinessId} />;
      case 'transactions':
        return <TransactionManager businessId={selectedBusinessId} />;
      case 'integrations':
        return <IntegrationManager businessId={selectedBusinessId} />;
      case 'reports':
        return <ReportsManager businessId={selectedBusinessId} />;
      case 'profile':
        return <ProfileSettings />;
      case 'billing':
        return <BillingSettings />;
      case 'notifications':
        return <NotificationSettings />;
      default:
        return <Dashboard businessId={selectedBusinessId} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <UserHeader 
        selectedBusinessId={selectedBusinessId}
        onBusinessChange={setSelectedBusinessId}
        onSettingsChange={setActiveTab}
      />
      <div className="flex">
        <UserSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;