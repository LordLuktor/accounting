import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Building2, Edit, Trash2, MapPin, Calendar } from 'lucide-react';
import { Business } from '../../types/business';

interface BusinessManagerProps {
  onBusinessSelect: (businessId: string) => void;
}

const BusinessManager: React.FC<BusinessManagerProps> = ({ onBusinessSelect }) => {
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([
    {
      id: '1',
      user_id: 'user-1',
      name: 'Acme Corp',
      description: 'Technology consulting and software development',
      industry: 'Technology',
      tax_id: '12-3456789',
      address: '123 Tech Street, San Francisco, CA 94105',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-15T10:30:00Z',
      settings: {
        fiscal_year_end: '12-31',
        currency: 'USD',
        timezone: 'America/Los_Angeles',
        auto_categorization: true,
        integration_settings: {
          stripe_enabled: true,
          square_enabled: false,
          paypal_enabled: true,
          venmo_enabled: false,
          cashapp_enabled: false,
          nmi_enabled: false,
          paysley_enabled: false,
          bank_sync_enabled: true
        }
      }
    },
    {
      id: '2',
      user_id: 'user-1',
      name: 'Smith Consulting',
      description: 'Professional business consulting services',
      industry: 'Professional Services',
      tax_id: '98-7654321',
      address: '456 Business Ave, New York, NY 10001',
      created_at: '2024-01-05T00:00:00Z',
      updated_at: '2024-01-10T14:20:00Z',
      settings: {
        fiscal_year_end: '12-31',
        currency: 'USD',
        timezone: 'America/New_York',
        auto_categorization: true,
        integration_settings: {
          stripe_enabled: true,
          square_enabled: true,
          paypal_enabled: false,
          venmo_enabled: false,
          cashapp_enabled: false,
          nmi_enabled: false,
          paysley_enabled: false,
          bank_sync_enabled: true
        }
      }
    }
  ]);

  const [newBusiness, setNewBusiness] = useState({
    name: '',
    description: '',
    industry: 'Technology',
    tax_id: '',
    address: ''
  });

  const industries = [
    'Technology',
    'Professional Services',
    'Retail',
    'Manufacturing',
    'Healthcare',
    'Real Estate',
    'Food & Beverage',
    'Education',
    'Non-Profit',
    'Other'
  ];

  const handleCreateBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    
    const business: Business = {
      id: Math.random().toString(36).substr(2, 9),
      user_id: user?.id || '',
      name: newBusiness.name,
      description: newBusiness.description,
      industry: newBusiness.industry,
      tax_id: newBusiness.tax_id,
      address: newBusiness.address,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      settings: {
        fiscal_year_end: '12-31',
        currency: 'USD',
        timezone: 'America/Los_Angeles',
        auto_categorization: true,
        integration_settings: {
          stripe_enabled: false,
          square_enabled: false,
          paypal_enabled: false,
          venmo_enabled: false,
          cashapp_enabled: false,
          nmi_enabled: false,
          paysley_enabled: false,
          bank_sync_enabled: false
        }
      }
    };

    setBusinesses([...businesses, business]);
    setNewBusiness({ name: '', description: '', industry: 'Technology', tax_id: '', address: '' });
    setShowCreateForm(false);
    alert(`Business "${business.name}" created successfully!`);
  };

  const handleEditBusiness = (business: Business) => {
    setEditingBusiness(business);
    setNewBusiness({
      name: business.name,
      description: business.description || '',
      industry: business.industry,
      tax_id: business.tax_id || '',
      address: business.address || ''
    });
  };

  const handleUpdateBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingBusiness) {
      const updatedBusinesses = businesses.map(b => 
        b.id === editingBusiness.id 
          ? {
              ...b,
              name: newBusiness.name,
              description: newBusiness.description,
              industry: newBusiness.industry,
              tax_id: newBusiness.tax_id,
              address: newBusiness.address,
              updated_at: new Date().toISOString()
            }
          : b
      );
      
      setBusinesses(updatedBusinesses);
      setEditingBusiness(null);
      setNewBusiness({ name: '', description: '', industry: 'Technology', tax_id: '', address: '' });
      alert(`Business "${newBusiness.name}" updated successfully!`);
    }
  };

  const handleDeleteBusiness = (business: Business) => {
    if (confirm(`Are you sure you want to delete ${business.name}?`)) {
      setBusinesses(businesses.filter(b => b.id !== business.id));
      alert(`${business.name} deleted successfully!`);
    }
  };

  const canCreateBusiness = () => {
    if (user?.account_type === 'super_free') return true;
    if (user?.account_type === 'free') return businesses.length < 1;
    
    // Check plan limits for paid accounts
    const planLimits = {
      starter: 1,
      'starter-2k': 1,
      'starter-5k': 1,
      growth: 3,
      professional: 5,
      enterprise: Infinity
    };
    
    return businesses.length < (planLimits['professional'] || 5);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Business Management</h2>
          <p className="text-slate-600">Manage your business entities and settings</p>
        </div>
        
        {canCreateBusiness() && (
          <button 
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Business</span>
          </button>
        )}
      </div>

      {/* Account Limits Info */}
      {user?.account_type === 'free' && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-amber-800">
            <strong>Free Account:</strong> You can create up to 1 business. 
            <button className="text-blue-600 hover:text-blue-700 ml-1 underline">
              Upgrade your plan
            </button> to add more businesses.
          </p>
        </div>
      )}

      {/* Create/Edit Business Form */}
      {(showCreateForm || editingBusiness) && (
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">
            {editingBusiness ? 'Edit Business' : 'Create New Business'}
          </h3>
          
          <form onSubmit={editingBusiness ? handleUpdateBusiness : handleCreateBusiness} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Business Name</label>
                <input
                  type="text"
                  value={newBusiness.name}
                  onChange={(e) => setNewBusiness({ ...newBusiness, name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter business name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Industry</label>
                <select
                  value={newBusiness.industry}
                  onChange={(e) => setNewBusiness({ ...newBusiness, industry: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
              <textarea
                value={newBusiness.description}
                onChange={(e) => setNewBusiness({ ...newBusiness, description: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Brief description of your business"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tax ID (Optional)</label>
                <input
                  type="text"
                  value={newBusiness.tax_id}
                  onChange={(e) => setNewBusiness({ ...newBusiness, tax_id: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="XX-XXXXXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Address (Optional)</label>
                <input
                  type="text"
                  value={newBusiness.address}
                  onChange={(e) => setNewBusiness({ ...newBusiness, address: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Business address"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                {editingBusiness ? 'Update Business' : 'Create Business'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingBusiness(null);
                  setNewBusiness({ name: '', description: '', industry: 'Technology', tax_id: '', address: '' });
                }}
                className="px-6 py-3 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Businesses List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {businesses.map((business) => (
          <div key={business.id} className="bg-white rounded-xl p-6 border border-slate-200 hover:border-slate-300 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-50 text-blue-700 rounded-lg">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">{business.name}</h3>
                  <p className="text-sm text-slate-600">{business.industry}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEditBusiness(business)}
                  className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit business"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteBusiness(business)}
                  className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete business"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {business.description && (
              <p className="text-slate-600 mb-4">{business.description}</p>
            )}

            <div className="space-y-2 mb-4">
              {business.address && (
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <MapPin className="h-4 w-4" />
                  <span>{business.address}</span>
                </div>
              )}
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <Calendar className="h-4 w-4" />
                <span>Created {new Date(business.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => onBusinessSelect(business.id)}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Select Business
              </button>
              <button
                onClick={() => alert(`Viewing details for ${business.name}`)}
                className="px-4 py-2 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {businesses.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-800 mb-2">No Businesses Yet</h3>
          <p className="text-slate-600 mb-6">Create your first business to get started with AccuFlow</p>
          {canCreateBusiness() && (
            <button 
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Create Your First Business
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BusinessManager;