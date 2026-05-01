import { Book, Palette, PlusSquare, Settings } from 'lucide-react';
import { useState } from 'react';
import './TaskPane.css';

export default function TaskPane() {
  const [expandedTab, setExpandedTab] = useState<string | null>(null);

  const toggleTab = (tab: string) => {
    setExpandedTab(expandedTab === tab ? null : tab);
  };

  return (
    <div className="sw-task-pane-container">
      {expandedTab && (
        <div className="sw-task-pane-panel">
          <div className="sw-tp-header">
            <span>{expandedTab}</span>
            <button className="sw-tp-close" onClick={() => setExpandedTab(null)}>X</button>
          </div>
          <div className="sw-tp-content">
            {expandedTab === 'Design Library' && <div className="sw-tp-placeholder">Design Library Content</div>}
            {expandedTab === 'View Palette' && <div className="sw-tp-placeholder">View Palette Content</div>}
            {expandedTab === 'Appearances' && <div className="sw-tp-placeholder">Appearances Content</div>}
            {expandedTab === 'Custom Properties' && <div className="sw-tp-placeholder">Properties Content</div>}
          </div>
        </div>
      )}
      <div className="sw-task-pane-tabs">
        <button className={expandedTab === 'Design Library' ? 'active' : ''} onClick={() => toggleTab('Design Library')} title="Design Library">
          <Book size={18} className="icon-blue" />
        </button>
        <button className={expandedTab === 'View Palette' ? 'active' : ''} onClick={() => toggleTab('View Palette')} title="View Palette">
          <PlusSquare size={18} className="icon-blue" />
        </button>
        <button className={expandedTab === 'Appearances' ? 'active' : ''} onClick={() => toggleTab('Appearances')} title="Appearances, Scenes, and Decals">
          <Palette size={18} className="icon-yellow" />
        </button>
        <button className={expandedTab === 'Custom Properties' ? 'active' : ''} onClick={() => toggleTab('Custom Properties')} title="Custom Properties">
          <Settings size={18} className="icon-yellow" />
        </button>
      </div>
    </div>
  );
}
