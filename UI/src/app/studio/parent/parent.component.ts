
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { CanvasComponent } from '../components/canvas/canvas.component';
import { PropertiesPanelComponent } from '../components/properties-panel/properties-panel.component';
import { ZoomControlsComponent } from '../components/zoom-controls/zoom-controls.component';
import { dia } from '@joint/plus';
import { FormsModule } from '@angular/forms'; // ✅ Add this at the top
import { DiagramService } from '../services/diagram.service';  
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { ViewChild, TemplateRef } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MsalService } from '@azure/msal-angular';
import { GraphSService } from '../../studio/services/graph-s.service';  // Adjust path if needed
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { GraphService } from '../services/graph.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Renderer2 } from '@angular/core';


@Component({
  selector: 'app-parent',
standalone: true,
 
  imports: [
    MatFormFieldModule,
    MatTabsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    CommonModule,
    SidebarComponent,
    FormsModule, 
    CanvasComponent,
    PropertiesPanelComponent,
    ZoomControlsComponent,
    RouterModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
  ],
  templateUrl: './parent.component.html',
  styleUrl: './parent.component.css'
})
export class ParentComponent {

  showSaveForm = false; 
  userName: string = '';
  userPrincipalName: string = '';
  userPhotoUrl?: SafeUrl;
  isProfileLoaded = false;
  diagramName: string = '';
  diagramDescription: string = '';
  activeTabIndex = 0;
  files: { id: string, name: string, data: string | null }[] = [];
  previousTabIndex = 0;
  renameTabIndex: number | null = null;
  versionList: number[] = [];
  versionNumber: number = 1; // or dynamically fetched
  
  @ViewChild('versionsDialog') versionsDialog!: TemplateRef<any>;
selectedDiagramVersions: number[] = [];
@ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;
selectedContextTabIndex: number | null = null;
menuTop = 0;
menuLeft = 0;

graph!: joint.dia.Graph;




  constructor(
  private msalService: MsalService,
  private graphSService: GraphSService,
  private sanitizer: DomSanitizer,
  private diagramService: DiagramService,
  private graphService: GraphService,
  public dialog: MatDialog,private renderer: Renderer2
) {}

  ngOnInit(): void {
    this.loadUserProfile();
     this.generateVersionList();
       const diagramData = localStorage.getItem('diagram');
  if (diagramData) {
    try {
      const parsed = JSON.parse(diagramData);
      this.graphService.importGraph(this.graph, JSON.stringify(parsed.data || parsed));

    } catch (e) {
      console.error('Failed to parse diagram data:', e);
    }
  } else {
    console.warn('No diagram found in localStorage');
  }
  }
  downloadPDF() {
  const canvasElement = document.getElementById('canvas-area'); // ✅ now it will find the element

  if (!canvasElement) {
    console.error('Canvas area not found!');
    return;
  }

  html2canvas(canvasElement, {
    backgroundColor: '#ffffff',
    scale: 2
  }).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('landscape', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('diagram.pdf');
  }).catch(err => {
    console.error('PDF generation failed:', err);
  });
}

ngAfterViewChecked() {
  const overlayPane = document.querySelector('.cdk-overlay-pane.custom-tab-menu-panel') as HTMLElement;

  if (overlayPane) {
    this.renderer.setStyle(overlayPane, '--menu-top', `${this.menuTop}px`);
    this.renderer.setStyle(overlayPane, '--menu-left', `${this.menuLeft}px`);
  }
}

openMenu(event: MouseEvent, index: number, trigger: MatMenuTrigger) {
  event.preventDefault(); // prevent default right-click

  this.selectedContextTabIndex = index;

  // Store mouse position
  this.menuTop = event.clientY;
  this.menuLeft = event.clientX;

  setTimeout(() => {
    trigger.openMenu();
  }, 0);
}

generateVersionList() {
  const max = this.versionNumber + 1; // Allow choosing next version
  this.versionList = Array.from({ length: max }, (_, i) => i + 1);
}


    enableRename(index: number): void {
      this.renameTabIndex = index;
    }

    disableRename(): void {
      this.renameTabIndex = null;
    }

  onTabChange(index: number): void {
  // Save current tab’s graph before switching
  const previousFile = this.files[this.previousTabIndex];
  if (previousFile) {
    previousFile.data = this.canvasComponent.exportGraph(); // Save graph JSON
  }

  this.canvasComponent.clearCanvas(); // Clear old graph

  const newFile = this.files[index];
  if (newFile?.data) {
    this.canvasComponent.importGraph(newFile.data); // Restore graph
  }

  this.previousTabIndex = index; // Update reference
}

createNewFile(): void {
  const id = crypto.randomUUID();
  const newFile = {
    id,
    name: `Untitled ${this.files.length + 1}`,
    data: null
  };

  this.files.push(newFile);
  this.activeTabIndex = this.files.length - 1;
  this.onTabChange(this.activeTabIndex); // Clear canvas when creating new
}

