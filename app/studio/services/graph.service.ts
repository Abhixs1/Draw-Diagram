// src/app/core/joint/graph.service.ts
import { Injectable } from '@angular/core';
import * as joint from '@joint/plus';

@Injectable({
  providedIn: 'root'
})
export class GraphService {
  clearGraph(graph: joint.dia.Graph): void {
    graph.clear();
  }

  exportGraph(graph: joint.dia.Graph): string {
    return JSON.stringify(graph.toJSON(), null, 2);
  }

  importGraph(graph: joint.dia.Graph, jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      graph.fromJSON(data);
      return true;
    } catch (error) {
      console.error('Failed to import graph:', error);
      return false;
    }
  }

  addElement(graph: joint.dia.Graph, element: any): void {
    graph.addCell(element);
  }

  removeElement(graph: joint.dia.Graph, element: any): void {
    element.remove();
  }

  getElementsByType(graph: joint.dia.Graph, type: string): any[] {
    return graph.getElements().filter((element: any) => 
      element.get('type') === type
    );
  }

  getElementCount(graph: joint.dia.Graph): number {
    return graph.getElements().length;
  }

  getLinkCount(graph: joint.dia.Graph): number {
    return graph.getLinks().length;
  }
}