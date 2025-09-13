// UPDATED StencilService - Remove white fill from Path shapes (d points)
import { Injectable } from '@angular/core';
import * as joint from '@joint/plus';
import { JointService } from './joint.service';
import { StencilShape } from '../models/shape.model';

@Injectable({
  providedIn: 'root'
})
export class StencilService {
  constructor(private jointService: JointService) {}

  createStencilShapes(graph: joint.dia.Graph): void {
    const shapes: StencilShape[] = [
      // Row 1
      { type: 'rectangle', pos: { x: 10, y: 20 } },
      { type: 'circle', pos: { x: 50, y: 20 } },
      { type: 'ellipse', pos: { x: 90, y: 20 } },
      { type: 'diamond', pos: { x: 130, y: 20 } },
      
      // Row 2
      { type: 'triangle', pos: { x: 10, y: 60 } },
      { type: 'pentagon', pos: { x: 50, y: 60 } },
      { type: 'hexagon', pos: { x: 90, y: 60 } },
      { type: 'octagon', pos: { x: 130, y: 60 } },
      
      // Row 3
      { type: 'star', pos: { x: 10, y: 100 } },
      { type: 'cross', pos: { x: 50, y: 100 } },
      { type: 'arrow', pos: { x: 90, y: 100 } },
      { type: 'trapezoid', pos: { x: 130, y: 100 } },
      
      // Row 4
      { type: 'parallelogram', pos: { x: 10, y: 140 } },
      { type: 'cylinder', pos: { x: 50, y: 140 } },
      { type: 'document', pos: { x: 90, y: 140 } },
      { type: 'callout', pos: { x: 130, y: 140 } },

      // Row 5
      { type: 'l-shape', pos: { x: 10, y: 180 } },
      { type: 'u-shape', pos: { x: 50, y: 180 } },
      { type: 'process', pos: { x: 90, y: 180 } },

      // Row 6
      { type: 'image', pos: { x: 10, y: 220 } },
      { type: 'embedded-image', pos: { x: 50, y: 220 } },
      { type: 'headered-rectangle', pos: { x: 90, y: 220 } },
      { type: 'inscribed-image', pos: { x: 130, y: 220 } },
    ];

    shapes.forEach(shape => {
      const element = this.createStencilShape(shape);
      if (element) {
        element.attr('body/magnet', true);
        graph.addCell(element);
      }
    });
  }

  // ✅ ADD: Method to create individual stencil shapes (used by sidebar)
  createStencilShape(shape: StencilShape): any {
    const size = { width: 25, height: 25 };
    const commonAttrs = {
      body: { 
        fill: '#ffffff', 
        stroke: '#333333', 
        strokeWidth: 1.5 
      },
      label: { 
        text: '', 
        fontSize: 8,
        fill: '#333333'
      }
    };

    switch (shape.type) {
      case 'rectangle':
        return new joint.shapes.standard.Rectangle({
          position: shape.pos,
          size: size,
          attrs: commonAttrs
        });
        
      case 'circle':
        return new joint.shapes.standard.Circle({
          position: shape.pos,
          size: size,
          attrs: commonAttrs
        });
        
      case 'ellipse':
        return new joint.shapes.standard.Ellipse({
          position: shape.pos,
          size: { width: 30, height: 20 },
          attrs: commonAttrs
        });
        
      case 'diamond':
        return new joint.shapes.standard.Polygon({
          position: shape.pos,
          size: size,
          attrs: {
            body: {
              magnet: true,
              refPoints: '0.5,0 1,0.5 0.5,1 0,0.5',
              fill: '#ffffff',
              stroke: '#333333',
              strokeWidth: 1.5
            },
            label: commonAttrs.label
          }
        });

      case 'triangle':
        return new joint.shapes.standard.Polygon({
          position: shape.pos,
          size: size,
          attrs: {
            body: {
              magnet: true,
              refPoints: '0.5,0 1,1 0,1',
              fill: '#ffffff',
              stroke: '#333333',
              strokeWidth: 1.5
            },
            label: commonAttrs.label
          }
        });
        
      case 'pentagon':
        return new joint.shapes.standard.Polygon({
          position: shape.pos,
          size: size,
          attrs: {
            body: {
              magnet: true,
              refPoints: '0.5,0 1,0.38 0.81,1 0.19,1 0,0.38',
              fill: '#ffffff',
              stroke: '#333333',
              strokeWidth: 1.5
            },
            label: commonAttrs.label
          }
        });
        
      case 'hexagon':
        return new joint.shapes.standard.Polygon({
          position: shape.pos,
          size: size,
          attrs: {
            body: {
              magnet: true,
              refPoints: '0.25,0 0.75,0 1,0.5 0.75,1 0.25,1 0,0.5',
              fill: '#ffffff',
              stroke: '#333333',
              strokeWidth: 1.5
            },
            label: commonAttrs.label
          }
        });
        
      case 'octagon':
        return new joint.shapes.standard.Polygon({
          position: shape.pos,
          size: size,
          attrs: {
            body: {
              magnet: true,
              refPoints: '0.3,0 0.7,0 1,0.3 1,0.7 0.7,1 0.3,1 0,0.7 0,0.3',
              fill: '#ffffff',
              stroke: '#333333',
              strokeWidth: 1.5
            },
            label: commonAttrs.label
          }
        });
        
      case 'star':
        return new joint.shapes.standard.Polygon({
          position: shape.pos,
          size: size,
          attrs: {
            body: {
              magnet: true,
              refPoints: '0.5,0 0.63,0.38 1,0.38 0.69,0.59 0.82,1 0.5,0.75 0.18,1 0.31,0.59 0,0.38 0.37,0.38',
              fill: '#ffffff',
              stroke: '#333333',
              strokeWidth: 1.5
            },
            label: commonAttrs.label
          }
        });
        
      case 'cross':
        return new joint.shapes.standard.Polygon({
          position: shape.pos,
          size: size,
          attrs: {
            body: {
              magnet: true,
              refPoints: '0.33,0 0.67,0 0.67,0.33 1,0.33 1,0.67 0.67,0.67 0.67,1 0.33,1 0.33,0.67 0,0.67 0,0.33 0.33,0.33',
              fill: '#ffffff',
              stroke: '#333333',
              strokeWidth: 1.5
            },
            label: commonAttrs.label
          }
        });
        
      case 'arrow':
        return new joint.shapes.standard.Polygon({
          position: shape.pos,
          size: size,
          attrs: {
            body: {
              magnet: true,
              refPoints: '0,0.33 0.67,0.33 0.67,0 1,0.5 0.67,1 0.67,0.67 0,0.67',
              fill: '#ffffff',
              stroke: '#333333',
              strokeWidth: 1.5
            },
            label: commonAttrs.label
          }
        });
        
      // ✅ REMOVED: All Path shapes with d points
      // - heart
      // - cloud  
      // - cube
      // - internal-storage
      // - vertical-container
      // - horizontal-container
      // - stacked-docs
        
      case 'trapezoid':
        return new joint.shapes.standard.Polygon({
          position: shape.pos,
          size: size,
          attrs: {
            body: {
              magnet: true,
              refPoints: '0.2,0 0.8,0 1,1 0,1',
              fill: '#ffffff',
              stroke: '#333333',
              strokeWidth: 1.5
            },
            label: commonAttrs.label
          }
        });
        
      case 'parallelogram':
        return new joint.shapes.standard.Polygon({
          position: shape.pos,
          size: size,
          attrs: {
            body: {
              magnet: true,
              refPoints: '0.2,0 1,0 0.8,1 0,1',
              fill: '#ffffff',
              stroke: '#333333',
              strokeWidth: 1.5
            },
            label: commonAttrs.label
          }
        });
        
      case 'cylinder':
        return new joint.shapes.standard.Cylinder({
          position: shape.pos,
          size: size,
          attrs: {
            body: { magnet: true, fill: '#ffffff', stroke: '#333333', strokeWidth: 1.5 },
            top: { fill: '#ffffff', stroke: '#333333', strokeWidth: 1.5 },
            label: commonAttrs.label
          }
        });
        
      case 'document':
        return new joint.shapes.standard.Polygon({
          position: shape.pos,
          size: size,
          attrs: {
            body: {
              magnet: true,
              refPoints: '0,0 0.8,0 1,0.2 1,1 0,1',
              fill: '#ffffff',
              stroke: '#333333',
              strokeWidth: 1.5
            },
            label: commonAttrs.label
          }
        });

      case 'callout':
        return new joint.shapes.standard.Polygon({
          position: shape.pos,
          size,
          attrs: {
            body: {
              magnet: true,
              refPoints: '0,0 1,0 1,0.8 0.7,0.8 0.5,1 0.5,0.8 0,0.8',
              fill: '#ffffff',
              stroke: '#333333',
              strokeWidth: 1.5
            },
            label: commonAttrs.label
          }
        });

      case 'process':
        return new joint.shapes.standard.Rectangle({
          position: shape.pos,
          size,
          attrs: {
            body: {
              magnet: true,
              fill: '#ffffff',
              stroke: '#333333',
              strokeWidth: 1.5
            },
            label: {
              text: 'Process',
              fontSize: 8,
              fill: '#333333'
            }
          }
        });

      case 'l-shape':
        return new joint.shapes.standard.Polygon({
          position: shape.pos,
          size,
          attrs: {
            body: {
              magnet: true,
              refPoints: '0,0 0.5,0 0.5,0.2 0.2,0.2 0.2,1 0,1',
              fill: '#ffffff',
              stroke: '#333333',
              strokeWidth: 1.5
            },
            label: commonAttrs.label
          }
        });

      case 'u-shape':
        return new joint.shapes.standard.Polygon({
          position: shape.pos,
          size,
          attrs: {
            body: {
              magnet: true,
              refPoints: '0,0 0.2,0 0.2,0.8 0.8,0.8 0.8,0 1,0 1,1 0,1',
              fill: '#ffffff',
              stroke: '#333333',
              strokeWidth: 1.5
            },
            label: commonAttrs.label
          }
        });

      case 'image':
        return new joint.shapes.standard.Image({
          position: shape.pos,
          size: { width: 25, height: 25 },
          attrs: {
            image: { xlinkHref: 'assets/image-icon1.svg' },
            body: { fill: '#ffffff', stroke: '#333333', strokeWidth: 1.5 },
            label: { text: '', fontSize: 8, fill: '#333333' }
          }
        });

      case 'embedded-image':
        return new joint.shapes.standard.EmbeddedImage({
          position: shape.pos,
          size: { width: 25, height: 25 },
          attrs: {
            body: { stroke: '#333333', strokeWidth: 1.5 },
            image: {
              xlinkHref: 'assets/image-icon1.svg',
              width: 'calc(0.4 * w)',
              height: 'calc(h)',
              x: 3,
              y: 0
            },
            label: { text: '', fontSize: 8, fill: '#333333' }
          }
        });

      case 'headered-rectangle':
        return new joint.shapes.standard.HeaderedRectangle({
          position: shape.pos,
          size: { width: 37, height: 25 },
          attrs: {
            body: {
              fill: '#ffffff',
              stroke: '#333333',
              strokeWidth: 1.5
            },
            header: {
              fill: '#333333',
              stroke: '#333333',
              strokeWidth: 1.5,
              height: 10
            },
            headerText: {
              text: 'header',
              fill: '#ffffff',
              fontSize: 7,
              y: 5
            },
            bodyText: {
              text: 'Description',
              fill: '#333333',
              fontSize: 7,
              y: 20
            }
          }
        });

      case 'inscribed-image':
        return new joint.shapes.standard.InscribedImage({
          position: shape.pos,
          size: { width: 25, height: 25 },
          attrs: {
            border: {
              stroke: '#333333',
              strokeWidth: 1.5
            },
            background: { fill: '#ffffff' },
            image: { xlinkHref: 'assets/image-icon1.svg' },
            label: { text: '', fontSize: 8, fill: '#333333' }
          }
        });

      default:
        console.warn(`Unknown shape type: ${shape.type}`);
        return null;
    }
  }

