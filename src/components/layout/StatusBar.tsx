import { useCanvasStore } from '../../store/canvasStore';
import './StatusBar.css';

export default function StatusBar() {
  const { cursorPosition, zoom, sheetSize, viewportOffset } = useCanvasStore();

  const worldX = ((cursorPosition.x - viewportOffset.x) / zoom).toFixed(2);
  const worldY = ((cursorPosition.y - viewportOffset.y) / zoom).toFixed(2);

  return (
    <div className="sw-status-wrapper">
      <div className="sw-sheet-tabs">
        <button className="sw-sheet-tab active">Sheet1</button>
      </div>
      <div className="sw-status-bar">
        <div className="sw-status-left">
          <span>Editing Sheet1</span>
        </div>
        <div className="sw-status-right">
          <span className="sw-status-coord">{worldX}mm, {worldY}mm, 0mm</span>
          <span className="sw-status-divider" />
          <span>Under Defined</span>
          <span className="sw-status-divider" />
          <span>Editing Sheet</span>
          <span className="sw-status-divider" />
          <span>MMGS</span>
          <span className="sw-status-divider" />
          <span>{sheetSize}</span>
        </div>
      </div>
    </div>
  );
}
