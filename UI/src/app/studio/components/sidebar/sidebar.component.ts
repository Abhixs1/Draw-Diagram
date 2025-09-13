import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as joint from '@joint/plus';
import { JointService } from '../../services/joint.service';
import { StencilService } from '../../services/stencil.service';
import { ShapeCategory } from '../../models/shape.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, AfterViewInit {
  @ViewChild('basicStencil', { static: true }) basicStencil!: ElementRef;
  @ViewChild('advancedStencil', { static: true }) advancedStencil!: ElementRef;
  @Output() shapeDropped = new EventEmitter<{ shapeData: any, position: any }>();
  @Output() arrowModeToggled = new EventEmitter<boolean>();

  private basicStencilGraph!: joint.dia.Graph;
  private basicStencilPaper!: joint.dia.Paper;
  private advancedStencilGraph!: joint.dia.Graph;
  private advancedStencilPaper!: joint.dia.Paper;
  private isDragging = false;
  private dragElement: HTMLElement | null = null;

  // Expansion states
  basicShapesExpanded = true;
  advancedShapesExpanded = true; // START EXPANDED
  arrowMode = false;

  shapeCategories: ShapeCategory[] = [
    { name: 'Shapes', icon: '■', expanded: true }
  ];

  constructor(
    private jointService: JointService,
    private stencilService: StencilService
  ) {}

  ngOnInit(): void {
    // Initialize after view is ready
  }

  ngAfterViewInit(): void {
    // Initialize stencils after view is fully rendered
    setTimeout(() => {
      this.initializeStencils();
    }, 300);
  }

  private initializeStencils(): void {
    
    
    try {
      // Check if elements exist
      if (!this.basicStencil?.nativeElement || !this.advancedStencil?.nativeElement) {
        return;
      }

      // Initialize Basic Shapes
      this.basicStencilGraph = this.jointService.createGraph();
      this.basicStencilPaper = this.jointService.createStencilPaper(
        this.basicStencil.nativeElement,
        this.basicStencilGraph
      );
      
      // Initialize Advanced Shapes  
      this.advancedStencilGraph = this.jointService.createGraph();
      this.advancedStencilPaper = this.jointService.createStencilPaper(
        this.advancedStencil.nativeElement,
        this.advancedStencilGraph
      );



      // Create shapes using individual method calls
      this.createBasicShapes();
      this.createAdvancedShapes();
      
      // Enable drag and drop
      this.enableDragAndDrop();
      

    } catch (error) {
      console.error('Error initializing stencils:', error);
    }
  }

  private createBasicShapes(): void {
    
    const basicShapes = [
      // Row 1 - 4 shapes with tighter spacing
      { type: 'rectangle', pos: { x: 8, y: 15 } },
      { type: 'circle', pos: { x: 46, y: 15 } },
      { type: 'ellipse', pos: { x: 84, y: 15 } },
      { type: 'diamond', pos: { x: 122, y: 15 } },
      
      // Row 2 - reduced row spacing
      { type: 'triangle', pos: { x: 8, y: 70 } },
      { type: 'pentagon', pos: { x: 46, y: 70 } },
      { type: 'hexagon', pos: { x: 84, y: 70 } },
      { type: 'octagon', pos: { x: 122, y: 70 } },
      
      // Row 3 - reduced row spacing
      { type: 'star', pos: { x: 8, y: 125 } },
      { type: 'cross', pos: { x: 46, y: 125 } },
      { type: 'arrow', pos: { x: 84, y: 125 } },
      { type: 'trapezoid', pos: { x: 122, y: 125 } },
      
      // Row 4 - reduced row spacing
      { type: 'parallelogram', pos: { x: 8, y: 180 } },
      { type: 'cylinder', pos: { x: 46, y: 180 } },
      { type: 'document', pos: { x: 84, y: 180 } },
      { type: 'callout', pos: { x: 122, y: 180 } },
    ];

    let shapesCreated = 0;
    basicShapes.forEach(shape => {
      try {
        const element = this.stencilService.createStencilShape(shape);
        if (element) {
          element.attr('body/magnet', true);
          this.basicStencilGraph.addCell(element);
          shapesCreated++;
          
        } else {
          console.warn(`Failed to create basic shape: ${shape.type}`);
        }
      } catch (error) {
        console.error(`Error creating basic shape ${shape.type}:`, error);
      }
    });
    
  }

  private createAdvancedShapes(): void {
    
    const advancedShapes = [
      // Row 1 - 4 shapes with tighter spacing
      { type: 'l-shape', pos: { x: 12, y: 18 } },
      { type: 'u-shape', pos: { x: 50, y: 18 } },
      { type: 'process', pos: { x: 88, y: 18 } },
      { type: 'image', pos: { x: 126, y: 18 } },
      
      // Row 2 - reduced spacing between rows
      { type: 'embedded-image', pos: { x: 20, y: 65 } },
      { type: 'headered-rectangle', pos: { x: 70, y: 65 } },
      { type: 'inscribed-image', pos: { x: 120, y: 65 } },
    ];

    let shapesCreated = 0;
    advancedShapes.forEach(shape => {
      try {
        const element = this.stencilService.createStencilShape(shape);
        if (element) {
          element.attr('body/magnet', true);
          this.advancedStencilGraph.addCell(element);
          shapesCreated++;
        
        } else {
          console.warn(`Failed to create advanced shape: ${shape.type}`);
        }
      } catch (error) {
        console.error(`Error creating advanced shape ${shape.type}:`, error);
      }
    });
    
  }

  // Toggle methods for subsections
  toggleBasicShapes(): void {
    this.basicShapesExpanded = !this.basicShapesExpanded;
  }

  toggleAdvancedShapes(): void {
    this.advancedShapesExpanded = !this.advancedShapesExpanded;
  }

  // Arrow mode toggle
  toggleArrowMode(): void {
    this.arrowMode = !this.arrowMode;
    this.arrowModeToggled.emit(this.arrowMode);
   
  }

  private enableDragAndDrop(): void {
    
    // Enable drag for basic shapes
    if (this.basicStencilPaper) {
      this.setupDragForPaper(this.basicStencilPaper);
    }
    // Enable drag for advanced shapes
    if (this.advancedStencilPaper) {
      this.setupDragForPaper(this.advancedStencilPaper);
    }
  }

  private setupDragForPaper(paper: joint.dia.Paper): void {
    paper.on('cell:pointerdown', (cellView: any, evt: any) => {
      
      const originalShape = cellView.model;
     
      const shapeData = {
        type: originalShape.get('type'),
        size: originalShape.get('size'),
        attrs: originalShape.get('attrs')
      };

      const startPos = { x: evt.clientX, y: evt.clientY };
      let hasStartedDrag = false;

      const onMouseMove = (e: MouseEvent) => {
        const distance = Math.sqrt(
          Math.pow(e.clientX - startPos.x, 2) +
          Math.pow(e.clientY - startPos.y, 2)
        );

        if (distance > 10 && !hasStartedDrag) {
          hasStartedDrag = true;
          this.startDrag(e, shapeData, cellView);
        }

        if (this.isDragging && this.dragElement) {
          this.updateDragElement(e);
        }
      };

      const onMouseUp = (e: MouseEvent) => {
        if (this.isDragging) {
          this.endDrag(e, shapeData);
        }
       
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
     
      evt.preventDefault();
      evt.stopPropagation();
    });
  }

  private startDrag(e: MouseEvent, shapeData: any, cellView: any): void {
    
    this.isDragging = true;
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
   
    // Create drag preview element
    this.dragElement = this.createDragPreview(shapeData);
    if (this.dragElement) {
      document.body.appendChild(this.dragElement);
      this.updateDragElement(e);
    }

    // Add visual feedback to original element
    if (cellView && cellView.el) {
      cellView.el.style.opacity = '0.5';
    }
  }

  private updateDragElement(e: MouseEvent): void {
    if (this.dragElement) {
      this.dragElement.style.left = (e.clientX - 30) + 'px';
      this.dragElement.style.top = (e.clientY - 20) + 'px';
    }
  }

  private endDrag(e: MouseEvent, shapeData: any): void {
    
    // Check if we're dropping outside both stencil areas
    const basicStencilRect = this.basicStencil.nativeElement.getBoundingClientRect();
    const advancedStencilRect = this.advancedStencil.nativeElement.getBoundingClientRect();
    
    const isOutsideStencils =
      (e.clientX < basicStencilRect.left || e.clientX > basicStencilRect.right ||
       e.clientY < basicStencilRect.top || e.clientY > basicStencilRect.bottom) &&
      (e.clientX < advancedStencilRect.left || e.clientX > advancedStencilRect.right ||
       e.clientY < advancedStencilRect.top || e.clientY > advancedStencilRect.bottom);

    if (isOutsideStencils) {
      
      // Convert screen coordinates to canvas coordinates
      const canvasPosition = this.getCanvasPosition(e);
     
      this.shapeDropped.emit({
        shapeData,
        position: canvasPosition
      });
    } 

    this.cleanupDrag();
  }

  private getCanvasPosition(e: MouseEvent): { x: number, y: number } {
    // Return screen coordinates - the canvas component will handle conversion
    return {
      x: e.clientX,
      y: e.clientY
    };
  }

  private createDragPreview(shapeData: any): HTMLElement {
    const preview = document.createElement('div');
    preview.style.position = 'fixed';
    preview.style.pointerEvents = 'none';
    preview.style.zIndex = '10000';
    preview.style.width = '60px';
    preview.style.height = '45px';
    preview.style.backgroundColor = '#ffffff';
    preview.style.border = '2px solid #0969da';
    preview.style.borderRadius = '4px';
    preview.style.display = 'flex';
    preview.style.alignItems = 'center';
    preview.style.justifyContent = 'center';
    preview.style.fontSize = '10px';
    preview.style.color = '#0969da';
    preview.style.fontWeight = 'bold';
    preview.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    preview.style.opacity = '0.9';

    // Set preview text based on shape type
    const shapeType = this.getShapeTypeFromData(shapeData);
    preview.textContent = shapeType;

    return preview;
  }

  private getShapeTypeFromData(shapeData: any): string {
    const type = shapeData.type;
   
    switch (type) {
      case 'standard.Rectangle': return 'Rect';
      case 'standard.Circle': return 'Circle';
      case 'standard.Ellipse': return 'Ellipse';
      case 'standard.Cylinder': return 'Cylinder';
      case 'standard.Path': return 'Shape';
      case 'standard.Image': return 'Image';
      case 'standard.EmbeddedImage': return 'Embed';
      case 'standard.HeaderedRectangle': return 'Header';
      case 'standard.InscribedImage': return 'Inscr';
      case 'standard.Polygon': {
        const refPoints = shapeData.attrs?.body?.refPoints;
        if (refPoints?.includes('0.5,0 1,0.5 0.5,1 0,0.5')) return 'Diamond';
        if (refPoints?.includes('0.5,0 1,1 0,1')) return 'Triangle';
        if (refPoints?.includes('0.5,0 1,0.38 0.81,1 0.19,1 0,0.38')) return 'Pentagon';
        if (refPoints?.includes('0.25,0 0.75,0 1,0.5 0.75,1 0.25,1 0,0.5')) return 'Hexagon';
        if (refPoints?.includes('0.3,0 0.7,0 1,0.3 1,0.7 0.7,1 0.3,1 0,0.7 0,0.3')) return 'Octagon';
        if (refPoints?.includes('0.5,0 0.63,0.38 1,0.38 0.69,0.59 0.82,1')) return 'Star';
        if (refPoints?.includes('0.33,0 0.67,0 0.67,0.33 1,0.33 1,0.67')) return 'Cross';
        if (refPoints?.includes('0,0.33 0.67,0.33 0.67,0 1,0.5 0.67,1')) return 'Arrow';
        if (refPoints?.includes('0.2,0 0.8,0 1,1 0,1')) return 'Trapez';
        if (refPoints?.includes('0.2,0 1,0 0.8,1 0,1')) return 'Parallel';
        if (refPoints?.includes('0,0 0.8,0 1,0.2 1,1 0,1')) return 'Doc';
        if (refPoints?.includes('0,0 1,0 1,0.8 0.7,0.8 0.5,1')) return 'Callout';
        if (refPoints?.includes('0,0 0.5,0 0.5,0.2 0.2,0.2 0.2,1 0,1')) return 'L-Shape';
        if (refPoints?.includes('0,0 0.2,0 0.2,0.8 0.8,0.8 0.8,0 1,0 1,1 0,1')) return 'U-Shape';
        return 'Polygon';
      }
      default: return 'Shape';
    }
  }

  private cleanupDrag(): void {
    this.isDragging = false;
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';

    if (this.dragElement) {
      document.body.removeChild(this.dragElement);
      this.dragElement = null;
    }

    // Reset opacity of all stencil elements in both papers
    const basicElements = this.basicStencil.nativeElement.querySelectorAll('[model-id]');
    const advancedElements = this.advancedStencil.nativeElement.querySelectorAll('[model-id]');
    
    [...basicElements, ...advancedElements].forEach((el: any) => {
      el.style.opacity = '1';
    });
  }

  toggleShapeCategory(category: ShapeCategory): void {
    category.expanded = !category.expanded;
  }
}