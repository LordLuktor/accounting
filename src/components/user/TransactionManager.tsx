import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, ArrowLeftRight, Filter, Download, Search, Calendar, DollarSign } from 'lucide-react';
import { Transaction } from '../../types/transaction';

interface TransactionManagerProps {
  businessId: string | null;
}

const TransactionManager: React.FC<TransactionManagerProps> = ({ businessId }) => {
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState('30');
  
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      business_id: '1',
      account_id: '1',
      integration_source: 'Stripe',
      external_transaction_id: 'pi_1234567890',
      transaction_type: 'credit',
      amount: 2500.00,
      currency: 'USD',
      description: 'Payment from Customer #1234',
      reference_number: 'REF-001',
      transaction_date: '2024-01-15T10:30:00Z',
      reconciled: false,
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T10:30:00Z',
      metadata: { customer_id: 'cus_123', invoice_id: 'inv_456' }
    },
    {
      id: '2',
      business_id: '1',
      account_id: '4',
      transaction_type: 'debit',
      amount: 127.50,
      currency: 'USD',
      description: 'Office Supplies - Staples',
      reference_number: 'REF-002',
      transaction_date: '2024-01-15T08:15:00Z',
      reconciled: true,
      created_at: '2024-01-15T08:15:00Z',
      updated_at: '2024-01-15T08:15:00Z'
    },
    {
      id: '3',
      business_id: '1',
      account_id: '1',
      integration_source: 'Square',
      external_transaction_id: 'sq_1234567890',
      transaction_type: 'credit',
      amount: 89.99,
      currency: 'USD',
      description: 'POS Sale - Store Location',
      reference_number: 'REF-003',
      transaction_date: '2024-01-14T16:45:00Z',
      reconciled: false,
      created_at: '2024-01-14T16:45:00Z',
      updated_at: '2024-01-14T16:45:00Z'
    }
  ]);

  const [newTransaction, setNewTransaction] = useState({
    account_id: '',
    transaction_type: 'debit' as const,
    amount: '',
    description: '',
    reference_number: '',
    transaction_date: new Date().toISOString().split('T')[0]
  });

  if (!businessId) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <ArrowLeftRight className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">No Business Selected</h2>
          <p className="text-slate-600">Please select a business to view its transactions</p>
        </div>
      </div>
    );
  }

  const businessTransactions = transactions.filter(t => t.business_id === businessId);
  
  const filteredTransactions = businessTransactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reference_number?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || transaction.transaction_type === filterType;
    
    const transactionDate = new Date(transaction.transaction_date);
    const daysAgo = parseInt(dateRange);
    const cutoffDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    const matchesDate = dateRange === 'all' || transactionDate >= cutoffDate;
    
    return matchesSearch && matchesType && matchesDate;
  });

  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    
    const transaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      business_id: businessId,
      account_id: newTransaction.account_id,
      transaction_type: newTransaction.transaction_type,
      amount: parseFloat(newTransaction.amount),
      currency: 'USD',
      description: newTransaction.description,
      reference_number: newTransaction.reference_number,
      transaction_date: new Date(newTransaction.transaction_date).toISOString(),
      reconciled: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setTransactions([transaction, ...transactions]);
    setNewTransaction({
      account_id: '',
      transaction_type: 'debit',
      amount: '',
      description: '',
      reference_number: '',
      transaction_date: new Date().toISOString().split('T')[0]
    });
    setShowCreateForm(false);
    alert(`Transaction "${transaction.description}" created successfully!`);
  };

  const handleSyncAll = () => {
    alert('Syncing all integrations... This will import new transactions from connected payment platforms.');
  };

  const handleExport = () => {
    alert('Exporting transactions to CSV...');
  };

  const handleViewDetails = (transaction: Transaction) => {
    alert(`Viewing details for transaction: ${transaction.description}\nAmount: $${transaction.amount}\nDate: ${new Date(transaction.transaction_date).toLocaleDateString()}`);
  };

  const toggleReconciled = (transactionId: string) => {
    setTransactions(transactions.map(t => 
      t.id === transactionId 
        ? { ...t, reconciled: !t.reconciled, updated_at: new Date().toISOString() }
        : t
    ));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Transactions</h2>
          <p className="text-slate-600">View and manage all business transactions</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleSyncAll}
            className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            <ArrowLeftRight className="h-4 w-4" />
            <span>Sync All</span>
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center space-x-2 bg-slate-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button 
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search transactions..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="credit">Credits</option>
              <option value="debit">Debits</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
              <option value="all">All time</option>
            </select>
          </div>

          <div className="flex items-end">
            <button 
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
                setDateRange('30');
              }}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Create Transaction Form */}
      {showCreateForm && (
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">Add New Transaction</h3>
          
          <form onSubmit={handleCreateTransaction} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Account</label>
                <select
                  value={newTransaction.account_id}
                  onChange={(e) => setNewTransaction({ ...newTransaction, account_id: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Account</option>
                  <option value="1">1100 - Cash and Cash Equivalents</option>
                  <option value="2">1200 - Accounts Receivable</option>
                  <option value="3">4100 - Sales Revenue</option>
                  <option value="4">5300 - Office Expenses</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Transaction Type</label>
                <select
                  value={newTransaction.transaction_type}
                  onChange={(e) => setNewTransaction({ ...newTransaction, transaction_type: e.target.value as any })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="debit">Debit (Expense/Asset Increase)</option>
                  <option value="credit">Credit (Revenue/Liability Increase)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Transaction Date</label>
                <input
                  type="date"
                  value={newTransaction.transaction_date}
                  onChange={(e) => setNewTransaction({ ...newTransaction, transaction_date: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
              <input
                type="text"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Transaction description"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Reference Number (Optional)</label>
              <input
                type="text"
                value={newTransaction.reference_number}
                onChange={(e) => setNewTransaction({ ...newTransaction, reference_number: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="REF-001"
              />
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Create Transaction
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewTransaction({
                    account_id: '',
                    transaction_type: 'debit',
                    amount: '',
                    description: '',
                    reference_number: '',
                    transaction_date: new Date().toISOString().split('T')[0]
                  });
                }}
                className="px-6 py-3 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">
              Transactions ({filteredTransactions.length})
            </h3>
            <div className="text-sm text-slate-600">
              Total: ${filteredTransactions.reduce((sum, t) => sum + (t.transaction_type === 'credit' ? t.amount : -t.amount), 0).toFixed(2)}
            </div>
          </div>
        </div>

        {filteredTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Date</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Description</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Source</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-slate-700">Amount</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-slate-700">Status</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-700">
                      {new Date(transaction.transaction_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-800">{transaction.description}</p>
                        {transaction.reference_number && (
                          <p className="text-sm text-slate-600">Ref: {transaction.reference_number}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {transaction.integration_source || 'Manual'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-semibold ${
                        transaction.transaction_type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.transaction_type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => toggleReconciled(transaction.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          transaction.reconciled 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                        }`}
                      >
                        {transaction.reconciled ? 'Reconciled' : 'Pending'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleViewDetails(transaction)}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <ArrowLeftRight className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No Transactions Found</h3>
            <p className="text-slate-600">No transactions match your current filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionManager;