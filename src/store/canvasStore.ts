import { create } from 'zustand';
import type { Entity, Layer, Constraint, DrawingState } from '../types/entity.types';
import type { Point } from '../lib/geometry';

export type ToolType = 'select' | 'line' | 'circle' | 'arc' | 'ellipse' | 'rectangle' | 'polygon' | 'spline' | 'point' | 'construction_line' | 'trim' | 'fillet' | 'chamfer' | 'offset' | 'mirror' | 'move' | 'copy' | 'rotate' | 'scale' | 'dimension' | 'text' | 'hatch' | 'pan' | 'zoom';

interface CanvasStore {
  // Drawing state
  entities: Entity[];
  layers: Layer[];
  constraints: Constraint[];
  
  // Active tool
  activeTool: ToolType;
  isConstructionMode: boolean;
  
  // Canvas viewport
  viewportOffset: Point;
  zoom: number;
  
  // Grid & Snap
  gridEnabled: boolean;
  snapEnabled: boolean;
  gridSize: number;
  
  // Selection
  selectedEntityIds: string[];
  
  // Drawing metadata
  drawingTitle: string;
  sheetSize: 'A0' | 'A1' | 'A2' | 'A3' | 'A4';
  projection: 'first_angle' | 'third_angle';
  scale: string;
  
  // Cursor
  cursorPosition: Point;
  
  // Undo/Redo
  undoStack: DrawingState[];
  redoStack: DrawingState[];
  
  // Actions
  setActiveTool: (tool: ToolType) => void;
  toggleConstructionMode: () => void;
  addEntity: (entity: Entity) => void;
  updateEntity: (id: string, updates: Partial<Entity>) => void;
  removeEntity: (id: string) => void;
  removeEntities: (ids: string[]) => void;
  setEntities: (entities: Entity[]) => void;
  selectEntity: (id: string, multi?: boolean) => void;
  deselectAll: () => void;
  setSelectedEntityIds: (ids: string[]) => void;
  addLayer: (layer: Layer) => void;
  updateLayer: (id: string, updates: Partial<Layer>) => void;
  removeLayer: (id: string) => void;
  addConstraint: (constraint: Constraint) => void;
  removeConstraint: (id: string) => void;
  setViewport: (offset: Point, zoom: number) => void;
  setZoom: (zoom: number) => void;
  toggleGrid: () => void;
  toggleSnap: () => void;
  setGridSize: (size: number) => void;
  setCursorPosition: (pos: Point) => void;
  setDrawingTitle: (title: string) => void;
  setSheetSize: (size: 'A0' | 'A1' | 'A2' | 'A3' | 'A4') => void;
  setProjection: (proj: 'first_angle' | 'third_angle') => void;
  setScale: (scale: string) => void;
  pushUndo: () => void;
  undo: () => void;
  redo: () => void;
  loadDrawing: (state: DrawingState) => void;
  getDrawingState: () => DrawingState;
  clearCanvas: () => void;
}

