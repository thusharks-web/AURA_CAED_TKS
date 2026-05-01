// Core geometry math utilities

export interface Point {
  x: number;
  y: number;
}

export interface Vector2D {
  x: number;
  y: number;
}

export function distance(p1: Point, p2: Point): number {
  return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
}

export function midpoint(p1: Point, p2: Point): Point {
  return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
}

export function angle(p1: Point, p2: Point): number {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

export function angleDeg(p1: Point, p2: Point): number {
  return (angle(p1, p2) * 180) / Math.PI;
}

export function polarPoint(origin: Point, dist: number, angleDeg: number): Point {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: origin.x + dist * Math.cos(rad),
    y: origin.y + dist * Math.sin(rad),
  };
}

export function snapToAngle(origin: Point, cursor: Point, snapAngle: number = 45): Point {
  const a = angleDeg(origin, cursor);
  const d = distance(origin, cursor);
  const snapped = Math.round(a / snapAngle) * snapAngle;
  return polarPoint(origin, d, snapped);
}

export function lineIntersection(
  p1: Point, p2: Point,
  p3: Point, p4: Point
): Point | null {
  const d = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
  if (Math.abs(d) < 1e-10) return null;
  const t = ((p1.x - p3.x) * (p3.y - p4.y) - (p1.y - p3.y) * (p3.x - p4.x)) / d;
  return {
    x: p1.x + t * (p2.x - p1.x),
    y: p1.y + t * (p2.y - p1.y),
  };
}

export function pointOnLine(p: Point, l1: Point, l2: Point, tolerance: number = 5): boolean {
  const d = distance(l1, l2);
  if (d < 1e-10) return distance(p, l1) < tolerance;
  const t = ((p.x - l1.x) * (l2.x - l1.x) + (p.y - l1.y) * (l2.y - l1.y)) / (d * d);
  if (t < 0 || t > 1) return false;
  const proj = { x: l1.x + t * (l2.x - l1.x), y: l1.y + t * (l2.y - l1.y) };
  return distance(p, proj) < tolerance;
}

export function nearestPointOnLine(p: Point, l1: Point, l2: Point): Point {
  const d = distance(l1, l2);
  if (d < 1e-10) return l1;
  const t = Math.max(0, Math.min(1, ((p.x - l1.x) * (l2.x - l1.x) + (p.y - l1.y) * (l2.y - l1.y)) / (d * d)));
  return { x: l1.x + t * (l2.x - l1.x), y: l1.y + t * (l2.y - l1.y) };
}

export function pointOnCircle(p: Point, center: Point, radius: number, tolerance: number = 5): boolean {
  return Math.abs(distance(p, center) - radius) < tolerance;
}

export function rotatePoint(p: Point, center: Point, angleDegrees: number): Point {
  const rad = (angleDegrees * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const dx = p.x - center.x;
  const dy = p.y - center.y;
  return {
    x: center.x + dx * cos - dy * sin,
    y: center.y + dx * sin + dy * cos,
  };
}

export function scalePoint(p: Point, center: Point, factor: number): Point {
  return {
    x: center.x + (p.x - center.x) * factor,
    y: center.y + (p.y - center.y) * factor,
  };
}

export function mirrorPoint(p: Point, lineP1: Point, lineP2: Point): Point {
  const dx = lineP2.x - lineP1.x;
  const dy = lineP2.y - lineP1.y;
  const d = dx * dx + dy * dy;
  if (d < 1e-10) return p;
  const t = ((p.x - lineP1.x) * dx + (p.y - lineP1.y) * dy) / d;
  const proj = { x: lineP1.x + t * dx, y: lineP1.y + t * dy };
  return { x: 2 * proj.x - p.x, y: 2 * proj.y - p.y };
}
