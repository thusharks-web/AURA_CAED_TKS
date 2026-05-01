import { useCanvasStore } from '../../store/canvasStore';
import { Eye, EyeOff, Lock, Unlock, Plus } from 'lucide-react';
import { useState } from 'react';
import './FeatureManager.css';

export default function FeatureManager() {
  const {
    selectedEntityIds, entities, updateEntity, layers, addLayer,
    updateLayer,
  } = useCanvasStore();

  const [activeTab, setActiveTab] = useState<'tree' | 'properties' | 'layers'>('tree');
  const selectedEntities = entities.filter(e => selectedEntityIds.includes(e.id));

  const addNewLayer = () => {
    const id = `layer_${Date.now()}`;
    addLayer({
      id, name: `Layer ${layers.length}`, color: '#000000',
      isVisible: true, isLocked: false, lineStyle: 'solid', lineWidth: 1,
    });
  };

  return (
    <div className="feature-manager">
      <div className="fm-tabs">
        <button className={`fm-tab-btn ${activeTab === 'tree' ? 'active' : ''}`} onClick={() => setActiveTab('tree')} title="FeatureManager Design Tree">🌲</button>
        <button className={`fm-tab-btn ${activeTab === 'properties' ? 'active' : ''}`} onClick={() => setActiveTab('properties')} title="PropertyManager">📋</button>
        <button className={`fm-tab-btn ${activeTab === 'layers' ? 'active' : ''}`} onClick={() => setActiveTab('layers')} title="LayerManager">🗂️</button>
      </div>

      <div className="fm-content">
        {activeTab === 'tree' && (
          <div className="fm-tree">
            <div className="fm-tree-item root">
              <span>📄 Drawing1</span>
            </div>
            <div className="fm-tree-item"><span>📁 Annotations</span></div>
            <div className="fm-tree-item"><span>🗂️ Sheet1</span></div>
            <div className="fm-tree-item child"><span>📐 Sheet Format1</span></div>
            <div className="fm-tree-item child">
              <span>✏️ Drawing View1</span>
              {entities.length > 0 && <span className="fm-count">({entities.length})</span>}
            </div>
          </div>
        )}

        {activeTab === 'properties' && (
          <div className="fm-properties">
            <div className="fm-header">PropertyManager</div>
            {selectedEntities.length === 0 ? (
              <div className="fm-empty">Select an entity</div>
            ) : (
              selectedEntities.map(entity => {
                return (
                  <div key={entity.id} className="fm-prop-group">
                    <div className="fm-prop-title">{entity.type.toUpperCase()}</div>
                    <div className="fm-row"><label>Color</label><input type="color" value={entity.color} onChange={e => updateEntity(entity.id, { color: e.target.value })} /></div>
                    <div className="fm-row"><label>Line Width</label><input type="number" min="0.5" max="10" step="0.5" value={entity.lineWidth} onChange={e => updateEntity(entity.id, { lineWidth: parseFloat(e.target.value) })} /></div>
                    <div className="fm-row"><label>Style</label><select value={entity.lineStyle} onChange={e => updateEntity(entity.id, { lineStyle: e.target.value as any })}><option value="solid">Solid</option><option value="dashed">Dashed</option><option value="dotted">Dotted</option><option value="center">Center</option></select></div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'layers' && (
          <div className="fm-layers">
            <div className="fm-header">Layers <button onClick={addNewLayer}><Plus size={12}/></button></div>
            {layers.map(layer => (
              <div key={layer.id} className="fm-layer-item">
                <input type="color" value={layer.color} onChange={e => updateLayer(layer.id, { color: e.target.value })} />
                <span className="fm-layer-name">{layer.name}</span>
                <button onClick={() => updateLayer(layer.id, { isVisible: !layer.isVisible })}>{layer.isVisible ? <Eye size={12}/> : <EyeOff size={12}/>}</button>
                <button onClick={() => updateLayer(layer.id, { isLocked: !layer.isLocked })}>{layer.isLocked ? <Lock size={12}/> : <Unlock size={12}/>}</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
