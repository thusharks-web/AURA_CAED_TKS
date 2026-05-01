import { useCallback } from 'react';
import { useCanvasStore } from '../store/canvasStore';
import { supabase } from '../lib/supabase';
import { useUserStore } from '../store/userStore';

export function useDrawingActions() {
  const canvasStore = useCanvasStore();
  const user = useUserStore((s) => s.user);

  const saveDrawing = useCallback(async (drawingId?: string) => {
    if (!user) return null;
    const state = canvasStore.getDrawingState();
    
    if (drawingId) {
      const { error } = await supabase.from('drawings').update({
        title: state.metadata.title,
        sheet_size: state.metadata.sheetSize,
        projection: state.metadata.projection,
        scale: state.metadata.scale,
        data: state,
        updated_at: new Date().toISOString(),
      }).eq('id', drawingId);
      if (error) throw error;
      return drawingId;
    } else {
      const { data, error } = await supabase.from('drawings').insert({
        user_id: user.id,
        title: state.metadata.title,
        sheet_size: state.metadata.sheetSize,
        projection: state.metadata.projection,
        scale: state.metadata.scale,
        data: state,
      }).select('id').single();
      if (error) throw error;
      return data?.id;
    }
  }, [user, canvasStore]);

  const loadDrawing = useCallback(async (drawingId: string) => {
    const { data, error } = await supabase.from('drawings').select('*').eq('id', drawingId).single();
    if (error) throw error;
    if (data?.data) {
      canvasStore.loadDrawing(data.data);
    }
    return data;
  }, [canvasStore]);

  const listDrawings = useCallback(async () => {
    if (!user) return [];
    const { data, error } = await supabase.from('drawings').select('*').eq('user_id', user.id).order('updated_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }, [user]);

  const deleteDrawing = useCallback(async (drawingId: string) => {
    const { error } = await supabase.from('drawings').delete().eq('id', drawingId);
    if (error) throw error;
  }, []);

  const exportToPDF = useCallback(async () => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: canvasStore.sheetSize.toLowerCase() });
    const canvas = document.querySelector('#drawing-canvas canvas') as HTMLCanvasElement;
    if (canvas) {
      const imgData = canvas.toDataURL('image/png');
      doc.addImage(imgData, 'PNG', 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());
    }
    doc.save(`${canvasStore.drawingTitle}.pdf`);
  }, [canvasStore.sheetSize, canvasStore.drawingTitle]);

  const exportToPNG = useCallback(() => {
    const canvas = document.querySelector('#drawing-canvas canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `${canvasStore.drawingTitle}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [canvasStore.drawingTitle]);

  const exportToSVG = useCallback(() => {
    const { entities } = canvasStore;
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">\n`;
    svg += `<rect width="100%" height="100%" fill="#1E1E2E"/>\n`;
    entities.forEach((e) => {
      const d = e.data;
      if (d.type === 'line') {
        svg += `<line x1="${d.start.x}" y1="${d.start.y}" x2="${d.end.x}" y2="${d.end.y}" stroke="${e.color}" stroke-width="${e.lineWidth}"/>\n`;
      } else if (d.type === 'circle') {
        svg += `<circle cx="${d.center.x}" cy="${d.center.y}" r="${d.radius}" fill="none" stroke="${e.color}" stroke-width="${e.lineWidth}"/>\n`;
      } else if (d.type === 'rectangle') {
        svg += `<rect x="${d.topLeft.x}" y="${d.topLeft.y}" width="${d.width}" height="${d.height}" fill="none" stroke="${e.color}" stroke-width="${e.lineWidth}"/>\n`;
      }
    });
    svg += '</svg>';
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const link = document.createElement('a');
    link.download = `${canvasStore.drawingTitle}.svg`;
    link.href = URL.createObjectURL(blob);
    link.click();
  }, [canvasStore]);

  return { saveDrawing, loadDrawing, listDrawings, deleteDrawing, exportToPDF, exportToPNG, exportToSVG };
}