deleteCurrentFile(): void {

  const confirmDelete = confirm('Are you sure you want to delete this tab?');
  if (!confirmDelete) return;
  if (this.files.length === 0) return;

  // Remove current tab file
  this.files.splice(this.activeTabIndex, 1);

  // Adjust activeTabIndex safely
  if (this.activeTabIndex >= this.files.length) {
    this.activeTabIndex = this.files.length - 1;
  }

  // Clear canvas if no tabs left, else load the selected tab
  if (this.files.length === 0) {
    this.canvasComponent.clearCanvas();
  } else {
    this.onTabChange(this.activeTabIndex);
  }
}

  private loadUserProfile(): void {
    this.graphSService.getUserProfileInfo().subscribe((profile) => {
    this.userPrincipalName = profile.userPrincipalName || '';
    this.userName = profile.displayName || 'Unknown User';

      this.loadProfilePhoto();
    });
  }

  private loadProfilePhoto(): void {
    this.graphSService.getUserProfilePhoto().subscribe((SafeUrl) => {
      this.userPhotoUrl = SafeUrl;
      this.isProfileLoaded = true;
    });
  }
  logout(): void {
    this.msalService.logoutRedirect({ postLogoutRedirectUri: '/' });
  }

  onSave() {
  this.showSaveForm = !this.showSaveForm;
  }
    @ViewChild('canvas') canvasComponent!: CanvasComponent;
    commandManager!: dia.CommandManager;
  
    ngAfterViewInit(): void {
      
      const savedDiagram = localStorage.getItem('diagram');
      if (savedDiagram) {
        const diagramData = JSON.parse(savedDiagram);
        const ok = this.canvasComponent.importGraph(diagramData.data);
        if (!ok) {
          console.error('Failed to import diagram on load');
        } else {
          this.canvasComponent.centerContent(); 
          this.diagramName = diagramData.name;
          this.versionNumber = diagramData.version;
          this.versionTag = `v${diagramData.version}`;
          this.titleTag = diagramData.name;
        }

        // Optional: clean up after loading
        localStorage.removeItem('diagram');
        localStorage.removeItem('currentDiagramName');
        localStorage.removeItem('currentDiagramVersion');
      }
        const graph = this.canvasComponent.getGraph(); // Assumes you expose a method in CanvasComponent
        this.commandManager = new dia.CommandManager({ graph });

            const themeSwitch = document.querySelector('.theme-switch') as HTMLElement | null;

    if (themeSwitch) {
      themeSwitch.addEventListener('click', this.toggleTheme);
    }
  }

  toggleTheme(_event: MouseEvent): void {
    document.body.classList.toggle('light-theme');
  
}

  fetchAndSetVersionNumber(): void {
    if (!this.diagramName || !this.userName) {
      this.versionNumber = 1;
      return;
    }
    

    this.diagramService.getDiagramVersions(this.userName, this.diagramName).subscribe({
      next: (versions: number[]) => {
        if (versions && versions.length > 0) {
          const latest = Math.max(...versions);
          this.versionNumber = latest + 1;
        } else {
          this.versionNumber = 1;
        }
      },
      error: (err) => {
        console.error('Error fetching versions:', err);
        this.versionNumber = 1;
      }
    });
  }
  hasDiagramContent(): boolean {
  const graph = this.canvasComponent?.getGraph();
  return graph && graph.getElements().length > 0;
}

// ✅ NEW: Conditionally open the menu
// openSaveMenu(saveBtn: any): void {
//   if (this.hasDiagramContent()) {
//     saveBtn.openMenu();
//   } else {
//     alert("⚠️ Cannot save. Canvas is empty!");
//   }
// }
// @ViewChild('saveDialog') saveDialogTemplate!: TemplateRef<any>;
// activeSaveDialogRef: any;

// openSaveMenu(button: HTMLElement): void {
//   if (!this.hasDiagramContent()) {
//     alert("⚠️ Cannot save. Canvas is empty!");
//     return;
//   }

//   // Ensure we close any old dialog before opening a new one
//   if (this.activeSaveDialogRef) {
//     this.activeSaveDialogRef.close();
//   }

//   const rect = button.getBoundingClientRect();

