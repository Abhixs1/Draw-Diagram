import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateDiagramDto } from '../models/diagram.model';
import { map, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiagramService {
  private baseUrl = 'https://localhost:4200/';

  constructor(private http: HttpClient) {}

  saveDiagram(dto: CreateDiagramDto): Observable<any> {
    return this.http.post(this.baseUrl, dto);
  }

  getDiagramVersions(profileName: string, diagramName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/versions/${profileName}/${diagramName}`);
  }

  loadSpecificVersion(name: string, version: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${name}/${version}`);
  }

  loadLatestDiagram(profileName: string): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrl}/user/${profileName}`).pipe(
      map(documents => {
        if (!documents.length) throw new Error('No diagrams found');
        const latest = documents.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];
        return latest;
      }),
      switchMap((latest: any) =>
        this.http.get<any>(`${this.baseUrl}/${latest.name}/${latest.version}`)
      )
    );
  }

// ✅ Fixed: Use consistent base URL
  getLatestDiagramsForUser(profileName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/user/${profileName}`);
  }

  // ✅ New method to get unique diagrams (latest version of each diagram)
  getUniqueLatestDiagramsForUser(profileName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/user/${profileName}`).pipe(
      map(documents => {
        // Group by diagram name and get latest version of each
        const diagramMap = new Map();
        
        documents.forEach(doc => {
          const existing = diagramMap.get(doc.name);
          if (!existing || doc.version > existing.version) {
            diagramMap.set(doc.name, doc);
          }
        });
        
        return Array.from(diagramMap.values());
      })
    );
  }

  deleteVersion(profileName: string, modelName: string, version: number): Observable<any> {
  return this.http.delete(`${this.baseUrl}/${profileName}/${modelName}/${version}`);
 }
 getTemplate(templateName: string): Observable<any> {
  return this.http.get(`/assets/templates/${templateName}.json`);
}


}
