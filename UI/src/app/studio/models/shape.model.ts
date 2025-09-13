// src/app/core/models/shape.model.ts
export interface ShapeProperties {
  title: string;
  tags: string;
  fill: string;
  outline: string;
  outlineThickness: number;
  outlineStyle: string;
  text: string;
  fontSize: number;
  fontFamily: string;
  fontThickness: number;
  textColor: string;
}

export interface ShapeData {
  type: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  attrs: any;
}

export interface ShapeCategory {
  name: string;
  icon: string;
  expanded: boolean;
}

export interface StencilShape {
  type: string;
  pos: { x: number; y: number };
}