  createShapeFromStencil(shapeData: any, position: any): any {
    const newSize = { width: 80, height: 60 };
    const centerPosition = { 
      x: position.x - newSize.width/2, 
      y: position.y - newSize.height/2 
    };

    const shapeType = this.getShapeTypeFromStencil(shapeData);

    switch (shapeType) {
      case 'rectangle':
        return new joint.shapes.standard.Rectangle({
          position: centerPosition,
          size: newSize,
          attrs: {
            body: { magnet: true, fill: '#ffffff', stroke: '#000000', strokeWidth: 2 },
            label: { text: 'Rectangle', fontSize: 14, fill: '#000000' }
          }
        });

      case 'circle':
        return new joint.shapes.standard.Circle({
          position: centerPosition,
          size: newSize,
          attrs: {
            body: { magnet: true, fill: '#ffffff', stroke: '#000000', strokeWidth: 2 },
            label: { text: 'Circle', fontSize: 14, fill: '#000000' }
          }
        });

      case 'ellipse':
        return new joint.shapes.standard.Ellipse({
          position: centerPosition,
          size: newSize,
          attrs: {
            body: { magnet: true, fill: '#ffffff', stroke: '#000000', strokeWidth: 2 },
            label: { text: 'Ellipse', fontSize: 14, fill: '#000000' }
          }
        });

      case 'cylinder':
        return new joint.shapes.standard.Cylinder({
          position: centerPosition,
          size: newSize,
          attrs: {
            body: { magnet: true, fill: '#ffffff', stroke: '#000000', strokeWidth: 2 },
            top: { fill: '#ffffff', stroke: '#000000', strokeWidth: 2 },
            label: { text: 'Cylinder', fontSize: 14, fill: '#000000' }
          }
        });

      // ✅ POLYGON SHAPES - Use normal resize (refPoints scale automatically)
      case 'diamond':
        return new joint.shapes.standard.Polygon({
          position: centerPosition,
          size: newSize,
          attrs: {
            body: {
              magnet: true,
              refPoints: '0.5,0 1,0.5 0.5,1 0,0.5',
              fill: '#ffffff',
              stroke: '#000000',
              strokeWidth: 2
            },
            label: { text: 'Diamond', fontSize: 14, fill: '#000000' }
          }
        });

      case 'triangle':
        return new joint.shapes.standard.Polygon({
          position: centerPosition,
          size: newSize,
          attrs: {
            body: {
              magnet: true,
              refPoints: '0.5,0 1,1 0,1',
              fill: '#ffffff',
              stroke: '#000000',
              strokeWidth: 2
            },
            label: { text: 'Triangle', fontSize: 14, fill: '#000000' }
          }
        });

      case 'pentagon':
        return new joint.shapes.standard.Polygon({
          position: centerPosition,
          size: newSize,
          attrs: {
            body: {
              magnet: true,
              refPoints: '0.5,0 1,0.38 0.81,1 0.19,1 0,0.38',
              fill: '#ffffff',
              stroke: '#000000',
              strokeWidth: 2
            },
            label: { text: 'Pentagon', fontSize: 14, fill: '#000000' }
          }
        });

      case 'hexagon':
        return new joint.shapes.standard.Polygon({
          position: centerPosition,
          size: newSize,
          attrs: {
            body: {
              magnet: true,
              refPoints: '0.25,0 0.75,0 1,0.5 0.75,1 0.25,1 0,0.5',
              fill: '#ffffff',
              stroke: '#000000',
              strokeWidth: 2
            },
            label: { text: 'Hexagon', fontSize: 14, fill: '#000000' }
          }
        });

      case 'octagon':
        return new joint.shapes.standard.Polygon({
          position: centerPosition,
          size: newSize,
          attrs: {
            body: {
              magnet: true,
              refPoints: '0.3,0 0.7,0 1,0.3 1,0.7 0.7,1 0.3,1 0,0.7 0,0.3',
              fill: '#ffffff',
              stroke: '#000000',
              strokeWidth: 2
            },
            label: { text: 'Octagon', fontSize: 14, fill: '#000000' }
          }
        });

      case 'star':
        return new joint.shapes.standard.Polygon({
          position: centerPosition,
          size: newSize,
          attrs: {
            body: {
              magnet: true,
              refPoints: '0.5,0 0.63,0.38 1,0.38 0.69,0.59 0.82,1 0.5,0.75 0.18,1 0.31,0.59 0,0.38 0.37,0.38',
              fill: '#ffffff',
              stroke: '#000000',
              strokeWidth: 2
            },
            label: { text: 'Star', fontSize: 14, fill: '#000000' }
          }
        });

      case 'cross':
        return new joint.shapes.standard.Polygon({
          position: centerPosition,
          size: newSize,
          attrs: {
            body: {
              magnet: true,
              refPoints: '0.33,0 0.67,0 0.67,0.33 1,0.33 1,0.67 0.67,0.67 0.67,1 0.33,1 0.33,0.67 0,0.67 0,0.33 0.33,0.33',
              fill: '#ffffff',
              stroke: '#000000',
              strokeWidth: 2
            },
            label: { text: 'Cross', fontSize: 14, fill: '#000000' }
          }
        });

      case 'arrow':
        return new joint.shapes.standard.Polygon({
          position: centerPosition,
          size: newSize,
          attrs: {
            body: {
              magnet: true,
              refPoints: '0,0.33 0.67,0.33 0.67,0 1,0.5 0.67,1 0.67,0.67 0,0.67',
              fill: '#ffffff',
              stroke: '#000000',
              strokeWidth: 2
            },
            label: { text: 'Arrow', fontSize: 14, fill: '#000000' }
          }
        });

      case 'trapezoid':
        return new joint.shapes.standard.Polygon({
          position: centerPosition,
          size: newSize,
          attrs: {
            body: {
              magnet: true,
              refPoints: '0.2,0 0.8,0 1,1 0,1',
              fill: '#ffffff',
              stroke: '#000000',
              strokeWidth: 2
            },
            label: { text: 'Trapezoid', fontSize: 14, fill: '#000000' }
          }
        });

      case 'parallelogram':
        return new joint.shapes.standard.Polygon({
          position: centerPosition,
          size: newSize,
          attrs: {
            body: {
              magnet: true,
              refPoints: '0.2,0 1,0 0.8,1 0,1',
              fill: '#ffffff',
              stroke: '#000000',
              strokeWidth: 2
            },
            label: { text: 'Parallelogram', fontSize: 14, fill: '#000000' }
          }
        });

      case 'document':
        return new joint.shapes.standard.Polygon({
          position: centerPosition,
          size: newSize,
          attrs: {
            body: {
              magnet: true,
              refPoints: '0,0 0.8,0 1,0.2 1,1 0,1',
              fill: '#ffffff',
              stroke: '#000000',
              strokeWidth: 2
            },
            label: { text: 'Document', fontSize: 14, fill: '#000000' }
          }
        });

      case 'callout':
        return new joint.shapes.standard.Polygon({
          position: centerPosition,
          size: newSize,
          attrs: {
            body: {
              magnet: true,
              refPoints: '0,0 1,0 1,0.8 0.7,0.8 0.5,1 0.5,0.8 0,0.8',
              fill: '#ffffff',
              stroke: '#000000',
              strokeWidth: 2
            },
            label: { text: 'Callout', fontSize: 14, fill: '#000000' }
          }
        });

      case 'l-shape':
        return new joint.shapes.standard.Polygon({
          position: centerPosition,
          size: newSize,
          attrs: {
            body: {
              magnet: true,
              refPoints: '0,0 0.5,0 0.5,0.2 0.2,0.2 0.2,1 0,1',
              fill: '#ffffff',
              stroke: '#000000',
              strokeWidth: 2
            },
            label: { text: 'L-Shape', fontSize: 14, fill: '#000000' }
          }
        });

      case 'u-shape':
        return new joint.shapes.standard.Polygon({
          position: centerPosition,
          size: newSize,
          attrs: {
            body: {
              magnet: true,
              refPoints: '0,0 0.2,0 0.2,0.8 0.8,0.8 0.8,0 1,0 1,1 0,1',
              fill: '#ffffff',
              stroke: '#000000',
              strokeWidth: 2
            },
            label: { text: 'U-Shape', fontSize: 14, fill: '#000000' }
          }
        });

      // ✅ PATH SHAPES - All removed (heart, cloud, cube, internal-storage, vertical-container, horizontal-container, stacked-docs)

      case 'process':
        return new joint.shapes.standard.Rectangle({
          position: centerPosition,
          size: newSize,
          attrs: {
            body: { magnet: true, fill: '#ffffff', stroke: '#000000', strokeWidth: 2 },
            label: { text: 'Process', fontSize: 14, fill: '#000000' }
          }
        });

      // ✅ IMAGE SHAPES
      case 'image':
        return new joint.shapes.standard.Image({
          position: centerPosition,
          size: newSize,
          attrs: {
            image: { xlinkHref: 'assets/image-icon1.svg' },
            body: { fill: '#ffffff', stroke: '#000000', strokeWidth: 2 },
            label: { text: 'Image', fontSize: 14, fill: '#000000' }
          }
        });

      case 'embedded-image':
        return new joint.shapes.standard.EmbeddedImage({
          position: centerPosition,
          size: newSize,
          attrs: {
            body: { stroke: '#000000', strokeWidth: 2 },
            image: {
              xlinkHref: 'assets/image-icon1.svg',
              width: 'calc(0.4 * w)',
              height: 'calc(h)',
              x: 3,
              y: 0
            },
            label: { text: 'Embedded', fontSize: 14, fill: '#000000' }
          }
        });

      case 'headered-rectangle':
        return new joint.shapes.standard.HeaderedRectangle({
          position: centerPosition,
          size: newSize,
          attrs: {
            body: {
              fill: '#ffffff',
              stroke: '#000000',
              strokeWidth: 2
            },
            header: {
              fill: '#000000',
              stroke: '#000000',
              strokeWidth: 2,
              height: 15
            },
            headerText: {
              text: 'Header',
              fill: '#ffffff',
              fontSize: 12,
              y: 8
            },
            bodyText: {
              text: 'Content',
              fill: '#000000',
              fontSize: 12,
              y: 40
            }
          }
        });

      case 'inscribed-image':
        return new joint.shapes.standard.InscribedImage({
          position: centerPosition,
          size: newSize,
          attrs: {
            border: {
              stroke: '#000000',
              strokeWidth: 2
            },
            background: { fill: '#ffffff' },
            image: { xlinkHref: 'assets/image-icon1.svg' },
            label: { text: 'Inscribed', fontSize: 14, fill: '#000000' }
          }
        });

      default:
        return new joint.shapes.standard.Rectangle({
          position: centerPosition,
          size: newSize,
          attrs: {
            body: { magnet: true, fill: '#ffffff', stroke: '#000000', strokeWidth: 2 },
            label: { text: shapeType || 'Shape', fontSize: 14, fill: '#000000' }
          }
        });
    }
  }

