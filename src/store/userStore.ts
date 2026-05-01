import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  full_name: string;
  vtu_usn: string;
  college_name: string;
  branch: string;
  semester: number;
  role: 'student' | 'instructor' | 'admin';
}

interface UserStore {
  user: User | null;
  session: any;
  isLoading: boolean;
  error: string | null;
  
  initialize: () => Promise<void>;
  signUp: (email: string, password: string, profile: Partial<User>) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  setError: (error: string | null) => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  session: null,
  isLoading: true,
  error: null,

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        set({ 
          session, 
          user: profile || {
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || '',
            vtu_usn: '',
            college_name: '',
            branch: '',
            semester: 1,
            role: 'student' as const,
          },
          isLoading: false 
        });
      } else {
        set({ isLoading: false });
      }

      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          set({ 
            session, 
            user: profile || {
              id: session.user.id,
              email: session.user.email || '',
              full_name: session.user.user_metadata?.full_name || '',
              vtu_usn: '',
              college_name: '',
              branch: '',
              semester: 1,
              role: 'student' as const,
            }
          });
        } else if (event === 'SIGNED_OUT') {
          set({ session: null, user: null });
        }
      });
    } catch {
      set({ isLoading: false, error: 'Failed to initialize auth' });
    }
  },

  signUp: async (email, password, profile) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      
      if (data.user) {
        const { error: profileError } = await supabase.from('users').upsert({
          id: data.user.id,
          email,
          full_name: profile.full_name || '',
          vtu_usn: profile.vtu_usn || '',
          college_name: profile.college_name || '',
          branch: profile.branch || '',
          semester: profile.semester || 1,
          role: 'student',
        });
        if (profileError) console.error('Profile error:', profileError);
      }
      set({ isLoading: false });
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },

  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      set({ isLoading: false });
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },

  signInWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      if (error) throw error;
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },

  updateProfile: async (updates) => {
    const user = get().user;
    if (!user) return;
    try {
      const { error } = await supabase.from('users').update(updates).eq('id', user.id);
      if (error) throw error;
      set({ user: { ...user, ...updates } as User });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  setError: (error) => set({ error }),
}));
