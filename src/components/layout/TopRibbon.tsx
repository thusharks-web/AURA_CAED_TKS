import { useCanvasStore } from '../../store/canvasStore';
import { useDrawingActions } from '../../hooks/useDrawingActions';
import { useUserStore } from '../../store/userStore';
import {
  Save, FileText, Undo2, Redo2, ZoomIn, ZoomOut,
  Grid3X3, Magnet, Trash2, Image, FileCode, Home
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './TopRibbon.css';

export default function TopRibbon() {
  const navigate = useNavigate();
  const user = useUserStore(s => s.user);
  const {
    drawingTitle, setDrawingTitle, undo, redo,
    zoom, setZoom, gridEnabled, toggleGrid,
    snapEnabled, toggleSnap, clearCanvas,
    sheetSize, setSheetSize, projection, setProjection,
    undoStack, redoStack,
  } = useCanvasStore();
  const { saveDrawing, exportToPDF, exportToPNG, exportToSVG } = useDrawingActions();

  const handleSave = async () => {
    try {
      await saveDrawing();
      toast.success('Drawing saved!');
    } catch {
      toast.error('Save failed — sign in to save.');
    }
  };

  return (
    <div className="top-ribbon">
      <div className="ribbon-left">
        <button className="btn btn-ghost btn-icon" onClick={() => navigate(user ? '/dashboard' : '/')} title="Home">
          <Home size={16} />
        </button>
        <div className="ribbon-divider" />
        <input
          className="title-input"
          value={drawingTitle}
          onChange={(e) => setDrawingTitle(e.target.value)}
          placeholder="Drawing Title"
        />
      </div>

      <div className="ribbon-center">
        <div className="ribbon-group">
          <button className="ribbon-btn" onClick={undo} disabled={undoStack.length === 0} title="Undo (Ctrl+Z)">
            <Undo2 size={16} />
          </button>
          <button className="ribbon-btn" onClick={redo} disabled={redoStack.length === 0} title="Redo (Ctrl+Y)">
            <Redo2 size={16} />
          </button>
        </div>
        <div className="ribbon-divider" />
        <div className="ribbon-group">
          <button className="ribbon-btn" onClick={() => setZoom(zoom * 1.2)} title="Zoom In">
            <ZoomIn size={16} />
          </button>
          <span className="zoom-value">{(zoom * 100).toFixed(0)}%</span>
          <button className="ribbon-btn" onClick={() => setZoom(zoom / 1.2)} title="Zoom Out">
            <ZoomOut size={16} />
          </button>
        </div>
        <div className="ribbon-divider" />
        <div className="ribbon-group">
          <button className={`ribbon-btn ${gridEnabled ? 'active' : ''}`} onClick={toggleGrid} title="Grid (G)">
            <Grid3X3 size={16} />
          </button>
          <button className={`ribbon-btn ${snapEnabled ? 'active' : ''}`} onClick={toggleSnap} title="Snap (Shift+S)">
            <Magnet size={16} />
          </button>
        </div>
        <div className="ribbon-divider" />
        <div className="ribbon-group">
          <select className="ribbon-select" value={sheetSize} onChange={(e) => setSheetSize(e.target.value as any)}>
            <option value="A0">A0</option><option value="A1">A1</option>
            <option value="A2">A2</option><option value="A3">A3</option>
            <option value="A4">A4</option>
          </select>
          <select className="ribbon-select" value={projection} onChange={(e) => setProjection(e.target.value as any)}>
            <option value="first_angle">1st Angle</option>
            <option value="third_angle">3rd Angle</option>
          </select>
        </div>
      </div>

      <div className="ribbon-right">
        <button className="ribbon-btn" onClick={clearCanvas} title="Clear Canvas">
          <Trash2 size={16} />
        </button>
        <div className="ribbon-divider" />
        <button className="ribbon-btn" onClick={handleSave} title="Save (Ctrl+S)">
          <Save size={16} />
        </button>
        <button className="ribbon-btn" onClick={exportToPDF} title="Export PDF">
          <FileText size={16} />
        </button>
        <button className="ribbon-btn" onClick={exportToPNG} title="Export PNG">
          <Image size={16} />
        </button>
        <button className="ribbon-btn" onClick={exportToSVG} title="Export SVG">
          <FileCode size={16} />
        </button>
      </div>
    </div>
  );
}