const defaultLayer: Layer = {
  id: 'default',
  name: 'Layer 0',
  color: '#FFFFFF',
  isVisible: true,
  isLocked: false,
  lineStyle: 'solid',
  lineWidth: 1,
};

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  entities: [],
  layers: [defaultLayer],
  constraints: [],
  activeTool: 'select',
  isConstructionMode: false,
  viewportOffset: { x: 0, y: 0 },
  zoom: 1,
  gridEnabled: true,
  snapEnabled: true,
  gridSize: 10,
  selectedEntityIds: [],
  drawingTitle: 'Untitled Drawing',
  sheetSize: 'A4',
  projection: 'first_angle',
  scale: '1:1',
  cursorPosition: { x: 0, y: 0 },
  undoStack: [],
  redoStack: [],

  setActiveTool: (tool) => set({ activeTool: tool }),
  toggleConstructionMode: () => set((s) => ({ isConstructionMode: !s.isConstructionMode })),
  
  addEntity: (entity) => {
    const state = get();
    state.pushUndo();
    set((s) => ({ entities: [...s.entities, entity], redoStack: [] }));
  },
  
  updateEntity: (id, updates) => set((s) => ({
    entities: s.entities.map((e) => e.id === id ? { ...e, ...updates } : e),
  })),
  
  removeEntity: (id) => {
    const state = get();
    state.pushUndo();
    set((s) => ({
      entities: s.entities.filter((e) => e.id !== id),
      selectedEntityIds: s.selectedEntityIds.filter((eid) => eid !== id),
      redoStack: [],
    }));
  },
  
  removeEntities: (ids) => {
    const state = get();
    state.pushUndo();
    set((s) => ({
      entities: s.entities.filter((e) => !ids.includes(e.id)),
      selectedEntityIds: s.selectedEntityIds.filter((eid) => !ids.includes(eid)),
      redoStack: [],
    }));
  },
  
  setEntities: (entities) => set({ entities }),
  
  selectEntity: (id, multi = false) => set((s) => ({
    selectedEntityIds: multi 
      ? (s.selectedEntityIds.includes(id) 
          ? s.selectedEntityIds.filter((eid) => eid !== id)
          : [...s.selectedEntityIds, id])
      : [id],
    entities: s.entities.map((e) => ({
      ...e,
      isSelected: multi
        ? (s.selectedEntityIds.includes(id)
            ? e.id !== id && s.selectedEntityIds.includes(e.id)
            : e.id === id || s.selectedEntityIds.includes(e.id))
        : e.id === id,
    })),
  })),
  
  deselectAll: () => set((s) => ({
    selectedEntityIds: [],
    entities: s.entities.map((e) => ({ ...e, isSelected: false })),
  })),
  
  setSelectedEntityIds: (ids) => set((s) => ({
    selectedEntityIds: ids,
    entities: s.entities.map((e) => ({ ...e, isSelected: ids.includes(e.id) })),
  })),
  
  addLayer: (layer) => set((s) => ({ layers: [...s.layers, layer] })),
  updateLayer: (id, updates) => set((s) => ({
    layers: s.layers.map((l) => l.id === id ? { ...l, ...updates } : l),
  })),
  removeLayer: (id) => set((s) => ({
    layers: s.layers.filter((l) => l.id !== id),
  })),
  
  addConstraint: (constraint) => set((s) => ({ constraints: [...s.constraints, constraint] })),
  removeConstraint: (id) => set((s) => ({ constraints: s.constraints.filter((c) => c.id !== id) })),
  
  setViewport: (offset, zoom) => set({ viewportOffset: offset, zoom }),
  setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(20, zoom)) }),
  toggleGrid: () => set((s) => ({ gridEnabled: !s.gridEnabled })),
  toggleSnap: () => set((s) => ({ snapEnabled: !s.snapEnabled })),
  setGridSize: (size) => set({ gridSize: size }),
  setCursorPosition: (pos) => set({ cursorPosition: pos }),
  setDrawingTitle: (title) => set({ drawingTitle: title }),
  setSheetSize: (size) => set({ sheetSize: size }),
  setProjection: (proj) => set({ projection: proj }),
  setScale: (scale) => set({ scale }),
  
  pushUndo: () => {
    const state = get();
    const snap: DrawingState = {
      version: '1.0.0',
      metadata: {
        title: state.drawingTitle,
        sheetSize: state.sheetSize,
        projection: state.projection,
        scale: state.scale,
        author: '',
        date: new Date().toISOString(),
      },
      layers: [...state.layers],
      entities: state.entities.map((e) => ({ ...e })),
      constraints: [...state.constraints],
    };
    set((s) => ({ undoStack: [...s.undoStack.slice(-50), snap] }));
  },
  
  undo: () => {
    const state = get();
    if (state.undoStack.length === 0) return;
    const current: DrawingState = {
      version: '1.0.0',
      metadata: {
        title: state.drawingTitle,
        sheetSize: state.sheetSize,
        projection: state.projection,
        scale: state.scale,
        author: '',
        date: new Date().toISOString(),
      },
      layers: [...state.layers],
      entities: state.entities.map((e) => ({ ...e })),
      constraints: [...state.constraints],
    };
    const prev = state.undoStack[state.undoStack.length - 1];
    set({
      entities: prev.entities,
      layers: prev.layers,
      constraints: prev.constraints,
      undoStack: state.undoStack.slice(0, -1),
      redoStack: [...state.redoStack, current],
    });
  },
  
  redo: () => {
    const state = get();
    if (state.redoStack.length === 0) return;
    const current: DrawingState = {
      version: '1.0.0',
      metadata: {
        title: state.drawingTitle,
        sheetSize: state.sheetSize,
        projection: state.projection,
        scale: state.scale,
        author: '',
        date: new Date().toISOString(),
      },
      layers: [...state.layers],
      entities: state.entities.map((e) => ({ ...e })),
      constraints: [...state.constraints],
    };
    const next = state.redoStack[state.redoStack.length - 1];
    set({
      entities: next.entities,
      layers: next.layers,
      constraints: next.constraints,
      undoStack: [...state.undoStack, current],
      redoStack: state.redoStack.slice(0, -1),
    });
  },
  
  loadDrawing: (state) => set({
    entities: state.entities,
    layers: state.layers,
    constraints: state.constraints,
    drawingTitle: state.metadata.title,
    sheetSize: state.metadata.sheetSize,
    projection: state.metadata.projection,
    scale: state.metadata.scale,
    undoStack: [],
    redoStack: [],
  }),
  
  getDrawingState: (): DrawingState => {
    const state = get();
    return {
      version: '1.0.0',
      metadata: {
        title: state.drawingTitle,
        sheetSize: state.sheetSize,
        projection: state.projection,
        scale: state.scale,
        author: '',
        date: new Date().toISOString(),
      },
      layers: state.layers,
      entities: state.entities,
      constraints: state.constraints,
    };
  },
  
  clearCanvas: () => {
    const state = get();
    state.pushUndo();
    set({ entities: [], constraints: [], selectedEntityIds: [], redoStack: [] });
  },
}));
