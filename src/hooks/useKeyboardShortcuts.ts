import { useEffect, useCallback } from 'react';
import { useCanvasStore, type ToolType } from '../store/canvasStore';
import { SHORTCUTS } from '../lib/constants';

export function useKeyboardShortcuts() {
  const { setActiveTool, toggleConstructionMode, toggleGrid, toggleSnap, undo, redo, deselectAll, removeEntities, selectedEntityIds } = useCanvasStore();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'z': e.preventDefault(); undo(); return;
        case 'y': e.preventDefault(); redo(); return;
        case 's': e.preventDefault(); return;
      }
    }

    if (e.shiftKey && e.key.toLowerCase() === 's') { toggleSnap(); return; }

    if (e.key === 'Escape') { deselectAll(); setActiveTool('select'); return; }
    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (selectedEntityIds.length > 0) { removeEntities(selectedEntityIds); }
      return;
    }

    const tool = SHORTCUTS[e.key.toLowerCase()];
    if (tool === 'construction') { toggleConstructionMode(); return; }
    if (tool === 'gridToggle') { toggleGrid(); return; }
    if (tool === 'zoomFit') { return; }
    if (tool === 'select') { setActiveTool('select'); return; }
    if (tool) { setActiveTool(tool as ToolType); }
  }, [setActiveTool, toggleConstructionMode, toggleGrid, toggleSnap, undo, redo, deselectAll, removeEntities, selectedEntityIds]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
