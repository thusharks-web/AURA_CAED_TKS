import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, BookOpen, Building, Hash, ArrowLeft } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import './AuthPage.css';

export default function AuthPage() {
  const navigate = useNavigate();
  const { signIn, signUp, signInWithGoogle, isLoading, error, setError } = useUserStore();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [formData, setFormData] = useState({
    email: '', password: '', full_name: '', vtu_usn: '', college_name: '', branch: '', semester: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (mode === 'signin') {
        await signIn(formData.email, formData.password);
      } else {
        await signUp(formData.email, formData.password, {
          full_name: formData.full_name,
          vtu_usn: formData.vtu_usn,
          college_name: formData.college_name,
          branch: formData.branch,
          semester: formData.semester,
        });
      }
      navigate('/dashboard');
    } catch { /* error is set in store */ }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-glow" />
        <div className="auth-grid" />
      </div>
      <button className="btn btn-ghost back-btn" onClick={() => navigate('/')}>
        <ArrowLeft size={16} /> Back
      </button>
      <motion.div className="auth-card glass" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="auth-header">
          <div className="logo-icon">✦</div>
          <h1>Aura <span className="logo-highlight">CAED</span></h1>
          <p>{mode === 'signin' ? 'Welcome back! Sign in to continue.' : 'Create your account to get started.'}</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'signup' && (
            <>
              <div className="input-group">
                <User size={16} />
                <input name="full_name" placeholder="Full Name" value={formData.full_name} onChange={handleChange} required />
              </div>
              <div className="input-row">
                <div className="input-group">
                  <Hash size={16} />
                  <input name="vtu_usn" placeholder="VTU USN" value={formData.vtu_usn} onChange={handleChange} />
                </div>
                <div className="input-group">
                  <Building size={16} />
                  <input name="college_name" placeholder="College" value={formData.college_name} onChange={handleChange} />
                </div>
              </div>
              <div className="input-row">
                <div className="input-group">
                  <BookOpen size={16} />
                  <select name="branch" value={formData.branch} onChange={handleChange}>
                    <option value="">Branch</option>
                    <option value="CS">Computer Science</option>
                    <option value="ME">Mechanical</option>
                    <option value="CE">Civil</option>
                    <option value="EE">Electrical</option>
                    <option value="EC">Electronics</option>
                  </select>
                </div>
                <div className="input-group">
                  <BookOpen size={16} />
                  <select name="semester" value={formData.semester} onChange={handleChange}>
                    {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}
                  </select>
                </div>
              </div>
            </>
          )}

          <div className="input-group">
            <Mail size={16} />
            <input name="email" type="email" placeholder="Email address" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <Lock size={16} />
            <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required minLength={6} />
          </div>

          <button className="btn btn-primary btn-lg auth-submit" type="submit" disabled={isLoading}>
            {isLoading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="auth-divider"><span>or</span></div>

        <button className="btn btn-secondary btn-lg google-btn" onClick={signInWithGoogle}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>

        <p className="auth-switch">
          {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <button className="link-btn" onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); }}>
            {mode === 'signin' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