  private getShapeTypeFromStencil(shapeData: any): string {
    const type = shapeData.get('type');

    if (type === 'standard.Rectangle') return 'rectangle';
    if (type === 'standard.Circle') return 'circle';
    if (type === 'standard.Ellipse') return 'ellipse';
    if (type === 'standard.Cylinder') return 'cylinder';
    if (type === 'standard.Image') return 'image';
    if (type === 'standard.EmbeddedImage') return 'embedded-image';
    if (type === 'standard.HeaderedRectangle') return 'headered-rectangle';
    if (type === 'standard.InscribedImage') return 'inscribed-image';
    
    if (type === 'standard.Path') {
      // ✅ REMOVED: All Path shape detection since we removed them
      return 'path';
    }
    
    if (type === 'standard.Polygon') {
      const refPoints = shapeData.get('attrs')?.body?.refPoints;
      if (refPoints?.includes('0.5,0 1,0.5 0.5,1 0,0.5')) return 'diamond';
      if (refPoints?.includes('0.5,0 1,1 0,1')) return 'triangle';
      if (refPoints?.includes('0.5,0 1,0.38 0.81,1 0.19,1 0,0.38')) return 'pentagon';
      if (refPoints?.includes('0.25,0 0.75,0 1,0.5 0.75,1 0.25,1 0,0.5')) return 'hexagon';
      if (refPoints?.includes('0.3,0 0.7,0 1,0.3 1,0.7 0.7,1 0.3,1 0,0.7 0,0.3')) return 'octagon';
      if (refPoints?.includes('0.5,0 0.63,0.38 1,0.38 0.69,0.59 0.82,1')) return 'star';
      if (refPoints?.includes('0.33,0 0.67,0 0.67,0.33 1,0.33 1,0.67')) return 'cross';
      if (refPoints?.includes('0,0.33 0.67,0.33 0.67,0 1,0.5 0.67,1')) return 'arrow';
      if (refPoints?.includes('0.2,0 0.8,0 1,1 0,1')) return 'trapezoid';
      if (refPoints?.includes('0.2,0 1,0 0.8,1 0,1')) return 'parallelogram';
      if (refPoints?.includes('0,0 0.8,0 1,0.2 1,1 0,1')) return 'document';
      if (refPoints?.includes('0,0 1,0 1,0.8 0.7,0.8 0.5,1')) return 'callout';
      if (refPoints?.includes('0,0 0.5,0 0.5,0.2 0.2,0.2 0.2,1 0,1')) return 'l-shape';
      if (refPoints?.includes('0,0 0.2,0 0.2,0.8 0.8,0.8 0.8,0 1,0 1,1 0,1')) return 'u-shape';
      return 'polygon';
    }

    return 'rectangle';
  }
}