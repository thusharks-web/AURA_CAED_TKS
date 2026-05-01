import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Pencil, Layers, Download, BookOpen, Zap, Shield, ChevronRight, Star, Monitor, Users, GraduationCap } from 'lucide-react';
import './LandingPage.css';

const features = [
  { icon: <Pencil size={24} />, title: 'SolidWorks-Style Tools', desc: 'Line, Circle, Arc, Trim, Fillet, Smart Dimension — all 40+ drawing tools replicated with identical behavior.' },
  { icon: <Layers size={24} />, title: 'Layer Management', desc: 'Named layers with visibility, lock, color, and line style controls for organized drawings.' },
  { icon: <Download size={24} />, title: 'Multi-Format Export', desc: 'Export your drawings as PDF, SVG, or PNG. Perfect for submissions and portfolio.' },
  { icon: <BookOpen size={24} />, title: '60+ VTU Exercises', desc: 'Structured exercises covering all 10 CAED modules with step-by-step guided mode.' },
  { icon: <Zap size={24} />, title: 'Snap & Constraints', desc: 'Smart snapping and geometric constraints for precision engineering drawings.' },
  { icon: <Shield size={24} />, title: 'Auto-Save to Cloud', desc: 'Your drawings are automatically saved to Supabase. Never lose your work again.' },
];

