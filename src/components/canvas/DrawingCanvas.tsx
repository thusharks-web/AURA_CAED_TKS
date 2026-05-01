import { useRef, useState, useEffect, useCallback } from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import type { Entity, LineData, CircleData, ArcData, RectangleData, EllipseData, PointData } from '../../types/entity.types';
import type { Point } from '../../lib/geometry';
import { distance } from '../../lib/geometry';
import { COLORS } from '../../lib/constants';
import './DrawingCanvas.css';

function generateId(): string {
  return `e_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export default function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);

  const {
    entities, activeTool, isConstructionMode, viewportOffset, zoom,
    gridEnabled, snapEnabled, gridSize, cursorPosition,
    addEntity, selectEntity, deselectAll, setCursorPosition,
    setViewport, selectedEntityIds,
  } = useCanvasStore();

  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [previewPoint, setPreviewPoint] = useState<Point | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<Point>({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  // Screen to world coordinate conversion
  const screenToWorld = useCallback((sx: number, sy: number): Point => ({
    x: (sx - viewportOffset.x) / zoom,
    y: (sy - viewportOffset.y) / zoom,
  }), [viewportOffset, zoom]);

  const worldToScreen = useCallback((wx: number, wy: number): Point => ({
    x: wx * zoom + viewportOffset.x,
    y: wy * zoom + viewportOffset.y,
  }), [viewportOffset, zoom]);

  // Snap to grid
  const snapPoint = useCallback((p: Point): Point => {
    if (!snapEnabled) return p;
    const gs = gridSize;
    return { x: Math.round(p.x / gs) * gs, y: Math.round(p.y / gs) * gs };
  }, [snapEnabled, gridSize]);

  // Resize handler
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCanvasSize({ width: rect.width, height: rect.height });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Center viewport on mount
  useEffect(() => {
    setViewport({ x: canvasSize.width / 2, y: canvasSize.height / 2 }, 1);
  }, [canvasSize.width, canvasSize.height]);

  // Drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

      // Background
      ctx.fillStyle = COLORS.canvasBackground;
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

      // Grid
      if (gridEnabled) {
        drawGrid(ctx);
      }

      // Origin crosshair
      drawOrigin(ctx);

      // Entities
      entities.forEach((entity) => {
        drawEntity(ctx, entity);
      });

      // Preview (live drawing feedback)
      if (isDrawing && startPoint && previewPoint) {
        drawPreview(ctx);
      }

      // Snap indicator
      if (activeTool !== 'select' && activeTool !== 'pan') {
        drawSnapIndicator(ctx);
      }

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animRef.current);
  }, [entities, viewportOffset, zoom, gridEnabled, gridSize, canvasSize, isDrawing, startPoint, previewPoint, activeTool, cursorPosition, selectedEntityIds, isConstructionMode]);

  function drawGrid(ctx: CanvasRenderingContext2D) {
    const gs = gridSize * zoom;
    if (gs < 4) return;

    const startX = viewportOffset.x % gs;
    const startY = viewportOffset.y % gs;
    const majorGS = gs * 10;
    const startMajorX = viewportOffset.x % majorGS;
    const startMajorY = viewportOffset.y % majorGS;

    // Minor grid
    ctx.strokeStyle = COLORS.gridMinor;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    for (let x = startX; x < canvasSize.width; x += gs) {
      ctx.moveTo(x, 0); ctx.lineTo(x, canvasSize.height);
    }
    for (let y = startY; y < canvasSize.height; y += gs) {
      ctx.moveTo(0, y); ctx.lineTo(canvasSize.width, y);
    }
    ctx.stroke();

    // Major grid
    ctx.strokeStyle = COLORS.gridMajor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = startMajorX; x < canvasSize.width; x += majorGS) {
      ctx.moveTo(x, 0); ctx.lineTo(x, canvasSize.height);
    }
    for (let y = startMajorY; y < canvasSize.height; y += majorGS) {
      ctx.moveTo(0, y); ctx.lineTo(canvasSize.width, y);
    }
    ctx.stroke();
  }

  function drawOrigin(ctx: CanvasRenderingContext2D) {
    const o = worldToScreen(0, 0);
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(o.x, 0); ctx.lineTo(o.x, canvasSize.height);
    ctx.moveTo(0, o.y); ctx.lineTo(canvasSize.width, o.y);
    ctx.stroke();

    ctx.fillStyle = '#FF5252';
    ctx.beginPath();
    ctx.arc(o.x, o.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawEntity(ctx: CanvasRenderingContext2D, entity: Entity) {
    const d = entity.data;
    const isSelected = selectedEntityIds.includes(entity.id);
    const color = isSelected ? COLORS.selectedEntity : entity.isConstruction ? COLORS.constructionLine : entity.color;
    
    ctx.strokeStyle = color;
    ctx.lineWidth = (entity.lineWidth || 1) * (isSelected ? 2 : 1);
    ctx.fillStyle = 'transparent';

    if (entity.lineStyle === 'dashed' || entity.isConstruction) {
      ctx.setLineDash([6, 4]);
    } else if (entity.lineStyle === 'dotted') {
      ctx.setLineDash([2, 3]);
    } else if (entity.lineStyle === 'center') {
      ctx.setLineDash([12, 3, 3, 3]);
    } else {
      ctx.setLineDash([]);
    }

    ctx.beginPath();

    if (d.type === 'line') {
      const s = worldToScreen(d.start.x, d.start.y);
      const e = worldToScreen(d.end.x, d.end.y);
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(e.x, e.y);
    } else if (d.type === 'circle') {
      const c = worldToScreen(d.center.x, d.center.y);
      ctx.arc(c.x, c.y, d.radius * zoom, 0, Math.PI * 2);
    } else if (d.type === 'arc') {
      const c = worldToScreen(d.center.x, d.center.y);
      ctx.arc(c.x, c.y, d.radius * zoom, (d.startAngle * Math.PI) / 180, (d.endAngle * Math.PI) / 180);
    } else if (d.type === 'ellipse') {
      const c = worldToScreen(d.center.x, d.center.y);
      ctx.ellipse(c.x, c.y, d.radiusX * zoom, d.radiusY * zoom, (d.rotation * Math.PI) / 180, 0, Math.PI * 2);
    } else if (d.type === 'rectangle') {
      const tl = worldToScreen(d.topLeft.x, d.topLeft.y);
      ctx.rect(tl.x, tl.y, d.width * zoom, d.height * zoom);
    } else if (d.type === 'point') {
      const p = worldToScreen(d.position.x, d.position.y);
      ctx.moveTo(p.x - 4, p.y); ctx.lineTo(p.x + 4, p.y);
      ctx.moveTo(p.x, p.y - 4); ctx.lineTo(p.x, p.y + 4);
    } else if (d.type === 'dimension') {
      drawDimension(ctx, d, color);
      ctx.setLineDash([]);
      return;
    }

    ctx.stroke();
    ctx.setLineDash([]);

    // Selection handles
    if (isSelected) {
      drawSelectionHandles(ctx, entity);
    }
  }

  function drawDimension(ctx: CanvasRenderingContext2D, d: any, _color: string) {
    if (d.points.length < 2) return;
    const p1 = worldToScreen(d.points[0].x, d.points[0].y);
    const p2 = worldToScreen(d.points[1].x, d.points[1].y);
    const offset = (d.offset || 30) * zoom;
    
    const midX = (p1.x + p2.x) / 2;
    const midY = Math.min(p1.y, p2.y) - offset;

    ctx.strokeStyle = COLORS.constraintSymbol;
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    ctx.beginPath();

    // Extension lines
    ctx.moveTo(p1.x, p1.y); ctx.lineTo(p1.x, midY);
    ctx.moveTo(p2.x, p2.y); ctx.lineTo(p2.x, midY);
    // Dimension line
    ctx.moveTo(p1.x, midY); ctx.lineTo(p2.x, midY);
    ctx.stroke();

    // Arrowheads
    drawArrowhead(ctx, p1.x, midY, p2.x > p1.x ? 0 : Math.PI);
    drawArrowhead(ctx, p2.x, midY, p2.x > p1.x ? Math.PI : 0);

    // Text
    ctx.fillStyle = COLORS.dimensionText;
    ctx.font = `${12 * zoom}px Inter`;
    ctx.textAlign = 'center';
    ctx.fillText(d.text || d.value?.toFixed(2) || '', midX, midY - 6);
  }

  function drawArrowhead(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number) {
    const size = 8;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + size * Math.cos(angle + 0.4), y + size * Math.sin(angle + 0.4));
    ctx.moveTo(x, y);
    ctx.lineTo(x + size * Math.cos(angle - 0.4), y + size * Math.sin(angle - 0.4));
    ctx.stroke();
  }

  function drawSelectionHandles(ctx: CanvasRenderingContext2D, entity: Entity) {
    const d = entity.data;
    const handles: Point[] = [];

    if (d.type === 'line') {
      handles.push(worldToScreen(d.start.x, d.start.y), worldToScreen(d.end.x, d.end.y));
    } else if (d.type === 'circle') {
      handles.push(worldToScreen(d.center.x, d.center.y));
    } else if (d.type === 'rectangle') {
      handles.push(worldToScreen(d.topLeft.x, d.topLeft.y));
      handles.push(worldToScreen(d.topLeft.x + d.width, d.topLeft.y + d.height));
    }

    ctx.fillStyle = COLORS.selectedEntity;
    handles.forEach((h) => {
      ctx.beginPath();
      ctx.rect(h.x - 4, h.y - 4, 8, 8);
      ctx.fill();
    });
  }

  function drawPreview(ctx: CanvasRenderingContext2D) {
    if (!startPoint || !previewPoint) return;
    const s = worldToScreen(startPoint.x, startPoint.y);
    const e = worldToScreen(previewPoint.x, previewPoint.y);

    ctx.strokeStyle = isConstructionMode ? COLORS.constructionLine : 'rgba(108,99,255,0.8)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();

    if (activeTool === 'line' || activeTool === 'construction_line') {
      ctx.moveTo(s.x, s.y); ctx.lineTo(e.x, e.y);
    } else if (activeTool === 'circle') {
      const r = distance(startPoint, previewPoint) * zoom;
      ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
    } else if (activeTool === 'rectangle') {
      ctx.rect(s.x, s.y, e.x - s.x, e.y - s.y);
    } else if (activeTool === 'ellipse') {
      const rx = Math.abs(previewPoint.x - startPoint.x) * zoom;
      const ry = Math.abs(previewPoint.y - startPoint.y) * zoom;
      const cx = (s.x + e.x) / 2;
      const cy = (s.y + e.y) / 2;
      ctx.ellipse(cx, cy, rx / 2, ry / 2, 0, 0, Math.PI * 2);
    } else if (activeTool === 'arc') {
      const r = distance(startPoint, previewPoint) * zoom;
      const angle = Math.atan2(previewPoint.y - startPoint.y, previewPoint.x - startPoint.x);
      ctx.arc(s.x, s.y, r, 0, angle);
    }

    ctx.stroke();
    ctx.setLineDash([]);

    // Dimension readout during drawing
    const dist = distance(startPoint, previewPoint);
    ctx.fillStyle = 'rgba(108,99,255,0.9)';
    ctx.font = '12px JetBrains Mono';
    ctx.fillText(`${dist.toFixed(2)} mm`, e.x + 12, e.y - 8);
  }

  function drawSnapIndicator(ctx: CanvasRenderingContext2D) {
    const wp = screenToWorld(cursorPosition.x, cursorPosition.y);
    const snapped = snapPoint(wp);
    const sp = worldToScreen(snapped.x, snapped.y);

    if (snapEnabled) {
      ctx.strokeStyle = COLORS.constraintSymbol;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(sp.x - 6, sp.y); ctx.lineTo(sp.x + 6, sp.y);
      ctx.moveTo(sp.x, sp.y - 6); ctx.lineTo(sp.x, sp.y + 6);
      ctx.stroke();
    }
  }

  // Find entity at point
  function findEntityAt(worldPos: Point): Entity | null {
    for (let i = entities.length - 1; i >= 0; i--) {
      const e = entities[i];
      const d = e.data;
      const tolerance = 8 / zoom;

      if (d.type === 'line') {
        const dx = d.end.x - d.start.x;
        const dy = d.end.y - d.start.y;
        const len = Math.sqrt(dx*dx + dy*dy);
        if (len < 0.001) continue;
        const t = Math.max(0, Math.min(1, ((worldPos.x - d.start.x)*dx + (worldPos.y - d.start.y)*dy) / (len*len)));
        const proj = { x: d.start.x + t*dx, y: d.start.y + t*dy };
        if (distance(worldPos, proj) < tolerance) return e;
      } else if (d.type === 'circle') {
        if (Math.abs(distance(worldPos, d.center) - d.radius) < tolerance) return e;
      } else if (d.type === 'rectangle') {
        const r = { x: d.topLeft.x, y: d.topLeft.y, w: d.width, h: d.height };
        if (worldPos.x >= r.x - tolerance && worldPos.x <= r.x + r.w + tolerance &&
            worldPos.y >= r.y - tolerance && worldPos.y <= r.y + r.h + tolerance) {
          if (worldPos.x <= r.x + tolerance || worldPos.x >= r.x + r.w - tolerance ||
              worldPos.y <= r.y + tolerance || worldPos.y >= r.y + r.h - tolerance) return e;
        }
      } else if (d.type === 'point') {
        if (distance(worldPos, d.position) < tolerance) return e;
      }
    }
    return null;
  }

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const wp = screenToWorld(sx, sy);
    const snapped = snapPoint(wp);

    // Middle mouse or space+click for pan
    if (e.button === 1 || activeTool === 'pan') {
      setIsPanning(true);
      setPanStart({ x: e.clientX - viewportOffset.x, y: e.clientY - viewportOffset.y });
      return;
    }

    if (activeTool === 'select') {
      const entity = findEntityAt(snapped);
      if (entity) {
        selectEntity(entity.id, e.shiftKey);
      } else {
        deselectAll();
      }
      return;
    }

    if (activeTool === 'dimension') {
      if (!isDrawing) {
        setIsDrawing(true);
        setStartPoint(snapped);
      } else if (startPoint) {
        const dimEntity: Entity = {
          id: generateId(), type: 'dimension', layerId: 'default',
          isConstruction: false, isSelected: false, isLocked: false,
          color: COLORS.constraintSymbol, lineWidth: 1, lineStyle: 'solid',
          data: {
            type: 'dimension', dimensionType: 'linear',
            points: [startPoint, snapped],
            value: distance(startPoint, snapped),
            text: distance(startPoint, snapped).toFixed(2),
            offset: 30,
          },
        };
        addEntity(dimEntity);
        setIsDrawing(false);
        setStartPoint(null);
        setPreviewPoint(null);
      }
      return;
    }

    // Drawing tools
    if (['line', 'circle', 'rectangle', 'ellipse', 'arc', 'construction_line'].includes(activeTool)) {
      if (!isDrawing) {
        setIsDrawing(true);
        setStartPoint(snapped);
      } else if (startPoint) {
        createEntity(startPoint, snapped);
        setIsDrawing(false);
        setStartPoint(null);
        setPreviewPoint(null);
      }
    }

    if (activeTool === 'point') {
      const pe: Entity = {
        id: generateId(), type: 'point', layerId: 'default',
        isConstruction: false, isSelected: false, isLocked: false,
        color: COLORS.entityDefault, lineWidth: 1, lineStyle: 'solid',
        data: { type: 'point', position: snapped } as PointData,
      };
      addEntity(pe);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    setCursorPosition({ x: sx, y: sy });

    if (isPanning) {
      setViewport(
        { x: e.clientX - panStart.x, y: e.clientY - panStart.y },
        zoom
      );
      return;
    }

    if (isDrawing) {
      const wp = screenToWorld(sx, sy);
      setPreviewPoint(snapPoint(wp));
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(20, zoom * delta));
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    
    const newOffset = {
      x: mx - (mx - viewportOffset.x) * (newZoom / zoom),
      y: my - (my - viewportOffset.y) * (newZoom / zoom),
    };
    setViewport(newOffset, newZoom);
  };

  function createEntity(start: Point, end: Point) {
    let entity: Entity | null = null;
    const isCon = isConstructionMode || activeTool === 'construction_line';

    if (activeTool === 'line' || activeTool === 'construction_line') {
      entity = {
        id: generateId(), type: 'line', layerId: 'default',
        isConstruction: isCon, isSelected: false, isLocked: false,
        color: isCon ? COLORS.constructionLine : COLORS.entityDefault,
        lineWidth: 1, lineStyle: isCon ? 'dashed' : 'solid',
        data: { type: 'line', start, end } as LineData,
      };
    } else if (activeTool === 'circle') {
      entity = {
        id: generateId(), type: 'circle', layerId: 'default',
        isConstruction: isCon, isSelected: false, isLocked: false,
        color: isCon ? COLORS.constructionLine : COLORS.entityDefault,
        lineWidth: 1, lineStyle: isCon ? 'dashed' : 'solid',
        data: { type: 'circle', center: start, radius: distance(start, end) } as CircleData,
      };
    } else if (activeTool === 'rectangle') {
      entity = {
        id: generateId(), type: 'rectangle', layerId: 'default',
        isConstruction: isCon, isSelected: false, isLocked: false,
        color: isCon ? COLORS.constructionLine : COLORS.entityDefault,
        lineWidth: 1, lineStyle: isCon ? 'dashed' : 'solid',
        data: {
          type: 'rectangle',
          topLeft: { x: Math.min(start.x, end.x), y: Math.min(start.y, end.y) },
          width: Math.abs(end.x - start.x), height: Math.abs(end.y - start.y),
          rotation: 0,
        } as RectangleData,
      };
    } else if (activeTool === 'ellipse') {
      entity = {
        id: generateId(), type: 'ellipse', layerId: 'default',
        isConstruction: isCon, isSelected: false, isLocked: false,
        color: isCon ? COLORS.constructionLine : COLORS.entityDefault,
        lineWidth: 1, lineStyle: isCon ? 'dashed' : 'solid',
        data: {
          type: 'ellipse',
          center: { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 },
          radiusX: Math.abs(end.x - start.x) / 2,
          radiusY: Math.abs(end.y - start.y) / 2,
          rotation: 0,
        } as EllipseData,
      };
    } else if (activeTool === 'arc') {
      entity = {
        id: generateId(), type: 'arc', layerId: 'default',
        isConstruction: isCon, isSelected: false, isLocked: false,
        color: isCon ? COLORS.constructionLine : COLORS.entityDefault,
        lineWidth: 1, lineStyle: isCon ? 'dashed' : 'solid',
        data: {
          type: 'arc', center: start, radius: distance(start, end),
          startAngle: 0,
          endAngle: (Math.atan2(end.y - start.y, end.x - start.x) * 180) / Math.PI,
        } as ArcData,
      };
    }

    if (entity) addEntity(entity);
  }

  const worldPos = screenToWorld(cursorPosition.x, cursorPosition.y);
  const snappedPos = snapPoint(worldPos);

  return (
    <div className="drawing-canvas-container" ref={containerRef} id="drawing-canvas">
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onContextMenu={(e) => e.preventDefault()}
        style={{ cursor: activeTool === 'pan' || isPanning ? 'grab' : activeTool === 'select' ? 'default' : 'crosshair' }}
      />
      <div className="coord-overlay">
        <span>X: {snappedPos.x.toFixed(2)}</span>
        <span>Y: {snappedPos.y.toFixed(2)}</span>
      </div>
    </div>
  );
}
