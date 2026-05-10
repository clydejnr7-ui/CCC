export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string; email: string; full_name: string | null;
          role: 'user' | 'admin'; created_at: string; updated_at: string;
        };
        Insert: {
          id: string; email: string; full_name?: string | null;
          role?: 'user' | 'admin'; created_at?: string; updated_at?: string;
        };
        Update: {
          id?: string; email?: string; full_name?: string | null;
          role?: 'user' | 'admin'; updated_at?: string;
        };
      };
      account_submissions: {
        Row: {
          id: string; user_id: string; prop_firm: string; account_size: string;
          challenge_phase: string; trading_platform: string; login_id: string;
          password: string; server: string; investor_password: string | null;
          notes: string | null;
          status: 'pending' | 'in_progress' | 'passed' | 'failed' | 'payment_pending' | 'paid';
          admin_notes: string | null; price_usd: number | null;
          payment_id: string | null; payment_status: string | null;
          created_at: string; updated_at: string;
        };
        Insert: {
          id?: string; user_id: string; prop_firm: string; account_size: string;
          challenge_phase: string; trading_platform: string; login_id: string;
          password: string; server: string; investor_password?: string | null;
          notes?: string | null;
          status?: 'pending' | 'in_progress' | 'passed' | 'failed' | 'payment_pending' | 'paid';
          admin_notes?: string | null; price_usd?: number | null;
          payment_id?: string | null; payment_status?: string | null;
          created_at?: string; updated_at?: string;
        };
        Update: {
          prop_firm?: string; account_size?: string; challenge_phase?: string;
          trading_platform?: string; login_id?: string; password?: string;
          server?: string; investor_password?: string | null; notes?: string | null;
          status?: 'pending' | 'in_progress' | 'passed' | 'failed' | 'payment_pending' | 'paid';
          admin_notes?: string | null; price_usd?: number | null;
          payment_id?: string | null; payment_status?: string | null; updated_at?: string;
        };
      };
    };
    Views: {}; Functions: {}; Enums: {};
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type AccountSubmission = Database['public']['Tables']['account_submissions']['Row'];
