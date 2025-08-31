import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, FolderTree, Edit, Trash2, DollarSign, TrendingUp } from 'lucide-react';
import { Account } from '../../types/business';

interface AccountManagerProps {
  businessId: string | null;
}

const AccountManager: React.FC<AccountManagerProps> = ({ businessId }) => {
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: '1',
      business_id: '1',
      name: 'Cash and Cash Equivalents',
      account_type: 'asset',
      account_code: '1100',
      description: 'Primary business checking account',
      is_active: true,
      auto_generated: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      business_id: '1',
      name: 'Accounts Receivable',
      account_type: 'asset',
      account_code: '1200',
      description: 'Money owed by customers',
      is_active: true,
      auto_generated: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '3',
      business_id: '1',
      name: 'Sales Revenue',
      account_type: 'revenue',
      account_code: '4100',
      description: 'Revenue from product sales',
      is_active: true,
      auto_generated: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '4',
      business_id: '1',
      name: 'Office Expenses',
      account_type: 'expense',
      account_code: '5300',
      description: 'General office expenses',
      is_active: true,
      auto_generated: false,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  ]);

  const [newAccount, setNewAccount] = useState({
    name: '',
    account_type: 'expense' as const,
    account_code: '',
    description: ''
  });

  if (!businessId) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <FolderTree className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">No Business Selected</h2>
          <p className="text-slate-600">Please select a business to manage its chart of accounts</p>
        </div>
      </div>
    );
  }

  const businessAccounts = accounts.filter(account => account.business_id === businessId);
  const accountsByType = {
    asset: businessAccounts.filter(a => a.account_type === 'asset'),
    liability: businessAccounts.filter(a => a.account_type === 'liability'),
    equity: businessAccounts.filter(a => a.account_type === 'equity'),
    revenue: businessAccounts.filter(a => a.account_type === 'revenue'),
    expense: businessAccounts.filter(a => a.account_type === 'expense')
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    
    const account: Account = {
      id: Math.random().toString(36).substr(2, 9),
      business_id: businessId,
      name: newAccount.name,
      account_type: newAccount.account_type,
      account_code: newAccount.account_code,
      description: newAccount.description,
      is_active: true,
      auto_generated: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setAccounts([...accounts, account]);
    setNewAccount({ name: '', account_type: 'expense', account_code: '', description: '' });
    setShowCreateForm(false);
    alert(`Account "${account.name}" created successfully!`);
  };

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account);
    setNewAccount({
      name: account.name,
      account_type: account.account_type,
      account_code: account.account_code,
      description: account.description || ''
    });
  };

  const handleUpdateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingAccount) {
      const updatedAccounts = accounts.map(a => 
        a.id === editingAccount.id 
          ? {
              ...a,
              name: newAccount.name,
              account_type: newAccount.account_type,
              account_code: newAccount.account_code,
              description: newAccount.description,
              updated_at: new Date().toISOString()
            }
          : a
      );
      
      setAccounts(updatedAccounts);
      setEditingAccount(null);
      setNewAccount({ name: '', account_type: 'expense', account_code: '', description: '' });
      alert(`Account "${newAccount.name}" updated successfully!`);
    }
  };

  const handleDeleteAccount = (account: Account) => {
    if (account.auto_generated) {
      alert('Cannot delete auto-generated accounts');
      return;
    }
    
    if (confirm(`Are you sure you want to delete ${account.name}?`)) {
      setAccounts(accounts.filter(a => a.id !== account.id));
      alert(`${account.name} deleted successfully!`);
    }
  };

  const handleAutoGenerate = () => {
    if (confirm('This will generate standard accounts for your business. Continue?')) {
      // Simulate auto-generation
      alert('Standard chart of accounts generated successfully!');
    }
  };

  const getAccountTypeColor = (type: string) => {
    const colors = {
      asset: 'bg-green-50 text-green-700 border-green-200',
      liability: 'bg-red-50 text-red-700 border-red-200',
      equity: 'bg-purple-50 text-purple-700 border-purple-200',
      revenue: 'bg-blue-50 text-blue-700 border-blue-200',
      expense: 'bg-orange-50 text-orange-700 border-orange-200'
    };
    return colors[type as keyof typeof colors] || colors.expense;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Chart of Accounts</h2>
          <p className="text-slate-600">Manage your business account structure</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleAutoGenerate}
            className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            <FolderTree className="h-4 w-4" />
            <span>Auto-Generate</span>
          </button>
          <button 
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Account</span>
          </button>
        </div>
      </div>

      {/* Create/Edit Account Form */}
      {(showCreateForm || editingAccount) && (
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">
            {editingAccount ? 'Edit Account' : 'Create New Account'}
          </h3>
          
          <form onSubmit={editingAccount ? handleUpdateAccount : handleCreateAccount} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Account Name</label>
                <input
                  type="text"
                  value={newAccount.name}
                  onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter account name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Account Type</label>
                <select
                  value={newAccount.account_type}
                  onChange={(e) => setNewAccount({ ...newAccount, account_type: e.target.value as any })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="asset">Asset</option>
                  <option value="liability">Liability</option>
                  <option value="equity">Equity</option>
                  <option value="revenue">Revenue</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Account Code</label>
                <input
                  type="text"
                  value={newAccount.account_code}
                  onChange={(e) => setNewAccount({ ...newAccount, account_code: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 5400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <input
                  type="text"
                  value={newAccount.description}
                  onChange={(e) => setNewAccount({ ...newAccount, description: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Account description"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                {editingAccount ? 'Update Account' : 'Create Account'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingAccount(null);
                  setNewAccount({ name: '', account_type: 'expense', account_code: '', description: '' });
                }}
                className="px-6 py-3 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Accounts by Type */}
      <div className="space-y-6">
        {Object.entries(accountsByType).map(([type, typeAccounts]) => (
          <div key={type} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 capitalize">{type} Accounts</h3>
            </div>
            
            {typeAccounts.length > 0 ? (
              <div className="divide-y divide-slate-200">
                {typeAccounts.map((account) => (
                  <div key={account.id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getAccountTypeColor(account.account_type)}`}>
                          {account.account_code}
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-800">{account.name}</h4>
                          {account.description && (
                            <p className="text-sm text-slate-600">{account.description}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditAccount(account)}
                          className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit account"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {!account.auto_generated && (
                          <button
                            onClick={() => handleDeleteAccount(account)}
                            className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete account"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-6 py-8 text-center text-slate-500">
                No {type} accounts found
              </div>
            )}
          </div>
        ))}
      </div>

      {businessAccounts.length === 0 && (
        <div className="text-center py-12">
          <FolderTree className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-800 mb-2">No Accounts Set Up</h3>
          <p className="text-slate-600 mb-6">Create your chart of accounts to start tracking your business finances</p>
          <button 
            onClick={handleAutoGenerate}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors mr-3"
          >
            Auto-Generate Standard Accounts
          </button>
          <button 
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Create Manual Account
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountManager;