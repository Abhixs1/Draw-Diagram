// paper.service.ts - Enhanced with Arrow Property Support
import { Injectable } from '@angular/core';
import * as joint from '@joint/plus';
import { ui } from '@joint/plus';

@Injectable({
  providedIn: 'root'
})
export class PaperService {
  private isArrowMode = false;

   
  setupPaperEvents(
    paper: joint.dia.Paper,
    onElementClick: (element: any) => void,
    onBlankClick: () => void
  ): void {

  //    paper.on('element:pointerclick', (elementView: any) => {
  //   const element = elementView.model;
  //   const type = element.get('type');

  //   if (
  //     type === 'standard.Image' ||
  //     type === 'standard.EmbeddedImage' ||
  //     type === 'standard.InscribedImage'
  //   ) {
  //     this.promptImageUpload(element);
  //   }
  // });
  
    // FIXED: Element click handler that respects arrow mode
paper.on('element:pointerdown', (elementView, evt) => {
  if (evt.button !== 0) return;

  // Call canvas click handler
  onElementClick(elementView.model);

  // FreeTransform only if NOT in arrow mode
  if (!this.isArrowMode) {
    this.removeExistingFreeTransform(elementView);

    const freeTransform = new ui.FreeTransform({
      graph: paper.model,
      paper,
      cell: elementView.model,
      useModelGeometry: true,
      rotate: false,
      allowRotation: false,
      preserveAspectRatio: false,
      allowOrthogonalResize: true,
      allowTranslation: true,
    });

    freeTransform.render();
    (elementView as any).freeTransform = freeTransform;
  }
  const element = elementView.model;
const type = element.get('type');

if (
  type === 'standard.Image' ||
  type === 'standard.EmbeddedImage' ||
  type === 'standard.InscribedImage'
) {
  this.promptImageUpload(element);
}

});

 
    paper.on('blank:pointerclick', () => {
      onBlankClick();
    });
 
    // Keep the context menu functionality
    // paper.on('element:contextmenu', (elementView: joint.dia.ElementView) => {
    //   const source = elementView.model;
    //   const allElements = source.graph?.getElements() || [];
    //   const target = allElements.find(el => el.id !== source.id);
 
    //   if (!target) {
    //     console.warn('No other element found to connect to');
    //     return;
    //   }
 
    //   source.attr('body/magnet', true);
    //   target.attr('body/magnet', true);
 
    //   const link = new joint.shapes.standard.Link();
    //   link.source(source);
    //   link.target(target);
    //   link.router('orthogonal');
    //   link.connector('straight', { cornerType: 'line' });
 
    //   source.graph?.addCell(link);
    //   paper.setInteractivity({ elementMove: true });
    // });
 
    paper.on('tool:remove', (toolView: any) => {
      const elementView = toolView.parentView;
      const element = elementView.model;
 
      if ((elementView as any).resizeHandles) {
        (elementView as any).resizeHandles.forEach((handle: HTMLElement) => {
          handle.parentNode?.removeChild(handle);
        });
        (elementView as any).resizeHandles = [];
      }
 
      if ((elementView as any).handleUpdateFunction) {
        element.off('change:position', (elementView as any).handleUpdateFunction);
        element.off('change:size', (elementView as any).handleUpdateFunction);
        (elementView as any).handleUpdateFunction = null;
      }
    });
  }
  setArrowMode(isArrowMode: boolean): void {
    this.isArrowMode = isArrowMode;
  }

  private removeExistingFreeTransform(elementView: any): void {
    if ((elementView as any).freeTransform) {
      (elementView as any).freeTransform.remove();
      (elementView as any).freeTransform = null;
    }
  }

  setupGraphEvents(
    graph: joint.dia.Graph,
    onCellChange: (cell: any) => void,
    paper?: joint.dia.Paper
  ): void {
    graph.on('change', (cell: any) => {
      onCellChange(cell);
    });

    if (paper) {
      graph.on('remove', (cell: any) => {
        if (cell.isElement && cell.isElement()) {
          const elementView = paper.findViewByModel(cell);
          if (elementView && (elementView as any).resizeHandles) {
            (elementView as any).resizeHandles.forEach((handle: HTMLElement) => {
              if (handle.parentNode) {
                handle.parentNode.removeChild(handle);
              }
            });
            (elementView as any).resizeHandles = [];
            
            if ((elementView as any).handleUpdateFunction) {
              cell.off('change:position', (elementView as any).handleUpdateFunction);
              cell.off('change:size', (elementView as any).handleUpdateFunction);
              (elementView as any).handleUpdateFunction = null;
            }
          }
        }
      });
    }
  }

  selectElement(paper: joint.dia.Paper, element: any): void {
    this.deselectAllElements(paper);
    this.deselectAllArrows(paper);

    if (element.isLink && element.isLink()) {
      // It's an arrow
      this.selectArrow(paper, element);
    } else {
      // It's a shape
      const elementView = paper.findViewByModel(element);
      if (elementView) {
        elementView.el.style.outline = '2px solid #0969da';
        elementView.el.style.outlineOffset = '2px';
        elementView.el.style.filter = 'drop-shadow(0 0 8px rgba(9, 105, 218, 0.3))';

        if (!this.isArrowMode) {
          const freeTransform = new ui.FreeTransform({
            graph: paper.model,
            paper,
            cell: element,
          });

          (elementView as any).freeTransform = freeTransform;
          freeTransform.render();
        }
      }
    }
  }

  selectArrow(paper: joint.dia.Paper, arrow: any): void {
    // Store original style
    const currentStroke = arrow.attr('line/stroke') || '#333333';
    const currentStrokeWidth = arrow.attr('line/strokeWidth') || 2;
    
    arrow.prop('originalStroke', currentStroke);
    arrow.prop('originalStrokeWidth', currentStrokeWidth);
    
    // Apply selection style
    arrow.attr({
      line: {
        stroke: '#0969da',
        strokeWidth: currentStrokeWidth + 1,
        strokeDasharray: arrow.attr('line/strokeDasharray') // Preserve dash pattern
      }
    });
  }

  deselectAllElements(paper: joint.dia.Paper): void {
    const elements = paper.model.getElements();
    elements.forEach((element: any) => {
      const elementView = paper.findViewByModel(element);
      if (elementView) {
        elementView.el.style.outline = 'none';
        elementView.el.style.filter = 'none';

        elementView.removeTools();

        if ((elementView as any).freeTransform) {
          (elementView as any).freeTransform.remove();
          (elementView as any).freeTransform = null;
        }
      }
    });
  }

  deselectAllArrows(paper: joint.dia.Paper): void {
    const links = paper.model.getLinks();
    links.forEach((link: any) => {
      const originalStroke = link.prop('originalStroke') || '#333333';
      const originalStrokeWidth = link.prop('originalStrokeWidth') || 2;
      
      link.attr({
        line: {
          stroke: originalStroke,
          strokeWidth: originalStrokeWidth,
          strokeDasharray: link.attr('line/strokeDasharray') // Preserve dash pattern
        }
      });
    });
  }

  cleanupAllResizeHandles(paper: joint.dia.Paper): void {
    const resizeHandles = paper.el.querySelectorAll('div[style*="background: #0969da"]');
    resizeHandles.forEach((handle: Element) => {
      if (handle.parentNode) {
        handle.parentNode.removeChild(handle);
      }
    });

    const elements = paper.model.getElements();
    elements.forEach((element: any) => {
      const elementView = paper.findViewByModel(element);
      if (elementView) {
        elementView.removeTools();

        if ((elementView as any).handleUpdateFunction) {
          element.off('change:position', (elementView as any).handleUpdateFunction);
          element.off('change:size', (elementView as any).handleUpdateFunction);
          (elementView as any).handleUpdateFunction = null;
        }

        if ((elementView as any).resizeHandles) {
          (elementView as any).resizeHandles.forEach((handle: HTMLElement) => {
            if (handle.parentNode) {
              handle.parentNode.removeChild(handle);
            }
          });
          (elementView as any).resizeHandles = [];
        }
      }
    });
  }

  // Enhanced property update methods
  updateElementProperty(element: any, property: string, value: any): void {
    if (element.isLink && element.isLink()) {
      // It's an arrow
      this.updateArrowProperty(element, property, value);
    } else {
      // It's a shape
      this.updateShapeProperty(element, property, value);
    }
  }

  private updateShapeProperty(element: any, property: string, value: any): void {
    switch (property) {
      case 'text':
        element.attr('label/text', value);
        break;
      case 'fill':
        element.attr('body/fill', value);
        break;
      case 'outline':
        element.attr('body/stroke', value);
        break;
      case 'outlineThickness':
        element.attr('body/strokeWidth', value);
        break;
      case 'outlineStyle':  // ADD THIS CASE
        if (value === 'dashed') {
          element.attr('body/strokeDasharray', '5,5');
        } else if (value === 'dotted') {
          element.attr('body/strokeDasharray', '2,2');
        } else {
          element.attr('body/strokeDasharray', 'none');
        }
        break;
      case 'fontSize':
        element.attr('label/fontSize', value);
        break;
      case 'fontFamily':
        element.attr('label/fontFamily', value);
        break;
      case 'textColor':
        element.attr('label/fill', value);
        break;
    }
  }

  private updateArrowProperty(arrow: any, property: string, value: any): void {
    const currentProps = arrow.prop('arrowProperties') || {};
    currentProps[property] = value;
    
    // Apply the property change
    this.applyArrowProperties(arrow, currentProps);
    
    // Update stored properties
    arrow.prop('arrowProperties', currentProps);
  }

  private applyArrowProperties(arrow: any, properties: any): void {
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
    } else {
      attrs.line.strokeDasharray = 'none';
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

    // Routing
    if (properties.routing === 'orthogonal') {
      arrow.router('orthogonal');
    } else if (properties.routing === 'manhattan') {
      arrow.router('manhattan');
    } else {
      arrow.router('normal');
    }

    // Label
    if (properties.label && properties.label.trim()) {
      const labelAttrs: any = {
        text: {
          text: properties.label,
          fontSize: 12,
          fill: properties.color || '#333333',
          textAnchor: 'middle',
          textVerticalAnchor: 'middle'
        }
      };
      
      if (properties.labelBackground) {
        labelAttrs.rect = {
          fill: 'white',
          stroke: properties.color || '#333333',
          strokeWidth: 1,
          rx: 3,
          ry: 3
        };
      }
      
      arrow.labels([{
        position: properties.labelPosition || 0.5,
        attrs: labelAttrs
      }]);
    } else {
      arrow.labels([]);
    }

    arrow.attr(attrs);
    
    // Store original properties for selection/deselection
    arrow.prop('originalStroke', properties.color);
    arrow.prop('originalStrokeWidth', properties.thickness);
  }

  getElementProperties(element: any): any {
    if (element.isLink && element.isLink()) {
      // It's an arrow
      return this.getArrowProperties(element);
    } else {
      // It's a shape
      return this.getShapeProperties(element);
    }
  }

  private getShapeProperties(element: any): any {
    const attrs = element.get('attrs');
    const strokeDasharray = attrs.body?.strokeDasharray;
    
    // Determine outline style from strokeDasharray
    let outlineStyle = 'solid';
    if (strokeDasharray && strokeDasharray !== 'none') {
      if (strokeDasharray.includes('5,5')) {
        outlineStyle = 'dashed';
      } else if (strokeDasharray.includes('2,2')) {
        outlineStyle = 'dotted';
      }
    }
    
    return {
      fill: attrs.body?.fill || '#ffffff',
      outline: attrs.body?.stroke || '#000000',
      outlineThickness: attrs.body?.strokeWidth || 2,
      outlineStyle: outlineStyle,  // UPDATED
      text: attrs.label?.text || '',
      fontSize: attrs.label?.fontSize || 14,
      fontFamily: attrs.label?.fontFamily || 'Arial',
      fontThickness: 1,
      textColor: attrs.label?.fill || '#000000'
    };
  }

  private getArrowProperties(arrow: any): any {
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

  // Utility method to create arrow with properties
  createArrowWithProperties(source: any, target: any, properties: any, graph: joint.dia.Graph): void {
    const link = new joint.shapes.standard.Link();
    link.source(source);
    link.target(target);
    
    // Store properties
    link.prop('arrowProperties', properties);
    
    // Apply properties
    this.applyArrowProperties(link, properties);
    
    graph.addCell(link);
  }

   promptImageUpload(element: joint.dia.Element): void {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.style.display = 'none';

  input.addEventListener('change', (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imageData = e.target.result;

        // Set base64 image to the appropriate attribute
        const type = element.get('type');
        if (type === 'standard.Image') {
          element.attr('image/xlinkHref', imageData);
        } else if (type === 'standard.EmbeddedImage') {
          element.attr('image/xlinkHref', imageData);
        } else if (type === 'standard.InscribedImage') {
          element.attr('image/xlinkHref', imageData);
        }
      };
      reader.readAsDataURL(file);
    }
  });

  document.body.appendChild(input);
  input.click();
  document.body.removeChild(input);
}

}