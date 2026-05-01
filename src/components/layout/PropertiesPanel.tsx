import { useCanvasStore } from '../../store/canvasStore';
import { Eye, EyeOff, Lock, Unlock, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import './PropertiesPanel.css';

export default function PropertiesPanel() {
  const {
    selectedEntityIds, entities, updateEntity, layers, addLayer,
    updateLayer, removeLayer, sheetSize, projection, scale,
  } = useCanvasStore();

  const [activeTab, setActiveTab] = useState<'properties' | 'layers'>('properties');
  const selectedEntities = entities.filter(e => selectedEntityIds.includes(e.id));

  const addNewLayer = () => {
    const id = `layer_${Date.now()}`;
    addLayer({
      id, name: `Layer ${layers.length}`, color: '#FFFFFF',
      isVisible: true, isLocked: false, lineStyle: 'solid', lineWidth: 1,
    });
  };

  return (
    <div className="properties-panel">
      <div className="panel-tabs">
        <button className={`panel-tab ${activeTab === 'properties' ? 'active' : ''}`} onClick={() => setActiveTab('properties')}>Properties</button>
        <button className={`panel-tab ${activeTab === 'layers' ? 'active' : ''}`} onClick={() => setActiveTab('layers')}>Layers</button>
      </div>

      {activeTab === 'properties' ? (
        <div className="panel-content">
          {selectedEntities.length === 0 ? (
            <div className="panel-empty">
              <p>Select an entity to view properties</p>
              <div className="drawing-info">
                <h4>Drawing Info</h4>
                <div className="info-row"><span>Sheet</span><span>{sheetSize}</span></div>
                <div className="info-row"><span>Projection</span><span>{projection === 'first_angle' ? '1st Angle' : '3rd Angle'}</span></div>
                <div className="info-row"><span>Scale</span><span>{scale}</span></div>
              </div>
            </div>
          ) : (
            selectedEntities.map(entity => {
              const d = entity.data;
              return (
                <div key={entity.id} className="entity-props">
                  <div className="prop-header">
                    <span className="prop-type">{entity.type}</span>
                    <span className="prop-id">{entity.id.slice(-6)}</span>
                  </div>
                  <div className="prop-group">
                    <label>Color</label>
                    <input type="color" value={entity.color} onChange={e => updateEntity(entity.id, { color: e.target.value })} />
                  </div>
                  <div className="prop-group">
                    <label>Line Width</label>
                    <input type="number" min="0.5" max="10" step="0.5" value={entity.lineWidth} onChange={e => updateEntity(entity.id, { lineWidth: parseFloat(e.target.value) })} />
                  </div>
                  <div className="prop-group">
                    <label>Style</label>
                    <select value={entity.lineStyle} onChange={e => updateEntity(entity.id, { lineStyle: e.target.value as any })}>
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                      <option value="dotted">Dotted</option>
                      <option value="center">Center</option>
                    </select>
                  </div>
                  {d.type === 'line' && (
                    <>
                      <div className="prop-group"><label>Start X</label><span className="prop-val">{d.start.x.toFixed(2)}</span></div>
                      <div className="prop-group"><label>Start Y</label><span className="prop-val">{d.start.y.toFixed(2)}</span></div>
                      <div className="prop-group"><label>End X</label><span className="prop-val">{d.end.x.toFixed(2)}</span></div>
                      <div className="prop-group"><label>End Y</label><span className="prop-val">{d.end.y.toFixed(2)}</span></div>
                    </>
                  )}
                  {d.type === 'circle' && (
                    <>
                      <div className="prop-group"><label>Center X</label><span className="prop-val">{d.center.x.toFixed(2)}</span></div>
                      <div className="prop-group"><label>Center Y</label><span className="prop-val">{d.center.y.toFixed(2)}</span></div>
                      <div className="prop-group"><label>Radius</label><span className="prop-val">{d.radius.toFixed(2)}</span></div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="panel-content">
          <div className="layers-header">
            <span>Layers</span>
            <button className="btn btn-ghost btn-icon btn-sm" onClick={addNewLayer}><Plus size={14} /></button>
          </div>
          <div className="layers-list">
            {layers.map(layer => (
              <div key={layer.id} className="layer-item">
                <input type="color" value={layer.color} className="layer-color" onChange={e => updateLayer(layer.id, { color: e.target.value })} />
                <span className="layer-name">{layer.name}</span>
                <button className="btn btn-ghost btn-icon btn-sm" onClick={() => updateLayer(layer.id, { isVisible: !layer.isVisible })}>
                  {layer.isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
                </button>
                <button className="btn btn-ghost btn-icon btn-sm" onClick={() => updateLayer(layer.id, { isLocked: !layer.isLocked })}>
                  {layer.isLocked ? <Lock size={12} /> : <Unlock size={12} />}
                </button>
                {layer.id !== 'default' && (
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={() => removeLayer(layer.id)}>
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
