import React from 'react';
import { useAuth } from './contexts/AuthContext';
import AuthPage from './components/auth/AuthPage';
import AdminDashboard from './components/admin/AdminDashboard';
import UserDashboard from './components/user/UserDashboard';
import LoadingSpinner from './components/common/LoadingSpinner';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <AuthPage />;
  }

  if (user.role === 'admin') {
    return <AdminDashboard />;
  }

  return <UserDashboard />;
}

export default App;