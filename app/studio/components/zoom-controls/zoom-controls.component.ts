import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-zoom-controls',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './zoom-controls.component.html',
  styleUrls: ['./zoom-controls.component.css']
})
export class ZoomControlsComponent {
  @Input() zoomLevel: number = 100;
  @Output() zoomIn = new EventEmitter<void>();
  @Output() zoomOut = new EventEmitter<void>();
  @Output() fitToScreen = new EventEmitter<void>();
  @Output() resetZoom = new EventEmitter<void>();
  @Output() clearCanvas = new EventEmitter<void>();
  @Output() exportGraph = new EventEmitter<void>();
  @Output() importGraph = new EventEmitter<string>();
  @Output() undo = new EventEmitter<void>();
  @Output() redo = new EventEmitter<void>();

onUndo(): void {
  this.undo.emit();
}

onRedo(): void {
  this.redo.emit();
}

  onZoomIn(): void {
    this.zoomIn.emit();
  }

  onZoomOut(): void {
    this.zoomOut.emit();
  }


  onResetZoom(): void {
    this.resetZoom.emit();
  }

  onClear(): void {
    if (confirm('Are you sure you want to clear the canvas? This action cannot be undone.')) {
      this.clearCanvas.emit();
    }
  }

  onExport(): void {
    this.exportGraph.emit();
  }

// onImport(): void {
//     this.importGraph.emit(); // now just triggers your dialog logic in parent
//   }
handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = () => {
        const content = reader.result as string;
        this.importGraph.emit(content); // ✅ Emit string to parent
      };
      reader.readAsText(file);
    } else {
      alert('Please select a valid JSON file.');
    }

    input.value = ''; // Allow reselection
  }
}