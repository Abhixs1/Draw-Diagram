// canvas.component.ts - Enhanced with Resize Controls
import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as joint from '@joint/plus';
import { JointService } from '../../services/joint.service';
import { FormsModule } from '@angular/forms';
import { PaperService } from '../../services/paper.service';
import { StencilService } from '../../services/stencil.service';
import { ZoomService } from '../../services/zoom.service';
import { GraphService } from '../../services/graph.service';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef;
  @ViewChild('paperContainer', { static: true }) paperContainer!: ElementRef;
  @ViewChild('paperHost', { static: true }) paperHost!: ElementRef;

  @Output() elementSelected = new EventEmitter<any>();
  @Output() elementDeselected = new EventEmitter<void>();
  @Input() selectedElement: any = null;

  private graph!: joint.dia.Graph;
  public paper!: joint.dia.Paper; // ✅ CHANGED: from private to public
  private paperScroller!: joint.ui.PaperScroller;

  // Undo/Redo Stack
  private undoStack: string[] = [];
  private redoStack: string[] = [];

  // Drag and drop properties
  isDragOver = false;
  dropIndicatorPosition = { x: 0, y: 0 };
  private dragOverTimeout: any;

  // Arrow properties
  arrowMode = false;
  firstShape: any = null;

  // Arrow style presets
  private arrowStyles = {
    default: {
      line: { stroke: '#333333', strokeWidth: 2 },
      targetMarker: { type: 'path', d: 'M 10 -5 0 0 10 5 z', fill: '#333333' }
    },
    thick: {
      line: { stroke: '#333333', strokeWidth: 4 },
      targetMarker: { type: 'path', d: 'M 12 -6 0 0 12 6 z', fill: '#333333' }
    },
    dashed: {
      line: { stroke: '#333333', strokeWidth: 2, strokeDasharray: '5,5' },
      targetMarker: { type: 'path', d: 'M 10 -5 0 0 10 5 z', fill: '#333333' }
    },
    curved: {
      line: { stroke: '#333333', strokeWidth: 2 },
      targetMarker: { type: 'path', d: 'M 10 -5 0 0 10 5 z', fill: '#333333' }
    }
  };

  constructor(
    private jointService: JointService,
    private paperService: PaperService,
    private stencilService: StencilService,
    private zoomService: ZoomService,
    private graphService: GraphService
  ) {}

  private setupMouseWheelZoom(): void {
    this.paperScroller.el.addEventListener('wheel', (event: WheelEvent) => {
      event.preventDefault();
      
      // Get mouse position relative to the scroller element
      const scrollerRect = this.paperScroller.el.getBoundingClientRect();
      const mousePos = {
        x: event.clientX - scrollerRect.left,
        y: event.clientY - scrollerRect.top
      };
      
      // Zoom in or out based on wheel direction
      if (event.deltaY < 0) {
        // Zoom in
        this.zoomService.zoomIn(this.paperScroller, mousePos);
      } else {
        // Zoom out
        this.zoomService.zoomOut(this.paperScroller, mousePos);
      }
    });
  }

  ngOnInit(): void {
    this.graph = this.jointService.createGraph();
      const diagramData = localStorage.getItem('diagram');
  if (diagramData) {
    try {
      const parsed = JSON.parse(diagramData);
      this.graphService.importGraph(this.graph, JSON.stringify(parsed.data || parsed));
      console.log('✅ Loaded diagram into canvas');
    } catch (e) {
      console.error('❌ Failed to load diagram from localStorage:', e);
    }
  }
    this.paper = this.jointService.createPaper(this.paperHost.nativeElement, this.graph);

    // Setup scroller
    this.paperScroller = this.jointService.createPaperScroller(this.paper);
    this.paperScroller.render();
    this.paperScroller.el.addEventListener('contextmenu', (e) => {
  e.preventDefault(); // Prevent right-click context menu
});
this.paper.on('element:contextmenu', (elementView, evt) => {
  evt.preventDefault(); // Prevent context menu on elements
});

this.paper.on('element:pointerdown', (elementView, evt) => {
  if (evt.button === 2) {
    evt.preventDefault(); // Ignore right-clicks
    return;
  }
});

    this.paperContainer.nativeElement.appendChild(this.paperScroller.el);

    this.paperScroller.el.scrollTop = 0;
    this.paperScroller.el.scrollLeft = 0;
    this.paperScroller.center();

    this.paperScroller.listenTo(this.paper, 'blank:pointerdown', (evt: any) => {
      this.paperScroller.startPanning(evt);
    });

    // Mouse wheel zoom handling
    this.setupMouseWheelZoom();

    this.saveState();
    this.paperService.setupPaperEvents(this.paper, el => this.onElementClick(el), () => this.onBlankClick());
    this.paperService.setupGraphEvents(this.graph, cell => this.onCellChange(cell), this.paper);
    
    // Setup arrow click events
    this.setupArrowEvents();
  }

  private setupArrowEvents(): void {
    // Handle link/arrow clicks
    this.paper.on('link:pointerclick', (linkView) => {
      if (!this.arrowMode) {
        this.selectArrow(linkView.model);
      }
    });
  }

  private selectArrow(arrow: any): void {
    this.paperService.deselectAllElements(this.paper);
    this.selectedElement = arrow;
    this.elementSelected.emit(arrow);
    
    // Add visual selection to arrow
    arrow.attr({
      line: {
        ...arrow.attr('line'),
        stroke: '#0969da',
        strokeWidth: (arrow.attr('line/strokeWidth') || 2) + 1
      }
    });
  }

  private saveState(): void {
    const json = JSON.stringify(this.graph.toJSON());
    this.undoStack.push(json);
    this.redoStack = [];
    if (this.undoStack.length > 50) this.undoStack.shift();
  }

  undo(): void {
    if (this.undoStack.length > 1) {
      const current = this.undoStack.pop()!;
      this.redoStack.push(current);
      const prev = this.undoStack[this.undoStack.length - 1];
      this.graph.fromJSON(JSON.parse(prev));
      this.clearSelection();
    }
  }

  redo(): void {
    if (this.redoStack.length > 0) {
      const next = this.redoStack.pop()!;
      this.undoStack.push(next);
      this.graph.fromJSON(JSON.parse(next));
      this.clearSelection();
    }
  }

  clearSelection(): void {
    this.selectedElement = null;
    this.elementDeselected.emit();
    this.paperService.deselectAllElements(this.paper);
    this.deselectAllArrows();
  }

  private deselectAllArrows(): void {
    const links = this.graph.getLinks();
    links.forEach((link: any) => {
      const originalStroke = link.prop('originalStroke') || '#333333';
      const originalWidth = link.prop('originalStrokeWidth') || 2;
      link.attr({
        line: {
          ...link.attr('line'),
          stroke: originalStroke,
          strokeWidth: originalWidth
        }
      });
    });
  }

  // Arrow mode handler
  onArrowModeToggled(arrow: boolean): void {
    this.arrowMode = arrow;
    this.firstShape = null;
    this.paperService.setArrowMode(arrow);
    this.canvas.nativeElement.style.cursor = arrow ? 'crosshair' : 'default';
    this.clearSelection();
  }

  private onElementClick(element: any): void {
    if (this.arrowMode) {
      if (!this.firstShape) {
        this.firstShape = element;
        this.paperService.selectElement(this.paper, element);
      } else if (this.firstShape !== element) {
        this.saveState();
        this.createEnhancedArrow(this.firstShape, element);
        
        // Keep arrow mode active, just reset selection
        this.firstShape = null;
        this.paperService.deselectAllElements(this.paper);
        
      } else {
        this.firstShape = null;
        this.paperService.deselectAllElements(this.paper);
      }
    } else {
      this.paperService.selectElement(this.paper, element);
      this.selectedElement = element;
      this.elementSelected.emit(element);
    }
  }

  private onBlankClick(): void {
    this.firstShape = null;
    this.arrowMode = false;
    this.canvas.nativeElement.style.cursor = 'default';
    this.clearSelection();
  }

  // ✅ ADD: Handle resize events from resize controls
  onElementResized(event: any): void {
    this.saveState(); // Save for undo/redo
    console.log('Element resized:', event);
  }

  // Enhanced arrow creation with properties
  private createEnhancedArrow(source: any, target: any, style: string = 'default'): void {
    const link = new joint.shapes.standard.Link();
    link.source(source);
    link.target(target);
    
    // Apply style
    const arrowStyle = this.arrowStyles[style as keyof typeof this.arrowStyles] || this.arrowStyles.default;
    link.attr(arrowStyle);
    
    // Store original properties for deselection
    link.prop('originalStroke', arrowStyle.line.stroke);
    link.prop('originalStrokeWidth', arrowStyle.line.strokeWidth);
    
    // Add custom properties
    link.prop('arrowProperties', {
      style: style,
      color: arrowStyle.line.stroke,
      thickness: arrowStyle.line.strokeWidth,
      label: '',
      labelPosition: 0.5, // 0-1 along the line
      labelBackground: true,
      arrowHead: 'standard',
      lineStyle: 'solid',
      routing: 'normal'
    });
    
    this.graph.addCell(link);
  }

  // Create arrow with specific properties
  createArrowWithProperties(source: any, target: any, properties: any): void {
    const link = new joint.shapes.standard.Link();
    link.source(source);
    link.target(target);
    
    // Apply properties
    this.applyArrowProperties(link, properties);
    
    this.graph.addCell(link);
    this.saveState();
  }

  // Apply properties to an existing arrow
  applyArrowProperties(arrow: any, properties: any): void {
    const attrs: any = {
      line: {
        stroke: properties.color || '#333333',
        strokeWidth: properties.thickness || 2
      }
    };

    // Line style
    if (properties.lineStyle === 'dashed') {
      attrs.line.strokeDasharray = '5,5';
    } else if (properties.lineStyle === 'dotted') {
      attrs.line.strokeDasharray = '2,2';
    }

    // Arrow head style
    switch (properties.arrowHead) {
      case 'none':
        attrs.targetMarker = { type: 'none' };
        break;
      case 'circle':
        attrs.targetMarker = {
          type: 'circle',
          r: 5,
          fill: properties.color || '#333333'
        };
        break;
      case 'diamond':
        attrs.targetMarker = {
          type: 'path',
          d: 'M 10 -5 0 0 10 5 5 0 z',
          fill: properties.color || '#333333'
        };
        break;
      case 'large':
        attrs.targetMarker = {
          type: 'path',
          d: 'M 15 -8 0 0 15 8 z',
          fill: properties.color || '#333333'
        };
        break;
      default: // standard
        attrs.targetMarker = {
          type: 'path',
          d: 'M 10 -5 0 0 10 5 z',
          fill: properties.color || '#333333'
        };
    }

    // Label
    if (properties.label) {
      attrs.labelText = {
        text: properties.label,
        fontSize: 12,
        fill: properties.color || '#333333',
        textAnchor: 'middle',
        textVerticalAnchor: 'middle'
      };
      
      if (properties.labelBackground) {
        attrs.labelRect = {
          fill: 'white',
          stroke: properties.color || '#333333',
          strokeWidth: 1,
          rx: 3,
          ry: 3
        };
      }
      
      arrow.label(0, {
        position: properties.labelPosition || 0.5,
        attrs: {
          text: attrs.labelText,
          rect: attrs.labelRect
        }
      });
    }

    // Routing
    if (properties.routing === 'orthogonal') {
      arrow.router('orthogonal');
    } else if (properties.routing === 'manhattan') {
      arrow.router('manhattan');
    } else {
      arrow.router('normal');
    }

    arrow.attr(attrs);
    
    // Store properties
    arrow.prop('arrowProperties', properties);
    arrow.prop('originalStroke', properties.color);
    arrow.prop('originalStrokeWidth', properties.thickness);
  }

  // Update arrow properties
  updateArrowProperty(arrow: any, property: string, value: any): void {
    if (!arrow || !arrow.isLink()) return;
    
    const currentProps = arrow.prop('arrowProperties') || {};
    currentProps[property] = value;
    
    this.applyArrowProperties(arrow, currentProps);
    this.saveState();
  }

  // Get arrow properties
  getArrowProperties(arrow: any): any {
    if (!arrow || !arrow.isLink()) return null;
    
    return arrow.prop('arrowProperties') || {
      style: 'default',
      color: '#333333',
      thickness: 2,
      label: '',
      labelPosition: 0.5,
      labelBackground: true,
      arrowHead: 'standard',
      lineStyle: 'solid',
      routing: 'normal'
    };
  }

  @HostListener('document:mousemove', ['$event'])
  onDocumentMouseMove(event: MouseEvent): void {
    const canvasRect = this.canvas.nativeElement.getBoundingClientRect();
    const isOverCanvas = event.clientX >= canvasRect.left &&
                        event.clientX <= canvasRect.right &&
                        event.clientY >= canvasRect.top &&
                        event.clientY <= canvasRect.bottom;

    if (isOverCanvas && this.isCustomDragActive()) {
      this.isDragOver = true;
      this.dropIndicatorPosition = {
        x: event.clientX - canvasRect.left,
        y: event.clientY - canvasRect.top
      };
    } else if (!isOverCanvas) {
      this.isDragOver = false;
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onDocumentMouseUp(event: MouseEvent): void {
    if (this.isCustomDragActive()) {
      const canvasRect = this.canvas.nativeElement.getBoundingClientRect();
      const isOverCanvas = event.clientX >= canvasRect.left &&
                          event.clientX <= canvasRect.right &&
                          event.clientY >= canvasRect.top &&
                          event.clientY <= canvasRect.bottom;

      if (isOverCanvas) {
        this.isDragOver = false;
      }
    }
  }

  private isCustomDragActive(): boolean {
    return document.body.style.cursor === 'grabbing';
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'copy';
    
    const canvasRect = this.canvas.nativeElement.getBoundingClientRect();
    this.dropIndicatorPosition = {
      x: event.clientX - canvasRect.left,
      y: event.clientY - canvasRect.top
    };
  }

  onDragEnter(event: DragEvent): void {
    event.preventDefault();
    
    const draggedData = event.dataTransfer?.getData('application/json');
    if (draggedData) {
      this.isDragOver = true;
      
      if (this.dragOverTimeout) {
        clearTimeout(this.dragOverTimeout);
      }
    }
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    
    this.dragOverTimeout = setTimeout(() => {
      const canvasRect = this.canvas.nativeElement.getBoundingClientRect();
      const isOutside = event.clientX < canvasRect.left ||
                       event.clientX > canvasRect.right ||
                       event.clientY < canvasRect.top ||
                       event.clientY > canvasRect.bottom;
      
      if (isOutside) {
        this.isDragOver = false;
      }
    }, 50);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    
    if (this.dragOverTimeout) {
      clearTimeout(this.dragOverTimeout);
    }

    try {
      const draggedDataStr = event.dataTransfer?.getData('application/json');
      if (!draggedDataStr) {
        console.warn('No shape data found in drag event');
        return;
      }

      const draggedData = JSON.parse(draggedDataStr);
      

      const canvasRect = this.canvas.nativeElement.getBoundingClientRect();
      const clientPosition = {
        x: event.clientX - canvasRect.left,
        y: event.clientY - canvasRect.top
      };

      this.addShapeFromStencil(draggedData, clientPosition);
      this.showDropSuccess(clientPosition);

    } catch (error) {
      console.error('Error handling drop:', error);
      this.showDropError();
    }
  }

  onShapeDroppedFromSidebar(event: { shapeData: any, position: any }): void {
    
    try {
      const canvasRect = this.canvas.nativeElement.getBoundingClientRect();
      const clientPosition = {
        x: event.position.x - canvasRect.left,
        y: event.position.y - canvasRect.top
      };

      if (clientPosition.x >= 0 && clientPosition.x <= canvasRect.width &&
          clientPosition.y >= 0 && clientPosition.y <= canvasRect.height) {
       
        this.addShapeFromStencil(event.shapeData, clientPosition);
        this.showDropSuccess(clientPosition);
        
      } else {
      }

    } catch (error) {
      console.error('Error handling shape drop from sidebar:', error);
      this.showDropError();
    }
  }

  private showDropSuccess(position: { x: number, y: number }): void {
    const indicator = document.createElement('div');
    indicator.className = 'drop-success';
    indicator.textContent = '✓';
    indicator.style.position = 'absolute';
    indicator.style.left = `${position.x - 10}px`;
    indicator.style.top = `${position.y - 10}px`;
    indicator.style.color = '#28a745';
    indicator.style.fontSize = '20px';
    indicator.style.fontWeight = 'bold';
    indicator.style.pointerEvents = 'none';
    indicator.style.zIndex = '1000';
    indicator.style.animation = 'dropSuccess 1s ease-out forwards';

    this.canvas.nativeElement.appendChild(indicator);

    setTimeout(() => {
      if (indicator.parentNode) {
        indicator.parentNode.removeChild(indicator);
      }
    }, 1000);
  }

  private showDropError(): void {
    const indicator = document.createElement('div');
    indicator.className = 'drop-error';
    indicator.textContent = '✗ Drop failed';
    indicator.style.position = 'absolute';
    indicator.style.left = '50%';
    indicator.style.top = '50%';
    indicator.style.transform = 'translate(-50%, -50%)';
    indicator.style.color = '#dc3545';
    indicator.style.fontSize = '16px';
    indicator.style.fontWeight = 'bold';
    indicator.style.backgroundColor = 'rgba(248, 249, 250, 0.9)';
    indicator.style.padding = '8px 16px';
    indicator.style.borderRadius = '4px';
    indicator.style.border = '1px solid #dc3545';
    indicator.style.pointerEvents = 'none';
    indicator.style.zIndex = '1000';

    this.canvas.nativeElement.appendChild(indicator);

    setTimeout(() => {
      if (indicator.parentNode) {
        indicator.parentNode.removeChild(indicator);
      }
    }, 2000);
  }

  private onCellChange(cell: any): void {

  }

  addShapeFromStencil(shapeData: any, clientPosition: { x: number, y: number }): void {
    try {
      const paperPosition = this.paper.clientToLocalPoint(clientPosition);
      const config = { ...JSON.parse(JSON.stringify(shapeData)), position: paperPosition };
      config.size ||= { width: 100, height: 60 };

      const shape = new (joint.shapes as any)[config.type.split('.')[0]][config.type.split('.')[1]](config);
      this.graphService.addElement(this.graph, shape);
      this.saveState();

      if (!this.arrowMode) {
        setTimeout(() => this.onElementClick(shape), 100);
      }
    } catch (e) {
      console.error('Shape creation failed, falling back.', e);
    }
  }

  updateSelectedElement(property: string, value: any): void {
    if (this.selectedElement) {
      if (this.selectedElement.isLink && this.selectedElement.isLink()) {
        // It's an arrow
        this.updateArrowProperty(this.selectedElement, property, value);
      } else {
        // It's a shape
        this.paperService.updateElementProperty(this.selectedElement, property, value);
      }
    }
  }

  getSelectedElementProperties(): any {
    if (this.selectedElement) {
      if (this.selectedElement.isLink && this.selectedElement.isLink()) {
        // It's an arrow
        return this.getArrowProperties(this.selectedElement);
      } else {
        // It's a shape
        return this.paperService.getElementProperties(this.selectedElement);
      }
    }
    return null;
  }

  // Zoom methods
  zoomIn(): void {
    this.zoomService.zoomIn(this.paperScroller);
  }

  zoomOut(): void {
    this.zoomService.zoomOut(this.paperScroller);
  }

  fitToScreen(): void {
    this.zoomService.fitToScreen(this.paperScroller);
  }

  resetZoom(): void {
    this.zoomService.resetZoom(this.paperScroller);
  }

  getCurrentZoom(): number {
    return this.zoomService.getCurrentZoom(this.paperScroller);
  }

  // Graph operations
  clearCanvas(): void {
    this.graphService.clearGraph(this.graph);
    this.saveState();
    this.clearSelection();
    this.arrowMode = false;
    this.firstShape = null;
    this.paperService.setArrowMode(false);
    this.canvas.nativeElement.style.cursor = 'default';
  }

  exportGraph(): string {
    return this.graphService.exportGraph(this.graph);
  }

  importGraph(json: any): boolean {
    try {
      // If json is a string, parse it first
      const data = typeof json === 'string' ? JSON.parse(json) : json;

      // Fix custom cell types before loading
      data.cells.forEach((cell: any) => {
        if (cell.type === 'app.Link') {
          cell.type = 'standard.Link';
        }
        if (cell.type === 'app.Rectangle') {
          cell.type = 'standard.Rectangle';
        }
        // Add more mappings if needed
      });

      // Load into the graph directly
      this.graph.fromJSON(data);

      // Restore UI state
      this.saveState();
      this.clearSelection();
      this.arrowMode = false;
      this.firstShape = null;
      this.canvas.nativeElement.style.cursor = 'default';

      return true;
    } catch (err) {
      console.error('❌ Failed to import graph:', err);
      return false;
    }
  }

  deleteSelectedElement(): void {
    if (this.selectedElement) {
      this.graphService.removeElement(this.graph, this.selectedElement);
      this.saveState();
      this.clearSelection();
    }
  }

  getGraph() {
    return this.graph;
  }
centerContent(): void {
  // Fit content to viewport first
  this.paperScroller.zoomToFit({
    useModelGeometry: true,
    padding: 50,
    maxScale: 1 // Don't zoom in beyond 100%
  });

  // Then center it inside the viewport
  this.paperScroller.centerContent({
    useModelGeometry: true,
    padding: 50
  });
}




}