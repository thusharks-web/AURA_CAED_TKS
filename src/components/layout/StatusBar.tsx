import { useCanvasStore } from '../../store/canvasStore';
import './StatusBar.css';

export default function StatusBar() {
  const { cursorPosition, gridEnabled, snapEnabled, activeTool, isConstructionMode, entities, zoom, gridSize, sheetSize, projection, viewportOffset } = useCanvasStore();

  const worldX = ((cursorPosition.x - viewportOffset.x) / zoom).toFixed(2);
  const worldY = ((cursorPosition.y - viewportOffset.y) / zoom).toFixed(2);

  return (
    <div className="status-bar">
      <div className="status-left">
        <span className="status-item coord">
          <span className="coord-label">X:</span> {worldX}
        </span>
        <span className="status-item coord">
          <span className="coord-label">Y:</span> {worldY}
        </span>
        <span className="status-divider" />
        <span className={`status-item ${gridEnabled ? 'active' : ''}`}>
          Grid: {gridEnabled ? 'ON' : 'OFF'}
        </span>
        <span className={`status-item ${snapEnabled ? 'active' : ''}`}>
          Snap: {snapEnabled ? 'ON' : 'OFF'}
        </span>
        <span className="status-divider" />
        <span className="status-item">Grid: {gridSize}mm</span>
      </div>
      <div className="status-center">
        <span className="status-tool">
          {activeTool.charAt(0).toUpperCase() + activeTool.slice(1).replace('_', ' ')}
          {isConstructionMode && <span className="constr-badge">CONSTR</span>}
        </span>
      </div>
      <div className="status-right">
        <span className="status-item">Entities: {entities.length}</span>
        <span className="status-divider" />
        <span className="status-item">{sheetSize}</span>
        <span className="status-item">{projection === 'first_angle' ? '1st ∠' : '3rd ∠'}</span>
        <span className="status-item">Zoom: {(zoom * 100).toFixed(0)}%</span>
      </div>
    </div>
  );
}
