import { useState } from 'react';
import { useCanvasStore, type ToolType } from '../../store/canvasStore';
import {
  MousePointer2, Minus, Circle, Triangle, Square, Pentagon,
  Spline, Scissors, ArrowUpRight,
  FlipHorizontal, Move,
  Ruler, Dot
} from 'lucide-react';
import './CommandManager.css';

const COMMAND_TABS = [
  { id: 'sketch', label: 'Sketch' },
  { id: 'evaluate', label: 'Evaluate' },
  { id: 'annotation', label: 'Annotation' },
];

const SKETCH_TOOLS = [
  { id: 'select' as ToolType, icon: <MousePointer2 size={24} />, label: 'Select' },
  { id: 'line' as ToolType, icon: <Minus size={24} />, label: 'Line' },
  { id: 'circle' as ToolType, icon: <Circle size={24} />, label: 'Circle' },
  { id: 'arc' as ToolType, icon: <Triangle size={24} />, label: 'Arc' },
  { id: 'rectangle' as ToolType, icon: <Square size={24} />, label: 'Rectangle' },
  { id: 'ellipse' as ToolType, icon: <Pentagon size={24} />, label: 'Ellipse' },
  { id: 'spline' as ToolType, icon: <Spline size={24} />, label: 'Spline' },
  { id: 'point' as ToolType, icon: <Dot size={24} />, label: 'Point' },
  { separator: true },
  { id: 'trim' as ToolType, icon: <Scissors size={24} />, label: 'Trim Entities' },
  { id: 'offset' as ToolType, icon: <ArrowUpRight size={24} />, label: 'Offset Entities' },
  { id: 'mirror' as ToolType, icon: <FlipHorizontal size={24} />, label: 'Mirror Entities' },
  { id: 'move' as ToolType, icon: <Move size={24} />, label: 'Move Entities' },
  { separator: true },
  { id: 'dimension' as ToolType, icon: <Ruler size={24} />, label: 'Smart Dimension' },
];

export default function CommandManager() {
  const { activeTool, setActiveTool } = useCanvasStore();
  const [activeTab, setActiveTab] = useState('sketch');

  return (
    <div className="command-manager">
      <div className="cm-ribbon">
        {activeTab === 'sketch' && (
          <div className="cm-group">
            {SKETCH_TOOLS.map((tool, i) => {
              if (tool.separator) return <div key={i} className="cm-separator" />;
              return (
                <button
                  key={tool.id}
                  className={`cm-btn ${activeTool === tool.id ? 'active' : ''}`}
                  onClick={() => setActiveTool(tool.id!)}
                >
                  <div className="cm-icon">{tool.icon}</div>
                  <span className="cm-label">{tool.label}</span>
                </button>
              );
            })}
          </div>
        )}
        {activeTab === 'evaluate' && (
          <div className="cm-group">
            <button className="cm-btn"><div className="cm-icon"><Ruler size={24} /></div><span className="cm-label">Measure</span></button>
          </div>
        )}
      </div>
      <div className="cm-tabs">
        {COMMAND_TABS.map(tab => (
          <button
            key={tab.id}
            className={`cm-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