const stats = [
  { value: '40+', label: 'Drawing Tools' },
  { value: '10', label: 'VTU Modules' },
  { value: '60+', label: 'Exercises' },
  { value: '0', label: 'Install Required' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handle = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handle);
    return () => window.removeEventListener('scroll', handle);
  }, []);

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className={`landing-nav ${scrollY > 50 ? 'scrolled' : ''}`}>
        <div className="nav-content">
          <div className="nav-logo">
            <div className="logo-icon">✦</div>
            <span className="logo-text">Aura <span className="logo-highlight">CAED</span></span>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#modules">Modules</a>
            <a href="#about">About</a>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/auth')}>Sign In</button>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/auth')}>Get Started</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="grid-pattern" />
          <div className="hero-glow" />
          <div className="hero-glow-2" />
        </div>
        <motion.div className="hero-content" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="hero-badge">
            <Star size={14} /> VTU CAED Lab Practice Platform
          </div>
          <h1 className="hero-title">
            Engineering Drawing,<br />
            <span className="gradient-text">Reimagined for the Browser</span>
          </h1>
          <p className="hero-subtitle">
            Practice all VTU CAED lab exercises with SolidWorks-style tools — right in your browser. 
            No installation. No license. Just draw.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/auth')}>
              Start Drawing Free <ChevronRight size={18} />
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => navigate('/workbench')}>
              <Monitor size={18} /> Try Workbench
            </button>
          </div>
          <div className="hero-stats">
            {stats.map((s, i) => (
              <motion.div key={i} className="stat-item" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        <motion.div className="hero-preview" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.8 }}>
          <div className="preview-window">
            <div className="preview-titlebar">
              <div className="preview-dots"><span /><span /><span /></div>
              <span className="preview-title">Aura CAED — Workbench</span>
            </div>
            <div className="preview-canvas">
              <svg viewBox="0 0 800 500" className="preview-svg">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(108,99,255,0.1)" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="800" height="500" fill="#1E1E2E"/>
                <rect width="800" height="500" fill="url(#grid)"/>
                {/* Demo drawing entities */}
                <line x1="200" y1="350" x2="600" y2="350" stroke="#fff" strokeWidth="1.5"/>
                <line x1="200" y1="350" x2="200" y2="150" stroke="#fff" strokeWidth="1.5"/>
                <line x1="200" y1="150" x2="400" y2="80" stroke="#fff" strokeWidth="1.5"/>
                <line x1="400" y1="80" x2="600" y2="150" stroke="#fff" strokeWidth="1.5"/>
                <line x1="600" y1="150" x2="600" y2="350" stroke="#fff" strokeWidth="1.5"/>
                <circle cx="400" cy="250" r="60" fill="none" stroke="#4FC3F7" strokeWidth="1" strokeDasharray="5,5"/>
                <line x1="340" y1="250" x2="460" y2="250" stroke="#4FC3F7" strokeWidth="0.5" strokeDasharray="3,3"/>
                <line x1="400" y1="190" x2="400" y2="310" stroke="#4FC3F7" strokeWidth="0.5" strokeDasharray="3,3"/>
                {/* Dimension line */}
                <line x1="200" y1="380" x2="600" y2="380" stroke="#FFD600" strokeWidth="0.8"/>
                <text x="400" y="395" fill="#FFD600" fontSize="12" textAnchor="middle" fontFamily="Inter">400.00</text>
                <line x1="200" y1="375" x2="200" y2="385" stroke="#FFD600" strokeWidth="0.8"/>
                <line x1="600" y1="375" x2="600" y2="385" stroke="#FFD600" strokeWidth="0.8"/>
                {/* Snap indicators */}
                <circle cx="200" cy="350" r="4" fill="none" stroke="#00E676" strokeWidth="1.5"/>
                <circle cx="600" cy="350" r="4" fill="none" stroke="#00E676" strokeWidth="1.5"/>
              </svg>
              <div className="preview-toolbar">
                <span className="tool-item active">▸ Line</span>
                <span className="tool-item">○ Circle</span>
                <span className="tool-item">◠ Arc</span>
                <span className="tool-item">▭ Rect</span>
                <span className="tool-item">◇ Dim</span>
              </div>
              <div className="preview-statusbar">
                X: 400.00 &nbsp;|&nbsp; Y: 250.00 &nbsp;|&nbsp; Grid: ON &nbsp;|&nbsp; Snap: ON
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="features-section">
        <div className="section-content">
          <motion.div className="section-header" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <span className="section-badge">Features</span>
            <h2>Everything You Need for CAED</h2>
            <p>Built specifically for VTU engineering students with SolidWorks-level precision</p>
          </motion.div>
          <div className="features-grid">
            {features.map((f, i) => (
              <motion.div key={i} className="feature-card glass" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="modules-section">
        <div className="section-content">
          <motion.div className="section-header" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <span className="section-badge">Curriculum</span>
            <h2>All 10 VTU CAED Modules</h2>
            <p>Complete coverage of VTU CAED (18CIV14/24) lab syllabus</p>
          </motion.div>
          <div className="modules-grid">
            {[
              { n: 1, t: 'Engineering Drawing Basics', icon: '📐' },
              { n: 2, t: 'Curves & Conic Sections', icon: '〰️' },
              { n: 3, t: 'Projection of Points & Lines', icon: '📍' },
              { n: 4, t: 'Projection of Planes', icon: '🔷' },
              { n: 5, t: 'Projection of Solids', icon: '🧊' },
              { n: 6, t: 'Section of Solids', icon: '🔪' },
              { n: 7, t: 'Development of Surfaces', icon: '📦' },
              { n: 8, t: 'Isometric Projections', icon: '🔲' },
              { n: 9, t: 'Orthographic Projections', icon: '📊' },
              { n: 10, t: 'Dimensioning & Annotation', icon: '📏' },
            ].map((m, i) => (
              <motion.div key={i} className="module-card" initial={{ opacity: 0, x: i % 2 ? 20 : -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }}>
                <span className="module-icon">{m.icon}</span>
                <div>
                  <span className="module-number">Module {m.n}</span>
                  <h4>{m.t}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About / CTA */}
      <section id="about" className="cta-section">
        <div className="section-content">
          <motion.div className="cta-card glass" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <div className="cta-content">
              <GraduationCap size={48} className="cta-icon" />
              <h2>Built by a VTU Student,<br />for VTU Students</h2>
              <p>Created by <strong>Thushar K S</strong> — Computer Science & Engineering, BMSIT&M, Bengaluru (Batch 2026). Aura CAED eliminates software licensing barriers and gives every engineering student access to professional CAD drawing tools.</p>
              <div className="cta-actions">
                <button className="btn btn-primary btn-lg" onClick={() => navigate('/auth')}>
                  <Users size={18} /> Join Now — It's Free
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="nav-logo">
              <div className="logo-icon">✦</div>
              <span className="logo-text">Aura <span className="logo-highlight">CAED</span></span>
            </div>
            <p>Empowering VTU Students to Master Engineering Drawing</p>
          </div>
          <div className="footer-links">
            <div><h5>Product</h5><a href="#features">Features</a><a href="#modules">Modules</a><a href="/workbench">Workbench</a></div>
            <div><h5>Resources</h5><a href="/exercises">Exercises</a><a href="/dashboard">Dashboard</a></div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 Aura CAED — Thushar K S, BMSIT&M. Powered by React + Vite + Supabase.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
