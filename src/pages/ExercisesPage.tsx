import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Play, BookOpen, Search } from 'lucide-react';
import { EXERCISES, VTU_MODULES } from '../lib/constants';
import './ExercisesPage.css';

export default function ExercisesPage() {
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const filtered = EXERCISES.filter(ex => {
    if (selectedModule && ex.module !== selectedModule) return false;
    if (search && !ex.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="exercises-page">
      <div className="exercises-header">
        <div className="exercises-header-left">
          <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={16} /> Back
          </button>
          <h1><BookOpen size={24} /> VTU CAED Exercises</h1>
        </div>
        <div className="exercises-search">
          <Search size={16} />
          <input placeholder="Search exercises..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="exercises-body">
        <aside className="modules-sidebar">
          <h3>Modules</h3>
          <button className={`module-filter ${!selectedModule ? 'active' : ''}`} onClick={() => setSelectedModule(null)}>
            All Modules
          </button>
          {VTU_MODULES.map(m => (
            <button key={m.number} className={`module-filter ${selectedModule === m.number ? 'active' : ''}`} onClick={() => setSelectedModule(m.number)}>
              <span className="mf-icon">{m.icon}</span>
              <span className="mf-label">M{m.number}: {m.title}</span>
            </button>
          ))}
        </aside>

        <main className="exercises-grid">
          {filtered.length === 0 ? (
            <div className="exercises-empty">
              <p>No exercises found</p>
            </div>
          ) : (
            filtered.map((ex, i) => (
              <motion.div key={ex.id} className="exercise-card glass" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <div className="exercise-top">
                  <span className="exercise-module">Module {ex.module}</span>
                  <div className="exercise-difficulty">
                    {Array.from({ length: 5 }, (_, j) => (
                      <Star key={j} size={12} fill={j < ex.difficulty ? '#FFD600' : 'transparent'} color={j < ex.difficulty ? '#FFD600' : '#4A4A5A'} />
                    ))}
                  </div>
                </div>
                <h3>{ex.title}</h3>
                <p>{ex.description}</p>
                <button className="btn btn-primary btn-sm" onClick={() => navigate('/workbench')}>
                  <Play size={14} /> Start Exercise
                </button>
              </motion.div>
            ))
          )}
        </main>
      </div>
    </div>
  );
}
