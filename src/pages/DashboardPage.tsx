import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, FileText, Clock, Trash2, Download, LogOut, Settings, BookOpen, FolderOpen } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { useDrawingActions } from '../hooks/useDrawingActions';
import './DashboardPage.css';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, signOut } = useUserStore();
  const { listDrawings, deleteDrawing } = useDrawingActions();
  const [drawings, setDrawings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDrawings();
  }, []);

  const loadDrawings = async () => {
    try {
      const data = await listDrawings();
      setDrawings(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this drawing?')) return;
    await deleteDrawing(id);
    setDrawings(drawings.filter(d => d.id !== id));
  };

  return (
    <div className="dashboard-page">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div className="sidebar-top">
          <div className="nav-logo">
            <div className="logo-icon">✦</div>
            <span className="logo-text">Aura <span className="logo-highlight">CAED</span></span>
          </div>
        </div>
        <nav className="sidebar-nav">
          <a className="nav-item active"><FolderOpen size={18} /> My Drawings</a>
          <a className="nav-item" onClick={() => navigate('/exercises')}><BookOpen size={18} /> Exercises</a>
          <a className="nav-item"><Settings size={18} /> Settings</a>
        </nav>
        <div className="sidebar-bottom">
          <div className="user-info">
            <div className="user-avatar">{user?.full_name?.[0] || user?.email?.[0] || 'U'}</div>
            <div>
              <div className="user-name">{user?.full_name || 'User'}</div>
              <div className="user-email">{user?.email || ''}</div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => { signOut(); navigate('/'); }}>
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="dash-main">
        <div className="dash-header">
          <div>
            <h1>My Drawings</h1>
            <p>Create and manage your engineering drawings</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/workbench')}>
            <Plus size={18} /> New Drawing
          </button>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p>Loading your drawings...</p>
          </div>
        ) : drawings.length === 0 ? (
          <motion.div className="empty-state" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="empty-icon">📐</div>
            <h3>No drawings yet</h3>
            <p>Start creating your first engineering drawing!</p>
            <button className="btn btn-primary" onClick={() => navigate('/workbench')}>
              <Plus size={18} /> Create Drawing
            </button>
          </motion.div>
        ) : (
          <div className="drawings-grid">
            {drawings.map((d, i) => (
              <motion.div key={d.id} className="drawing-card glass" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} onClick={() => navigate(`/workbench?id=${d.id}`)}>
                <div className="drawing-preview">
                  <FileText size={40} />
                </div>
                <div className="drawing-info">
                  <h4>{d.title || 'Untitled'}</h4>
                  <div className="drawing-meta">
                    <span><Clock size={12} /> {new Date(d.updated_at || d.created_at).toLocaleDateString()}</span>
                    <span className="badge badge-accent">{d.sheet_size || 'A4'}</span>
                  </div>
                </div>
                <div className="drawing-actions">
                  <button className="btn btn-icon btn-ghost" onClick={(e) => { e.stopPropagation(); handleDelete(d.id); }}>
                    <Trash2 size={14} />
                  </button>
                  <button className="btn btn-icon btn-ghost">
                    <Download size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
