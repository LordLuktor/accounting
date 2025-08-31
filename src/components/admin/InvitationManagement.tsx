import React, { useState } from 'react';
import { Plus, Mail, Clock, CheckCircle, XCircle, Copy, Trash2, RefreshCw, Shield, AlertTriangle } from 'lucide-react';
import { Invitation } from '../../types/auth';

const InvitationManagement: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showSuperForm, setShowSuperForm] = useState(false);
  const [newInvitation, setNewInvitation] = useState({
    email: '',
    expiryDays: 7,
    note: ''
  });
  const [newSuperAccount, setNewSuperAccount] = useState({
    email: '',
    firstName: '',
    lastName: '',
    note: ''
  });

  const [invitations, setInvitations] = useState<Invitation[]>([
    {
      id: '1',
      email: 'john.doe@example.com',
      invited_by: 'admin-1',
      invited_by_name: 'Admin User',
      status: 'pending',
      created_at: '2024-01-15T10:30:00Z',
      expires_at: '2024-01-22T10:30:00Z'
    },
    {
      id: '2',
      email: 'sarah.smith@company.com',
      invited_by: 'admin-1',
      invited_by_name: 'Admin User',
      status: 'accepted',
      created_at: '2024-01-10T14:20:00Z',
      expires_at: '2024-01-17T14:20:00Z',
      used_at: '2024-01-12T09:15:00Z'
    },
    {
      id: '3',
      email: 'expired@test.com',
      invited_by: 'admin-1',
      invited_by_name: 'Admin User',
      status: 'expired',
      created_at: '2024-01-01T12:00:00Z',
      expires_at: '2024-01-08T12:00:00Z'
    }
  ]);

  const handleCreateInvitation = (e: React.FormEvent) => {
    e.preventDefault();
    
    const invitation: Invitation = {
      id: Math.random().toString(36).substr(2, 9),
      email: newInvitation.email,
      invited_by: 'admin-1',
      invited_by_name: 'Admin User',
      status: 'pending',
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + newInvitation.expiryDays * 24 * 60 * 60 * 1000).toISOString()
    };

    setInvitations([invitation, ...invitations]);
    setNewInvitation({ email: '', expiryDays: 7, note: '' });
    setShowCreateForm(false);
    
    // In real app, this would send the invitation email
    alert(`Invitation sent to ${invitation.email}!`);
  };

  const handleCreateSuperAccount = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In real app, this would create the account directly in the database
    alert(`Super Free account created for ${newSuperAccount.email}! They can now sign in with any password.`);
    
    setNewSuperAccount({ email: '', firstName: '', lastName: '', note: '' });
    setShowSuperForm(false);
  };

  const handleResendInvitation = (invitationId: string) => {
    const invitation = invitations.find(inv => inv.id === invitationId);
    if (invitation) {
      // Update expiry date
      const updatedInvitations = invitations.map(inv => 
        inv.id === invitationId 
          ? { ...inv, expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() }
          : inv
      );
      setInvitations(updatedInvitations);
      alert(`Invitation resent to ${invitation.email}!`);
    }
  };

  const handleDeleteInvitation = (invitationId: string) => {
    if (confirm('Are you sure you want to delete this invitation?')) {
      setInvitations(invitations.filter(inv => inv.id !== invitationId));
    }
  };

  const copyInvitationLink = (invitationId: string) => {
    const link = `${window.location.origin}/invite/${invitationId}`;
    navigator.clipboard.writeText(link);
    alert('Invitation link copied to clipboard!');
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      accepted: 'bg-green-100 text-green-800 border-green-200',
      expired: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4" />;
      case 'expired':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const pendingCount = invitations.filter(inv => inv.status === 'pending').length;
  const acceptedCount = invitations.filter(inv => inv.status === 'accepted').length;
  const expiredCount = invitations.filter(inv => inv.status === 'expired').length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Invitation Management</h2>
          <p className="text-slate-600">Create and manage invitation-only free accounts</p>
        </div>
        
        <button 
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Send Invitation</span>
        </button>
        
        <button 
          onClick={() => setShowSuperForm(true)}
          className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
        >
          <Shield className="h-4 w-4" />
          <span>Create Super Account</span>
        </button>
      </div>

      {/* Invitation Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 text-blue-700 rounded-lg">
              <Mail className="h-6 w-6" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800 mb-1">{invitations.length}</h3>
            <p className="text-sm text-slate-600">Total Invitations</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-50 text-yellow-700 rounded-lg">
              <Clock className="h-6 w-6" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800 mb-1">{pendingCount}</h3>
            <p className="text-sm text-slate-600">Pending</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 text-green-700 rounded-lg">
              <CheckCircle className="h-6 w-6" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800 mb-1">{acceptedCount}</h3>
            <p className="text-sm text-slate-600">Accepted</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-50 text-red-700 rounded-lg">
              <XCircle className="h-6 w-6" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800 mb-1">{expiredCount}</h3>
            <p className="text-sm text-slate-600">Expired</p>
          </div>
        </div>
      </div>

      {/* Create Invitation Form */}
      {showCreateForm && (
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">Send New Invitation</h3>
          <form onSubmit={handleCreateInvitation} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={newInvitation.email}
                  onChange={(e) => setNewInvitation({ ...newInvitation, email: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="user@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Expiry (days)</label>
                <select
                  value={newInvitation.expiryDays}
                  onChange={(e) => setNewInvitation({ ...newInvitation, expiryDays: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={1}>1 day</option>
                  <option value={3}>3 days</option>
                  <option value={7}>7 days</option>
                  <option value={14}>14 days</option>
                  <option value={30}>30 days</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Note (Optional)</label>
              <textarea
                value={newInvitation.note}
                onChange={(e) => setNewInvitation({ ...newInvitation, note: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Add a personal note for the invitation..."
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Free Account Features:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 1 Business entity</li>
                <li>• 500 Transactions per month</li>
                <li>• Basic integrations (Stripe, Square, PayPal)</li>
                <li>• Standard reports</li>
                <li>• Email support</li>
                <li>• No billing or payment required</li>
              </ul>
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Send Invitation
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-6 py-3 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Create Super Free Account Form */}
      {showSuperForm && (
        <div className="bg-white rounded-xl p-6 border border-purple-200 border-2">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="h-6 w-6 text-purple-600" />
            <h3 className="text-xl font-semibold text-slate-800">Create Super Free Account</h3>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-purple-800 mb-2">⚡ Super Free Account Features:</h4>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• <strong>Unlimited</strong> business entities</li>
              <li>• <strong>Unlimited</strong> transactions per month</li>
              <li>• <strong>All</strong> integrations and features</li>
              <li>• <strong>Advanced</strong> reports and analytics</li>
              <li>• <strong>API access</strong> and custom integrations</li>
              <li>• <strong>Priority support</strong> and direct access</li>
              <li>• <strong>No billing</strong> or payment required - ever</li>
            </ul>
          </div>
          
          <form onSubmit={handleCreateSuperAccount} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                <input
                  type="text"
                  value={newSuperAccount.firstName}
                  onChange={(e) => setNewSuperAccount({ ...newSuperAccount, firstName: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                <input
                  type="text"
                  value={newSuperAccount.lastName}
                  onChange={(e) => setNewSuperAccount({ ...newSuperAccount, lastName: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <input
                type="email"
                value={newSuperAccount.email}
                onChange={(e) => setNewSuperAccount({ ...newSuperAccount, email: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="user@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Internal Note</label>
              <textarea
                value={newSuperAccount.note}
                onChange={(e) => setNewSuperAccount({ ...newSuperAccount, note: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={3}
                placeholder="Internal note about this super account..."
              />
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-800 mb-1">Important:</h4>
                  <p className="text-sm text-amber-700">
                    Super Free accounts have unlimited access to all features without any billing. 
                    Only create these for internal use, testing, or special partnerships.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="submit"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Create Super Account
              </button>
              <button
                type="button"
                onClick={() => setShowSuperForm(false)}
                className="px-6 py-3 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Create Super Free Account Form */}
      {showSuperForm && (
        <div className="bg-white rounded-xl p-6 border border-purple-200 border-2">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="h-6 w-6 text-purple-600" />
            <h3 className="text-xl font-semibold text-slate-800">Create Super Free Account</h3>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-purple-800 mb-2">⚡ Super Free Account Features:</h4>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• <strong>Unlimited</strong> business entities</li>
              <li>• <strong>Unlimited</strong> transactions per month</li>
              <li>• <strong>All</strong> integrations and features</li>
              <li>• <strong>Advanced</strong> reports and analytics</li>
              <li>• <strong>API access</strong> and custom integrations</li>
              <li>• <strong>Priority support</strong> and direct access</li>
              <li>• <strong>No billing</strong> or payment required - ever</li>
            </ul>
          </div>
          
          <form onSubmit={handleCreateSuperAccount} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                <input
                  type="text"
                  value={newSuperAccount.firstName}
                  onChange={(e) => setNewSuperAccount({ ...newSuperAccount, firstName: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                <input
                  type="text"
                  value={newSuperAccount.lastName}
                  onChange={(e) => setNewSuperAccount({ ...newSuperAccount, lastName: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <input
                type="email"
                value={newSuperAccount.email}
                onChange={(e) => setNewSuperAccount({ ...newSuperAccount, email: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="user@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Internal Note</label>
              <textarea
                value={newSuperAccount.note}
                onChange={(e) => setNewSuperAccount({ ...newSuperAccount, note: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={3}
                placeholder="Internal note about this super account..."
              />
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-800 mb-1">Important:</h4>
                  <p className="text-sm text-amber-700">
                    Super Free accounts have unlimited access to all features without any billing. 
                    Only create these for internal use, testing, or special partnerships. The user can 
                    sign in immediately with any password.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="submit"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Create Super Account
              </button>
              <button
                type="button"
                onClick={() => setShowSuperForm(false)}
                className="px-6 py-3 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Invitations Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">Sent Invitations</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Email</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Invited By</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Created</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Expires</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {invitations.map((invitation) => (
                <tr key={invitation.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-slate-400" />
                      <span className="font-medium text-slate-800">{invitation.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(invitation.status)}`}>
                        {getStatusIcon(invitation.status)}
                        <span className="capitalize">{invitation.status}</span>
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-700">{invitation.invited_by_name}</td>
                  <td className="px-6 py-4 text-slate-600">
                    {new Date(invitation.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {new Date(invitation.expires_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-2">
                      {invitation.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => copyInvitationLink(invitation.id)}
                            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Copy invitation link"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleResendInvitation(invitation.id)}
                            className="p-2 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Resend invitation"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => handleDeleteInvitation(invitation.id)}
                        className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete invitation"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Free Account Information */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-xl font-semibold text-slate-800 mb-6">Free Account Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold text-slate-800 mb-4">Account Limitations</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Maximum Businesses</span>
                <span className="font-medium text-slate-800">1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Monthly Transactions</span>
                <span className="font-medium text-slate-800">500</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Available Integrations</span>
                <span className="font-medium text-slate-800">Basic (3)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Report Types</span>
                <span className="font-medium text-slate-800">Standard</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Support Level</span>
                <span className="font-medium text-slate-800">Email Only</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-800 mb-4">Upgrade Path</h4>
            <div className="space-y-3">
              <p className="text-sm text-slate-600">
                Free account users can upgrade to paid plans at any time to unlock:
              </p>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Multiple business entities</li>
                <li>• Unlimited transactions</li>
                <li>• Advanced integrations</li>
                <li>• Custom reports and analytics</li>
                <li>• Priority support</li>
              </ul>
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">
                  <strong>Note:</strong> Free accounts never expire and require no payment information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitationManagement;