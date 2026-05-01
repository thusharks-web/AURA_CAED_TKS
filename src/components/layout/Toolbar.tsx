import { useCanvasStore, type ToolType } from '../../store/canvasStore';
import {
  MousePointer2, Minus, Circle, Triangle, Square, Pentagon,
  Spline, Scissors, CornerDownRight, ArrowUpRight,
  FlipHorizontal, Move, Copy, RotateCw, Scaling,
  Type, Grid3X3, Ruler, Pencil, Dot
} from 'lucide-react';
import './Toolbar.css';

const toolGroups = [
  {
    label: 'Draw',
    tools: [
      { id: 'select' as ToolType, icon: <MousePointer2 size={18} />, label: 'Select', shortcut: 'S' },
      { id: 'line' as ToolType, icon: <Minus size={18} />, label: 'Line', shortcut: 'L' },
      { id: 'construction_line' as ToolType, icon: <Minus size={18} />, label: 'Construction Line', shortcut: '' },
      { id: 'circle' as ToolType, icon: <Circle size={18} />, label: 'Circle', shortcut: 'C' },
      { id: 'arc' as ToolType, icon: <Triangle size={18} />, label: 'Arc', shortcut: 'A' },
      { id: 'rectangle' as ToolType, icon: <Square size={18} />, label: 'Rectangle', shortcut: 'R' },
      { id: 'ellipse' as ToolType, icon: <Pentagon size={18} />, label: 'Ellipse', shortcut: 'E' },
      { id: 'spline' as ToolType, icon: <Spline size={18} />, label: 'Spline', shortcut: 'N' },
      { id: 'point' as ToolType, icon: <Dot size={18} />, label: 'Point', shortcut: 'P' },
    ],
  },
  {
    label: 'Edit',
    tools: [
      { id: 'trim' as ToolType, icon: <Scissors size={18} />, label: 'Trim', shortcut: 'T' },
      { id: 'fillet' as ToolType, icon: <CornerDownRight size={18} />, label: 'Fillet', shortcut: '' },
      { id: 'offset' as ToolType, icon: <ArrowUpRight size={18} />, label: 'Offset', shortcut: 'O' },
      { id: 'mirror' as ToolType, icon: <FlipHorizontal size={18} />, label: 'Mirror', shortcut: 'M' },
      { id: 'move' as ToolType, icon: <Move size={18} />, label: 'Move', shortcut: '' },
      { id: 'copy' as ToolType, icon: <Copy size={18} />, label: 'Copy', shortcut: '' },
      { id: 'rotate' as ToolType, icon: <RotateCw size={18} />, label: 'Rotate', shortcut: '' },
      { id: 'scale' as ToolType, icon: <Scaling size={18} />, label: 'Scale', shortcut: '' },
    ],
  },
  {
    label: 'Annotate',
    tools: [
      { id: 'dimension' as ToolType, icon: <Ruler size={18} />, label: 'Smart Dimension', shortcut: 'D' },
      { id: 'text' as ToolType, icon: <Type size={18} />, label: 'Note', shortcut: '' },
      { id: 'hatch' as ToolType, icon: <Grid3X3 size={18} />, label: 'Hatch Fill', shortcut: '' },
    ],
  },
];

export default function Toolbar() {
  const { activeTool, setActiveTool, isConstructionMode, toggleConstructionMode } = useCanvasStore();

  return (
    <div className="toolbar">
      {toolGroups.map((group) => (
        <div key={group.label} className="tool-group">
          <div className="tool-group-label">{group.label}</div>
          {group.tools.map((tool) => (
            <button
              key={tool.id}
              className={`tool-btn ${activeTool === tool.id ? 'active' : ''}`}
              onClick={() => setActiveTool(tool.id)}
              title={`${tool.label}${tool.shortcut ? ` (${tool.shortcut})` : ''}`}
            >
              {tool.icon}
              {activeTool === tool.id && <span className="tool-label">{tool.label}</span>}
            </button>
          ))}
        </div>
      ))}
      <div className="tool-group">
        <div className="tool-group-label">Mode</div>
        <button
          className={`tool-btn ${isConstructionMode ? 'active construction' : ''}`}
          onClick={toggleConstructionMode}
          title="Construction Mode (Q)"
        >
          <Pencil size={18} />
          {isConstructionMode && <span className="tool-label">Constr.</span>}
        </button>
      </div>
    </div>
  );
}