//   this.activeSaveDialogRef = this.dialog.open(this.saveDialogTemplate, {
//     hasBackdrop: false,
//     panelClass: 'custom-save-dialog',
//     position: {
//       top: `${rect.bottom + window.scrollY}px`,
//       left: `${rect.left + window.scrollX}px`
//     }
//   });
// }


    // Header display values
      // appTitle = 'Studio';
      // appSubtitle = 'Editor';
  
      titleTag = '';
      versionTag = '';

      onTitleChange(newTitle: string) {
        this.titleTag = newTitle;
        this.diagramName = newTitle; 
      }
  
      onUserChange(newUser: string) {
        this.versionTag = newUser;
      }
   
    // State management
    selectedElement: any = null;
    currentZoom: number = 100;
   
    // Stencil drop handler
    onShapeDropped(event: { shapeData: any, position: any }): void {
      this.canvasComponent.addShapeFromStencil(event.shapeData, event.position);
    }
   
    // SIMPLE ARROW MODE HANDLER
    onArrowModeToggled(arrowMode: boolean): void {
      this.canvasComponent.onArrowModeToggled(arrowMode);
    }
   
    // Canvas element selection
    onElementSelected(element: any): void {
      this.selectedElement = element;
    }
   
    onElementDeselected(): void {
      this.selectedElement = null;
    }
   
    // Property updates
    onPropertyChanged(event: { property: string, value: any }): void {
      this.canvasComponent.updateSelectedElement(event.property, event.value);
    }
   
    onDeleteElement(): void {
      this.canvasComponent.deleteSelectedElement();
      this.selectedElement = null;
    }
   
    // Zoom controls
    onZoomIn(): void {
      this.canvasComponent.zoomIn();
      this.updateZoomLevel();
    }
   
    onZoomOut(): void {
      this.canvasComponent.zoomOut();
      this.updateZoomLevel();
    }
   
    onFitToScreen(): void {
      this.canvasComponent.fitToScreen();
      this.updateZoomLevel();
    }
   
    onResetZoom(): void {
      this.canvasComponent.resetZoom();
      this.updateZoomLevel();
    }
   
    onClearCanvas(): void {
      this.canvasComponent.clearCanvas();
      this.selectedElement = null;
    }
   
    // Export/Import functionality
    onExportGraph(): void {
      const graphData = this.canvasComponent.exportGraph();
      this.downloadJson(graphData, 'diagram.json');
    }
   
onImportGraph(data: string): void {
  const success = this.canvasComponent.importGraph(data);
  if (success) {
    this.canvasComponent.centerContent(); // ✅ Center the imported graph
  } else {
    alert('❌ Failed to import graph');
  }
}


   
    // Zoom tracking
    private updateZoomLevel(): void {
      this.currentZoom = this.canvasComponent.getCurrentZoom();
    }
   
    // Trigger file download
    private downloadJson(data: string, filename: string): void {
      const blob = new Blob([data], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
    onUndo(): void {
    this.commandManager.undo();
    }
  
    onRedo(): void {
      this.commandManager.redo();
    }
  @ViewChild(MatMenuTrigger) saveTrigger!: MatMenuTrigger;


  saveDiagram(trigger?: MatMenuTrigger): void {
  const graphData = this.canvasComponent.exportGraph();

  const payload = {
    name: this.diagramName,
    version: this.versionNumber,
    profileName: this.userName,
    description: this.diagramDescription,
    isActive: true,
    data: graphData
  };

  this.diagramService.saveDiagram(payload).subscribe({
    next: () => {
      this.versionNumber++;
      if (trigger) {
        trigger.closeMenu(); // ✅ Close the menu after successful save
      }
    },
    error: (err) => {
      console.error('❌ Save failed:', err);
    }
  });
}



onLoad() {
  const profileName = this.userName; 

  this.diagramService.loadLatestDiagram(profileName).subscribe({
    next: (diagram) => {
      const jsonData = diagram.data;
      const success = this.canvasComponent.importGraph(jsonData);
      if (success) {
        this.canvasComponent.centerContent(); // ✅ Center after loading from backend
      } else {
        console.error('Failed to load graph into canvas.');
      }
      this.titleTag = diagram.name || 'Untitled Diagram';
      this.versionTag = `v${diagram.version}`;
    },
    error: (err) => {
      console.error('Error loading latest diagram:', err);
    }
  });
}
openVersionsDialog(): void {
  if (!this.diagramName || !this.userName) {
    alert('Please enter a diagram name first.');
    return;
  }

  this.diagramService.getDiagramVersions(this.userName, this.diagramName).subscribe({
    next: (versions) => {
      this.selectedDiagramVersions = versions;
      this.dialog.open(this.versionsDialog);
    },
    error: (err) => {
      console.error('Failed to fetch versions:', err);
    }
  });
}

loadVersion(version: number): void {
  this.diagramService.loadSpecificVersion(this.diagramName, version).subscribe({
    next: (diagram) => {
      const ok = this.canvasComponent.importGraph(diagram.data);
      if (!ok) alert('Failed to load version.');
      this.versionTag = `v${version}`;
    },
    error: (err) => {
      console.error('Error loading version:', err);
    }
  });
}
deleteVersion(version: number): void {
  const confirmed = confirm(`Are you sure you want to delete version ${version}?`);
  if (!confirmed) return;

  this.diagramService.deleteVersion(this.userName, this.diagramName, version).subscribe({
    next: () => {
      this.selectedDiagramVersions = this.selectedDiagramVersions.filter(v => v !== version);
      alert(`Version ${version} deleted successfully.`);
    },
    error: (err) => {
      alert('Error deleting version.');
    }
  });
}



}