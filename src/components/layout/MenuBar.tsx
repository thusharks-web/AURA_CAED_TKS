import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { useDrawingActions } from '../../hooks/useDrawingActions';
import './MenuBar.css';

export default function MenuBar() {
  const navigate = useNavigate();
  const user = useUserStore((s) => s.user);
  const { saveDrawing } = useDrawingActions();

  return (
    <div className="sw-menubar">
      <div className="sw-menubar-logo" onClick={() => navigate(user ? '/dashboard' : '/')}>
        <span className="sw-icon">DS</span> SOLIDWORKS
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
