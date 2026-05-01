import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { useDrawingActions } from '../../hooks/useDrawingActions';
import { Home, FilePlus, FolderOpen, Save, Printer, Undo2, Redo2, Settings } from 'lucide-react';
import './MenuBar.css';

export default function MenuBar() {
  const navigate = useNavigate();
  const user = useUserStore((s) => s.user);
  const { saveDrawing } = useDrawingActions();

  return (
    <div className="sw-menubar">
      <div className="sw-menubar-logo" onClick={() => navigate(user ? '/dashboard' : '/')}>
        <div className="sw-red-square">DS</div>
        SOLIDWORKS
      </div>
      <div className="sw-quick-access">
        <button onClick={() => navigate(user ? '/dashboard' : '/')}><Home size={14}/></button>
        <button><FilePlus size={14}/></button>
        <button><FolderOpen size={14}/></button>
        <button onClick={() => saveDrawing()}><Save size={14}/></button>
        <button><Printer size={14}/></button>
        <div className="sw-qa-divider" />
        <button><Undo2 size={14}/></button>
        <button><Redo2 size={14}/></button>
        <div className="sw-qa-divider" />
        <button><Settings size={14}/></button>
      </div>
      <div className="sw-menus">
        <div className="sw-menu-item">File
          <div className="sw-dropdown">
            <button onClick={() => navigate('/dashboard')}>New...</button>
            <button>Open...</button>
            <div className="sw-divider" />
            <button onClick={() => saveDrawing()}>Save</button>
            <button>Save As...</button>
          </div>
        </div>
        <div className="sw-menu-item">Edit</div>
        <div className="sw-menu-item">View</div>
        <div className="sw-menu-item">Insert</div>
        <div className="sw-menu-item">Tools</div>
        <div className="sw-menu-item">Window</div>
        <div className="sw-menu-item">Help</div>
      </div>
      <div className="sw-menubar-right">
        <div className="sw-search">
          <input type="text" placeholder="Search Commands" />
          <span className="sw-search-icon">🔍</span>
        </div>
        <button className="sw-login-btn">?</button>
        <button className="sw-login-btn">_</button>
        <button className="sw-login-btn">□</button>
        <button className="sw-login-btn sw-close">X</button>
      </div>
    </div>
  );
}
