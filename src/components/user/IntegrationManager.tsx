import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Link, 
  CheckCircle, 
  AlertCircle, 
  Settings, 
  RefreshCw, 
  Plus,
  CreditCard,
  DollarSign,
  Smartphone,
  Building2,
  Zap,
  Globe
} from 'lucide-react';
import { popupAuthService } from '../../services/popupAuthService';

interface IntegrationManagerProps {
  businessId: string | null;
}

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  status: 'connected' | 'disconnected' | 'pending';
  lastSync?: string;
  transactionCount?: number;
  category: 'payment' | 'banking' | 'other';
  requiresAuth?: boolean;
  apiKeyRequired?: boolean;
}

const IntegrationManager: React.FC<IntegrationManagerProps> = ({ businessId }) => {
  const { user } = useAuth();
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Accept online payments and manage subscriptions',
      icon: CreditCard,
      status: 'connected',
      lastSync: '2024-01-15T10:30:00Z',
      transactionCount: 1247,
      category: 'payment',
      apiKeyRequired: true
    },
    {
      id: 'square',
      name: 'Square',
      description: 'Point of sale and online payment processing',
      icon: Building2,
      status: 'disconnected',
      category: 'payment',
      apiKeyRequired: true
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Global digital payment platform',
      icon: DollarSign,
      status: 'disconnected',
      category: 'payment',
      requiresAuth: true
    },
    {
      id: 'venmo',
      name: 'Venmo',
      description: 'Mobile payment service',
      icon: Smartphone,
      status: 'pending',
      category: 'payment',
      requiresAuth: true
    },
    {
      id: 'cashapp',
      name: 'Cash App',
      description: 'Mobile payment and banking app',
      icon: DollarSign,
      status: 'disconnected',
      category: 'payment',
      requiresAuth: true
    },
    {
      id: 'nmi',
      name: 'NMI',
      description: 'Network Merchants payment gateway',
      icon: Globe,
      status: 'disconnected',
      category: 'payment',
      apiKeyRequired: true
    },
    {
      id: 'paysley',
      name: 'Paysley',
      description: 'Modern payment processing platform',
      icon: Zap,
      status: 'disconnected',
      category: 'payment',
      requiresAuth: true
    }
  ]);

  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [syncingAll, setSyncingAll] = useState(false);
  const [syncingIntegration, setSyncingIntegration] = useState<string | null>(null);
  
  const [connectionForm, setConnectionForm] = useState({
    apiKey: '',
    secretKey: '',
    environment: 'production' as 'sandbox' | 'production'
  });

  const [settingsForm, setSettingsForm] = useState({
    webhookUrl: '',
    syncFrequency: 'hourly' as 'realtime' | 'hourly' | 'daily',
    autoSync: true
  });

  if (!businessId) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <Link className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">No Business Selected</h2>
          <p className="text-slate-600">Please select a business to manage its integrations</p>
        </div>
      </div>
    );
  }

  const handleConnect = (integration: Integration) => {
    if (integration.requiresAuth) {
      handlePopupAuth(integration);
    } else {
      setSelectedIntegration(integration);
      setShowConnectionModal(true);
    }
  };

  const handlePopupAuth = async (integration: Integration) => {
    try {
      let result;
      
      if (integration.id === 'paypal') {
        result = await popupAuthService.authenticatePayPal();
      } else if (integration.id === 'paysley') {
        result = await popupAuthService.authenticatePaysley();
      } else {
        // For other services, simulate popup auth
        result = await popupAuthService.authenticateWithPopup({
          url: `https://auth.${integration.id}.com/oauth/authorize?client_id=demo`,
          width: 500,
          height: 600,
          title: `${integration.name} Authentication`
        });
      }

      if (result.success) {
        // Update integration status
        setIntegrations(prev => prev.map(int => 
          int.id === integration.id 
            ? { ...int, status: 'connected', lastSync: new Date().toISOString(), transactionCount: 0 }
            : int
        ));

        // Setup webhooks automatically
        if (result.accessToken) {
          const webhookData = await popupAuthService.setupWebhooks(integration.id, result.accessToken);
          alert(`${integration.name} connected successfully! Webhooks configured automatically.`);
        }
      } else {
        alert(`Failed to connect ${integration.name}: ${result.error}`);
      }
    } catch (error) {
      alert(`Error connecting ${integration.name}: ${error}`);
    }
  };

  const handleApiKeyConnect = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedIntegration) {
      setIntegrations(prev => prev.map(int => 
        int.id === selectedIntegration.id 
          ? { ...int, status: 'connected', lastSync: new Date().toISOString(), transactionCount: 0 }
          : int
      ));
      
      setShowConnectionModal(false);
      setConnectionForm({ apiKey: '', secretKey: '', environment: 'production' });
      alert(`${selectedIntegration.name} connected successfully!`);
    }
  };

  const handleSync = async (integrationId: string) => {
    setSyncingIntegration(integrationId);
    
    // Simulate sync process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIntegrations(prev => prev.map(int => 
      int.id === integrationId 
        ? { 
            ...int, 
            lastSync: new Date().toISOString(),
            transactionCount: (int.transactionCount || 0) + Math.floor(Math.random() * 10) + 1
          }
        : int
    ));
    
    setSyncingIntegration(null);
    
    const integration = integrations.find(int => int.id === integrationId);
    alert(`${integration?.name} synced successfully! Found new transactions.`);
  };

  const handleSyncAll = async () => {
    setSyncingAll(true);
    
    const connectedIntegrations = integrations.filter(int => int.status === 'connected');
    
    for (const integration of connectedIntegrations) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIntegrations(prev => prev.map(int => 
        int.id === integration.id 
          ? { 
              ...int, 
              lastSync: new Date().toISOString(),
              transactionCount: (int.transactionCount || 0) + Math.floor(Math.random() * 5) + 1
            }
          : int
      ));
    }
    
    setSyncingAll(false);
    alert(`All integrations synced successfully! Found ${connectedIntegrations.length * 3} new transactions.`);
  };

  const handleSettings = (integration: Integration) => {
    setSelectedIntegration(integration);
    setSettingsForm({
      webhookUrl: `https://api.accuflow.com/webhooks/${integration.id}`,
      syncFrequency: 'hourly',
      autoSync: true
    });
    setShowSettingsModal(true);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSettingsModal(false);
    alert(`Settings saved for ${selectedIntegration?.name}!`);
  };

  const handleDisconnect = (integration: Integration) => {
    if (confirm(`Are you sure you want to disconnect ${integration.name}?`)) {
      setIntegrations(prev => prev.map(int => 
        int.id === integration.id 
          ? { ...int, status: 'disconnected', lastSync: undefined, transactionCount: undefined }
          : int
      ));
      alert(`${integration.name} disconnected successfully!`);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const connectedCount = integrations.filter(int => int.status === 'connected').length;
  const totalTransactions = integrations.reduce((sum, int) => sum + (int.transactionCount || 0), 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Integrations</h2>
          <p className="text-slate-600">Connect your payment platforms and banking services</p>
        </div>
        
        <button 
          onClick={handleSyncAll}
          disabled={syncingAll || connectedCount === 0}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {syncingAll ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              <span>Syncing All...</span>
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              <span>Sync All</span>
            </>
          )}
        </button>
      </div>

      {/* Integration Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 text-blue-700 rounded-lg">
              <Link className="h-6 w-6" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800 mb-1">{connectedCount}</h3>
            <p className="text-sm text-slate-600">Connected Integrations</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 text-green-700 rounded-lg">
              <RefreshCw className="h-6 w-6" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800 mb-1">{totalTransactions}</h3>
            <p className="text-sm text-slate-600">Total Transactions Synced</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 text-purple-700 rounded-lg">
              <Zap className="h-6 w-6" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800 mb-1">
              {integrations.filter(int => int.lastSync).length}
            </h3>
            <p className="text-sm text-slate-600">Active Syncs Today</p>
          </div>
        </div>
      </div>

      {/* Payment Integrations */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-xl font-semibold text-slate-800 mb-6">Payment Platforms</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.filter(int => int.category === 'payment').map((integration) => {
            const Icon = integration.icon;
            const isConnected = integration.status === 'connected';
            const isPending = integration.status === 'pending';
            const isSyncing = syncingIntegration === integration.id;
            
            return (
              <div key={integration.id} className="border border-slate-200 rounded-xl p-6 hover:border-slate-300 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <Icon className="h-6 w-6 text-slate-700" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">{integration.name}</h4>
                      <p className="text-sm text-slate-600">{integration.description}</p>
                    </div>
                  </div>
                  
                  <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(integration.status)}`}>
                    {getStatusIcon(integration.status)}
                    <span className="capitalize">{integration.status}</span>
                  </div>
                </div>

                {isConnected && integration.lastSync && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-700">Last Sync:</span>
                      <span className="text-green-800 font-medium">
                        {new Date(integration.lastSync).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-green-700">Transactions:</span>
                      <span className="text-green-800 font-medium">{integration.transactionCount}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  {!isConnected ? (
                    <button
                      onClick={() => handleConnect(integration)}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      {isPending ? 'Complete Setup' : 'Connect'}
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleSync(integration.id)}
                        disabled={isSyncing}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        {isSyncing ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                            <span>Syncing...</span>
                          </div>
                        ) : (
                          'Sync Now'
                        )}
                      </button>
                      <button
                        onClick={() => handleSettings(integration)}
                        className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                        title="Settings"
                      >
                        <Settings className="h-4 w-4 text-slate-600" />
                      </button>
                      <button
                        onClick={() => handleDisconnect(integration)}
                        className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        title="Disconnect"
                      >
                        <AlertCircle className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Connection Modal */}
      {showConnectionModal && selectedIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">
              Connect {selectedIntegration.name}
            </h3>
            
            <form onSubmit={handleApiKeyConnect} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">API Key</label>
                <input
                  type="text"
                  value={connectionForm.apiKey}
                  onChange={(e) => setConnectionForm({ ...connectionForm, apiKey: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your API key"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Secret Key</label>
                <input
                  type="password"
                  value={connectionForm.secretKey}
                  onChange={(e) => setConnectionForm({ ...connectionForm, secretKey: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your secret key"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Environment</label>
                <select
                  value={connectionForm.environment}
                  onChange={(e) => setConnectionForm({ ...connectionForm, environment: e.target.value as any })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="sandbox">Sandbox (Testing)</option>
                  <option value="production">Production (Live)</option>
                </select>
              </div>

              <div className="flex items-center space-x-4 pt-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Connect
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowConnectionModal(false);
                    setConnectionForm({ apiKey: '', secretKey: '', environment: 'production' });
                  }}
                  className="px-6 py-3 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && selectedIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">
              {selectedIntegration.name} Settings
            </h3>
            
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Webhook URL</label>
                <input
                  type="url"
                  value={settingsForm.webhookUrl}
                  onChange={(e) => setSettingsForm({ ...settingsForm, webhookUrl: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  readOnly
                />
                <p className="text-xs text-slate-500 mt-1">This URL is automatically configured</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Sync Frequency</label>
                <select
                  value={settingsForm.syncFrequency}
                  onChange={(e) => setSettingsForm({ ...settingsForm, syncFrequency: e.target.value as any })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="realtime">Real-time</option>
                  <option value="hourly">Every Hour</option>
                  <option value="daily">Daily</option>
                </select>
              </div>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settingsForm.autoSync}
                  onChange={(e) => setSettingsForm({ ...settingsForm, autoSync: e.target.checked })}
                  className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="text-slate-700">Enable automatic synchronization</span>
              </label>

              <div className="flex items-center space-x-4 pt-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Save Settings
                </button>
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  className="px-6 py-3 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Integration Help */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Need Help?</h3>
        <p className="text-blue-700 mb-4">
          Our integrations automatically sync your transactions and set up webhooks for real-time updates.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <h4 className="font-semibold mb-2">For API-based integrations:</h4>
            <ul className="space-y-1">
              <li>• Get your API keys from the provider's dashboard</li>
              <li>• Use production keys for live data</li>
              <li>• Webhooks are configured automatically</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">For OAuth integrations:</h4>
            <ul className="space-y-1">
              <li>• Click connect to open secure login popup</li>
              <li>• Authorize AccuFlow in the popup window</li>
              <li>• Integration will be configured automatically</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationManager;