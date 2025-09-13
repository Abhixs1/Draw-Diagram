import { Injectable } from '@angular/core';
import * as joint from '@joint/plus';
import { dia, shapes } from '@joint/plus';

@Injectable({
  providedIn: 'root'
})
export class JointService {
  createGraph(): joint.dia.Graph {
    return new joint.dia.Graph({}, { cellNamespace: shapes });
  }
createPaper(element: HTMLElement, graph: joint.dia.Graph): joint.dia.Paper {
  // Set dotted background via inline SVG

  const paper = new joint.dia.Paper({
    el: element,
    model: graph,
    width: 3000,
    height: 3000,
    async: true,
    sorting: joint.dia.Paper.sorting.APPROX,
    gridSize: 20,
        drawGrid: {
      name: 'dot', // ✅ this enables dotted grid
      args: {
        color: '#ccc', // dot color
        thickness: 2,
        scaleFactor: 1 // how the grid scales when zooming
      }
    },
    background: {
      color: '#ffffff' // Optional: sets paper color
    },
    cellViewNamespace: joint.shapes,
    defaultConnectionPoint: { name: 'boundary' },
    defaultConnector: { name: 'rounded' },
    interactive: {
      linkMove: false,
      elementMove: true,
      addLinkFromMagnet: false
    },
    elementView: joint.dia.ElementView.extend({
      pointerdblclick: function () {
        // Optional: Enable text editing on double-click
      }
    })
  });

  return paper; // ✅ Don't forget this
}


createPaperScroller(paper: joint.dia.Paper): joint.ui.PaperScroller {
  const scroller = new joint.ui.PaperScroller({
    paper,
    autoResizePaper: true,
    autoScrollOnDrag: true,
    padding: 100,
    baseWidth: 5000,
    baseHeight: 5000,
    cursor: 'grab',
    scrollWhileDragging: true
  });


  // 👇 Append paper manually to scroller
  return scroller;
}

 createLink(source: dia.Element, target: dia.Element): dia.Link {
    const link = new shapes.standard.Link();
    link.source(source);
    link.target(target);
    link.attr('line/stroke', '#353535');
    link.router('orthogonal');
    link.connector('straight', { cornerType: 'line' });

    // Optional label on the link
    link.appendLabel({
      attrs: {
        text: {
          text: 'to the',
          fill: '#000000',
          fontSize: 14
        },
        rect: {
          fill: '#ffffff'
        }
      },
      position: {
        distance: 0.5, // Center of the link
      }
    });

    return link;
  }
 
  createStencilPaper(element: HTMLElement, graph: joint.dia.Graph): joint.dia.Paper {
    element.style.backgroundColor = '#ffffff';
 
    return new joint.dia.Paper({
      el: element,
      model: graph,
      width: 170,
      height: 400,
      gridSize: 1,
      interactive: false
    });
  }
 
  createRectangle(position: any, size: any, attrs?: any): joint.shapes.standard.Rectangle {
    return new joint.shapes.standard.Rectangle({
      position,
      size,
      attrs: attrs || {
        body: { fill: '#ffffff', stroke: '#000000', strokeWidth: 2 },
        label: { text: 'Rectangle', fill: '#000000', fontSize: 14 }
      }
    });
  }
 
  createCircle(position: any, size: any, attrs?: any): joint.shapes.standard.Circle {
    return new joint.shapes.standard.Circle({
      position,
      size,
      attrs: attrs || {
        body: { fill: '#ffffff', stroke: '#000000', strokeWidth: 2 },
        label: { text: 'Circle', fill: '#000000', fontSize: 14 }
      }
    });
  }
 
  createEllipse(position: any, size: any, attrs?: any): joint.shapes.standard.Ellipse {
    return new joint.shapes.standard.Ellipse({
      position,
      size,
      attrs: attrs || {
        body: { fill: '#ffffff', stroke: '#000000', strokeWidth: 2 },
        label: { text: 'Ellipse', fill: '#000000', fontSize: 14 }
      }
    });
  }
 
  createPolygon(position: any, size: any, refPoints: string, attrs?: any): joint.shapes.standard.Polygon {
    return new joint.shapes.standard.Polygon({
      position,
      size,
      attrs: attrs || {
        body: {
          refPoints,
          fill: '#ffffff',
          stroke: '#000000',
          strokeWidth: 2
        },
        label: { text: 'Polygon', fill: '#000000', fontSize: 14 }
      }
    });
  }
 
  createPath(position: any, size: any, pathData: string, attrs?: any): joint.shapes.standard.Path {
    return new joint.shapes.standard.Path({
      position,
      size,
      attrs: attrs || {
        body: {
          d: pathData,
          fill: '#ffffff',
          stroke: '#000000',
          strokeWidth: 2
        },
        label: { text: 'Heart', fill: '#000000', fontSize: 8 }
      }
    });
  }
 
  createCylinder(position: any, size: any, attrs?: any): joint.shapes.standard.Cylinder {
    return new joint.shapes.standard.Cylinder({
      position,
      size,
      attrs: attrs || {
        body: { fill: '#ffffff', stroke: '#000000', strokeWidth: 2 },
        top: { fill: '#ffffff', stroke: '#000000', strokeWidth: 2 },
        label: { text: 'Cylinder', fill: '#000000', fontSize: 8 }
      }
    });
  }
}
 