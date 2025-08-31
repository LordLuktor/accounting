import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import UsersManagement from './UsersManagement';
import BillingManagement from './BillingManagement';
import SystemSettings from './SystemSettings';
import AdminOverview from './AdminOverview';
import AdminProfile from './AdminProfile';
import AdminSecurity from './AdminSecurity';
import AdminNotifications from './AdminNotifications';
import InvitationManagement from './InvitationManagement';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverview />;
      case 'users':
        return <UsersManagement />;
      case 'invitations':
        return <InvitationManagement />;
      case 'billing':
        return <BillingManagement />;
      case 'settings':
        return <SystemSettings />;
      case 'admin-profile':
        return <AdminProfile />;
      case 'admin-security':
        return <AdminSecurity />;
      case 'admin-notifications':
        return <AdminNotifications />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader onSettingsChange={setActiveTab} />
      <div className="flex">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;