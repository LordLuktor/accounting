export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  first_name: string;
  last_name: string;
  created_at: string;
  subscription_status: 'active' | 'inactive' | 'trial' | 'free';
  account_type: 'paid' | 'free' | 'invited' | 'super_free';
  invited_by?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export interface Invitation {
  id: string;
  email: string;
  invited_by: string;
  invited_by_name: string;
  status: 'pending' | 'accepted' | 'expired';
  created_at: string;
  expires_at: string;
  used_at?: string;
}