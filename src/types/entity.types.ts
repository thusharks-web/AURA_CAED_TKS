import type { Point } from '../lib/geometry';

export type EntityType = 'line' | 'circle' | 'arc' | 'ellipse' | 'rectangle' | 'polygon' | 'spline' | 'point' | 'text' | 'dimension' | 'hatch' | 'construction_line';

export type ConstraintType = 'horizontal' | 'vertical' | 'parallel' | 'perpendicular' | 'tangent' | 'coincident' | 'concentric' | 'equal' | 'symmetric' | 'midpoint' | 'collinear' | 'fixed' | 'merge';

export type DimensionType = 'linear' | 'aligned' | 'angular' | 'radial' | 'diameter' | 'ordinate' | 'arc_length' | 'chamfer';

export interface Entity {
  id: string;
  type: EntityType;
  layerId: string;
  isConstruction: boolean;
  isSelected: boolean;
  isLocked: boolean;
  color: string;
  lineWidth: number;
  lineStyle: 'solid' | 'dashed' | 'dotted' | 'center' | 'phantom';
  data: EntityData;
}

export type EntityData = 
  | LineData 
  | CircleData 
  | ArcData 
  | EllipseData 
  | RectangleData 
  | PolygonData 
  | SplineData 
  | PointData 
  | TextData 
  | DimensionData
  | HatchData;

export interface LineData {
  type: 'line';
  start: Point;
  end: Point;
}

export interface CircleData {
  type: 'circle';
  center: Point;
  radius: number;
}

export interface ArcData {
  type: 'arc';
  center: Point;
  radius: number;
  startAngle: number;
  endAngle: number;
}

export interface EllipseData {
  type: 'ellipse';
  center: Point;
  radiusX: number;
  radiusY: number;
  rotation: number;
}

export interface RectangleData {
  type: 'rectangle';
  topLeft: Point;
  width: number;
  height: number;
  rotation: number;
}

export interface PolygonData {
  type: 'polygon';
  center: Point;
  radius: number;
  sides: number;
  rotation: number;
  inscribed: boolean;
}

export interface SplineData {
  type: 'spline';
  points: Point[];
  isClosed: boolean;
}

export interface PointData {
  type: 'point';
  position: Point;
}

export interface TextData {
  type: 'text';
  position: Point;
  content: string;
  fontSize: number;
  fontFamily: string;
  rotation: number;
}

export interface DimensionData {
  type: 'dimension';
  dimensionType: DimensionType;
  points: Point[];
  value: number;
  text: string;
  offset: number;
}

export interface HatchData {
  type: 'hatch';
  boundary: Point[];
  pattern: 'lines' | 'crosshatch' | 'dots';
  angle: number;
  spacing: number;
}

export interface Constraint {
  id: string;
  type: ConstraintType;
  entityIds: string[];
  value?: number;
}

export interface Layer {
  id: string;
  name: string;
  color: string;
  isVisible: boolean;
  isLocked: boolean;
  lineStyle: string;
  lineWidth: number;
}

export interface DrawingState {
  version: string;
  metadata: {
    title: string;
    sheetSize: 'A0' | 'A1' | 'A2' | 'A3' | 'A4';
    projection: 'first_angle' | 'third_angle';
    scale: string;
    author: string;
    date: string;
  };
  layers: Layer[];
  entities: Entity[];
  constraints: Constraint[];
}
