import { Injectable } from '@angular/core';
import * as joint from '@joint/plus';

@Injectable({
  providedIn: 'root'
})
export class ZoomService {
  private readonly zoomFactor = 1.2;
  private readonly minScale = 0.1;
  private readonly maxScale = 3;

  private currentScale = 1;

  // Updated methods to work with PaperScroller
  zoomIn(paperScroller: joint.ui.PaperScroller, centerPoint?: { x: number, y: number }): void {
    const newScale = Math.min(this.currentScale * this.zoomFactor, this.maxScale);
    this.zoomToPoint(paperScroller, newScale, centerPoint);
  }

  zoomOut(paperScroller: joint.ui.PaperScroller, centerPoint?: { x: number, y: number }): void {
    const newScale = Math.max(this.currentScale / this.zoomFactor, this.minScale);
    this.zoomToPoint(paperScroller, newScale, centerPoint);
  }

  private zoomToPoint(paperScroller: joint.ui.PaperScroller, newScale: number, centerPoint?: { x: number, y: number }): void {
    const paper = paperScroller.options.paper;
    
    // Determine zoom center point
    let zoomCenter: { x: number, y: number };
    
    if (centerPoint) {
      // Use provided center point (e.g., mouse position)
      zoomCenter = centerPoint;
    } else {
      // Use viewport center as default
      const scrollerRect = paperScroller.el.getBoundingClientRect();
      zoomCenter = {
        x: scrollerRect.width / 2,
        y: scrollerRect.height / 2
      };
    }

    // Convert screen coordinates to paper coordinates before zoom
    const paperPoint = paper.clientToLocalPoint(zoomCenter.x, zoomCenter.y);

    // Zoom the paper
    paperScroller.zoom(newScale, { absolute: true });
    
    // After zoom, convert the same paper point back to screen coordinates
    const newScreenPoint = paper.localToClientPoint(paperPoint);
    
    // Calculate how much to scroll to keep the point centered
    const deltaX = newScreenPoint.x - zoomCenter.x;
    const deltaY = newScreenPoint.y - zoomCenter.y;
    
    // Adjust scroll position
    paperScroller.el.scrollLeft += deltaX;
    paperScroller.el.scrollTop += deltaY;

    this.currentScale = newScale;
  }

  // Zoom to fit all shapes in view
  fitToScreen(paperScroller: joint.ui.PaperScroller): void {
    const paper = paperScroller.options.paper;
    const graph = paper.model;
    const elements = graph.getElements();
    
    if (elements.length === 0) {
      this.resetZoom(paperScroller);
      return;
    }

    // Calculate bounding box manually
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    elements.forEach(element => {
      const bbox = element.getBBox();
      minX = Math.min(minX, bbox.x);
      minY = Math.min(minY, bbox.y);
      maxX = Math.max(maxX, bbox.x + bbox.width);
      maxY = Math.max(maxY, bbox.y + bbox.height);
    });

    const contentBBox = {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };

    if (contentBBox.width === 0 || contentBBox.height === 0) {
      this.resetZoom(paperScroller);
      return;
    }

    // Get scroller dimensions
    const scrollerRect = paperScroller.el.getBoundingClientRect();
    const padding = 50; // padding around content

    // Calculate scale to fit content
    const scaleX = (scrollerRect.width - padding * 2) / contentBBox.width;
    const scaleY = (scrollerRect.height - padding * 2) / contentBBox.height;
    const scale = Math.min(scaleX, scaleY, this.maxScale);

    // Zoom to calculated scale
    paperScroller.zoom(scale, { absolute: true });

    // Center the content
    paperScroller.centerContent();

    this.currentScale = scale;
  }

  // Reset zoom and center on shapes
  resetZoom(paperScroller: joint.ui.PaperScroller): void {
    const paper = paperScroller.options.paper;
    const graph = paper.model;
    const elements = graph.getElements();
    
    // Reset zoom to 1x
    paperScroller.zoom(1, { absolute: true });
    
    if (elements.length === 0) {
      // No shapes, just center the empty canvas
      paperScroller.center();
    } else {
      // Center on the shapes
      paperScroller.centerContent();
    }

    this.currentScale = 1;
  }

  // Zoom to specific shapes
  zoomToShapes(paperScroller: joint.ui.PaperScroller, shapes: joint.dia.Element[]): void {
    if (shapes.length === 0) return;

    const paper = paperScroller.options.paper;
    
    // Calculate bounding box manually
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    shapes.forEach(shape => {
      const bbox = shape.getBBox();
      minX = Math.min(minX, bbox.x);
      minY = Math.min(minY, bbox.y);
      maxX = Math.max(maxX, bbox.x + bbox.width);
      maxY = Math.max(maxY, bbox.y + bbox.height);
    });

    const contentBBox = {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };

    if (contentBBox.width === 0 || contentBBox.height === 0) return;

    // Get scroller dimensions
    const scrollerRect = paperScroller.el.getBoundingClientRect();
    const padding = 100; // padding around selected shapes

    // Calculate scale to fit selected shapes
    const scaleX = (scrollerRect.width - padding * 2) / contentBBox.width;
    const scaleY = (scrollerRect.height - padding * 2) / contentBBox.height;
    const scale = Math.min(scaleX, scaleY, this.maxScale);

    // Zoom to calculated scale
    paperScroller.zoom(scale, { absolute: true });

    // Calculate center position of shapes
    const centerX = contentBBox.x + contentBBox.width / 2;
    const centerY = contentBBox.y + contentBBox.height / 2;

    // Convert to paper coordinates and center on them
    const paperCenter = paper.localToClientPoint(centerX, centerY);
    const scrollerCenter = {
      x: scrollerRect.width / 2,
      y: scrollerRect.height / 2
    };

    // Adjust scroll to center the shapes
    paperScroller.el.scrollLeft += (paperCenter.x - scrollerCenter.x);
    paperScroller.el.scrollTop += (paperCenter.y - scrollerCenter.y);

    this.currentScale = scale;
  }

  getCurrentZoom(paperScroller: joint.ui.PaperScroller): number {
    return Math.round(this.currentScale * 100);
  }

  // Get current scale from paper matrix (useful for sync)
  syncCurrentScale(paperScroller: joint.ui.PaperScroller): void {
    const paper = paperScroller.options.paper;
    const matrix = paper.matrix();
    this.currentScale = matrix.a;
  }
}