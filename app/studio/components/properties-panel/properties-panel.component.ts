// properties-panel.component.ts - Updated with Outline Style
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-properties-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="properties-panel" *ngIf="selectedElement">
      <div class="panel-header">
        <h3>{{ isArrow ? 'Arrow Properties' : 'Shape Properties' }}</h3>
        <button class="delete-btn" (click)="onDelete()" title="Delete Element">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
          </svg>
        </button>
      </div>

      <!-- Arrow Properties -->
      <div class="properties-content" *ngIf="isArrow">
        <div class="property-section">
          <h4>Appearance</h4>
          
          <!-- Color -->
          <div class="property-group">
            <label for="arrowColor">Color</label>
            <div class="color-input-group">
              <input 
                type="color" 
                id="arrowColor"
                [(ngModel)]="arrowProps.color"
                (ngModelChange)="onArrowPropertyChange('color', $event)"
                class="color-picker">
              <input 
                type="text" 
                [(ngModel)]="arrowProps.color"
                (ngModelChange)="onArrowPropertyChange('color', $event)"
                class="color-text"
                placeholder="#333333">
            </div>
          </div>

          <!-- Thickness -->
          <div class="property-group">
            <label for="arrowThickness">Thickness</label>
            <div class="range-input-group">
              <input 
                type="range" 
                id="arrowThickness"
                min="1" 
                max="10" 
                step="1"
                [(ngModel)]="arrowProps.thickness"
                (ngModelChange)="onArrowPropertyChange('thickness', $event)"
                class="range-input">
              <span class="range-value">{{arrowProps.thickness}}px</span>
            </div>
          </div>

          <!-- Line Style -->
          <div class="property-group">
            <label for="lineStyle">Line Style</label>
            <select 
              id="lineStyle"
              [(ngModel)]="arrowProps.lineStyle"
              (ngModelChange)="onArrowPropertyChange('lineStyle', $event)"
              class="select-input">
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
            </select>
          </div>

          <!-- Arrow Head -->
          <div class="property-group">
            <label for="arrowHead">Arrow Head</label>
            <select 
              id="arrowHead"
              [(ngModel)]="arrowProps.arrowHead"
              (ngModelChange)="onArrowPropertyChange('arrowHead', $event)"
              class="select-input">
              <option value="standard">Standard</option>
              <option value="large">Large</option>
              <option value="diamond">Diamond</option>
              <option value="circle">Circle</option>
              <option value="none">None</option>
            </select>
          </div>

          <!-- Routing -->
          <div class="property-group">
            <label for="routing">Routing</label>
            <select 
              id="routing"
              [(ngModel)]="arrowProps.routing"
              (ngModelChange)="onArrowPropertyChange('routing', $event)"
              class="select-input">
              <option value="normal">Direct</option>
              <option value="orthogonal">Orthogonal</option>
              <option value="manhattan">Manhattan</option>
            </select>
          </div>
        </div>

        <div class="property-section">
          <h4>Label</h4>
          
          <!-- Label Text -->
          <div class="property-group">
            <label for="arrowLabel">Text</label>
            <input 
              type="text" 
              id="arrowLabel"
              [(ngModel)]="arrowProps.label"
              (ngModelChange)="onArrowPropertyChange('label', $event)"
              class="text-input"
              placeholder="Enter label text">
          </div>

          <!-- Label Position -->
          <div class="property-group" *ngIf="arrowProps.label">
            <label for="labelPosition">Position</label>
            <div class="range-input-group">
              <input 
                type="range" 
                id="labelPosition"
                min="0" 
                max="1" 
                step="0.1"
                [(ngModel)]="arrowProps.labelPosition"
                (ngModelChange)="onArrowPropertyChange('labelPosition', $event)"
                class="range-input">
              <span class="range-value">{{(arrowProps.labelPosition * 100).toFixed(0)}}%</span>
            </div>
          </div>

          <!-- Label Background -->
          <div class="property-group" *ngIf="arrowProps.label">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                [(ngModel)]="arrowProps.labelBackground"
                (ngModelChange)="onArrowPropertyChange('labelBackground', $event)">
              <span class="checkmark"></span>
              Background
            </label>
          </div>
        </div>

        <!-- Quick Presets -->
        <div class="property-section">
          <h4>Quick Styles</h4>
          <div class="preset-buttons">
            <button 
              class="preset-btn" 
              (click)="applyArrowPreset('default')"
              [class.active]="arrowProps.style === 'default'">
              Default
            </button>
            <button 
              class="preset-btn" 
              (click)="applyArrowPreset('thick')"
              [class.active]="arrowProps.style === 'thick'">
              Thick
            </button>
            <button 
              class="preset-btn" 
              (click)="applyArrowPreset('dashed')"
              [class.active]="arrowProps.style === 'dashed'">
              Dashed
            </button>
            <button 
              class="preset-btn" 
              (click)="applyArrowPreset('curved')"
              [class.active]="arrowProps.style === 'curved'">
              Curved
            </button>
          </div>
        </div>
      </div>

      <!-- Shape Properties -->
      <div class="properties-content" *ngIf="!isArrow">
        <div class="property-section">
          <h4>Content</h4>
          
          <div class="property-group">
            <label for="shapeText">Text</label>
            <input 
              type="text" 
              id="shapeText"
              [(ngModel)]="shapeProps.text"
              (ngModelChange)="onShapePropertyChange('text', $event)"
              class="text-input"
              placeholder="Enter text">
          </div>
        </div>

        <div class="property-section">
          <h4>Appearance</h4>
          
          <!-- Fill Color -->
          <div class="property-group">
            <label for="shapeFill">Fill Color</label>
            <div class="color-input-group">
              <input 
                type="color" 
                id="shapeFill"
                [(ngModel)]="shapeProps.fill"
                (ngModelChange)="onShapePropertyChange('fill', $event)"
                class="color-picker">
              <input 
                type="text" 
                [(ngModel)]="shapeProps.fill"
                (ngModelChange)="onShapePropertyChange('fill', $event)"
                class="color-text"
                placeholder="#ffffff">
            </div>
          </div>

          <!-- Outline Color -->
          <div class="property-group">
            <label for="shapeOutline">Outline Color</label>
            <div class="color-input-group">
              <input 
                type="color" 
                id="shapeOutline"
                [(ngModel)]="shapeProps.outline"
                (ngModelChange)="onShapePropertyChange('outline', $event)"
                class="color-picker">
              <input 
                type="text" 
                [(ngModel)]="shapeProps.outline"
                (ngModelChange)="onShapePropertyChange('outline', $event)"
                class="color-text"
                placeholder="#000000">
            </div>
          </div>

          <!-- Outline Thickness -->
          <div class="property-group">
            <label for="outlineThickness">Outline Thickness</label>
            <div class="range-input-group">
              <input 
                type="range" 
                id="outlineThickness"
                min="0" 
                max="10" 
                step="1"
                [(ngModel)]="shapeProps.outlineThickness"
                (ngModelChange)="onShapePropertyChange('outlineThickness', $event)"
                class="range-input">
              <span class="range-value">{{shapeProps.outlineThickness}}px</span>
            </div>
          </div>

          <!-- Outline Style -->
          <div class="property-group">
            <label for="outlineStyle">Outline Style</label>
            <select 
              id="outlineStyle"
              [(ngModel)]="shapeProps.outlineStyle"
              (ngModelChange)="onShapePropertyChange('outlineStyle', $event)"
              class="select-input">
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
            </select>
          </div>
        </div>

        <div class="property-section">
          <h4>Text</h4>
          
          <!-- Font Size -->
          <div class="property-group">
            <label for="fontSize">Font Size</label>
            <div class="range-input-group">
              <input 
                type="range" 
                id="fontSize"
                min="8" 
                max="48" 
                step="1"
                [(ngModel)]="shapeProps.fontSize"
                (ngModelChange)="onShapePropertyChange('fontSize', $event)"
                class="range-input">
              <span class="range-value">{{shapeProps.fontSize}}px</span>
            </div>
          </div>

          <!-- Font Family -->
          <div class="property-group">
            <label for="fontFamily">Font Family</label>
            <select 
              id="fontFamily"
              [(ngModel)]="shapeProps.fontFamily"
              (ngModelChange)="onShapePropertyChange('fontFamily', $event)"
              class="select-input">
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Georgia">Georgia</option>
            </select>
          </div>

          <!-- Text Color -->
          <div class="property-group">
            <label for="textColor">Text Color</label>
            <div class="color-input-group">
              <input 
                type="color" 
                id="textColor"
                [(ngModel)]="shapeProps.textColor"
                (ngModelChange)="onShapePropertyChange('textColor', $event)"
                class="color-picker">
              <input 
                type="text" 
                [(ngModel)]="shapeProps.textColor"
                (ngModelChange)="onShapePropertyChange('textColor', $event)"
                class="color-text"
                placeholder="#000000">
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="no-selection" *ngIf="!selectedElement">
      <div class="no-selection-content">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" opacity="0.3">
          <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z"/>
        </svg>
        <p>Select an element to edit properties</p>
      </div>
    </div>
  `,
  styleUrls: ['./properties-panel.component.css']
})
export class PropertiesPanelComponent implements OnChanges {
  @Input() selectedElement: any = null;
  @Output() propertyChanged = new EventEmitter<{ property: string, value: any }>();
  @Output() deleteElement = new EventEmitter<void>();

  isArrow = false;
  
  // Arrow properties
  arrowProps = {
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

  // Shape properties - UPDATED with outlineStyle
  shapeProps = {
    text: '',
    fill: '#ffffff',
    outline: '#000000',
    outlineThickness: 2,
    outlineStyle: 'solid',  // ADDED
    fontSize: 14,
    fontFamily: 'Arial',
    textColor: '#000000'
  };

  // Arrow presets
  private arrowPresets = {
    default: {
      style: 'default',
      color: '#333333',
      thickness: 2,
      lineStyle: 'solid',
      arrowHead: 'standard',
      routing: 'normal'
    },
    thick: {
      style: 'thick',
      color: '#333333',
      thickness: 4,
      lineStyle: 'solid',
      arrowHead: 'large',
      routing: 'normal'
    },
    dashed: {
      style: 'dashed',
      color: '#666666',
      thickness: 2,
      lineStyle: 'dashed',
      arrowHead: 'standard',
      routing: 'normal'
    },
    curved: {
      style: 'curved',
      color: '#0969da',
      thickness: 3,
      lineStyle: 'solid',
      arrowHead: 'standard',
      routing: 'orthogonal'
    }
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedElement']) {
      this.updateProperties();
    }
  }

  private updateProperties(): void {
    if (!this.selectedElement) {
      this.isArrow = false;
      return;
    }

    // Check if selected element is an arrow/link
    this.isArrow = this.selectedElement.isLink && this.selectedElement.isLink();

    if (this.isArrow) {
      // Load arrow properties
      const props = this.selectedElement.prop('arrowProperties') || {};
      this.arrowProps = {
        style: props.style || 'default',
        color: props.color || '#333333',
        thickness: props.thickness || 2,
        label: props.label || '',
        labelPosition: props.labelPosition || 0.5,
        labelBackground: props.labelBackground !== false,
        arrowHead: props.arrowHead || 'standard',
        lineStyle: props.lineStyle || 'solid',
        routing: props.routing || 'normal'
      };
    } else {
      // Load shape properties - UPDATED to include outlineStyle
      const attrs = this.selectedElement.get('attrs') || {};
      const strokeDasharray = attrs.body?.strokeDasharray;
      
      let outlineStyle = 'solid';
      if (strokeDasharray && strokeDasharray !== 'none') {
        if (strokeDasharray.includes('5,5')) {
          outlineStyle = 'dashed';
        } else if (strokeDasharray.includes('2,2')) {
          outlineStyle = 'dotted';
        }
      }
      
      this.shapeProps = {
        text: attrs.label?.text || '',
        fill: attrs.body?.fill || '#ffffff',
        outline: attrs.body?.stroke || '#000000',
        outlineThickness: attrs.body?.strokeWidth || 2,
        outlineStyle: outlineStyle,  // ADDED
        fontSize: attrs.label?.fontSize || 14,
        fontFamily: attrs.label?.fontFamily || 'Arial',
        textColor: attrs.label?.fill || '#000000'
      };
    }
  }

  onArrowPropertyChange(property: string, value: any): void {
    this.propertyChanged.emit({ property, value });
  }

  onShapePropertyChange(property: string, value: any): void {
    this.propertyChanged.emit({ property, value });
  }

  applyArrowPreset(presetName: string): void {
    const preset = this.arrowPresets[presetName as keyof typeof this.arrowPresets];
    if (preset) {
      // Update local properties
      this.arrowProps = { ...this.arrowProps, ...preset };
      
      // Emit each property change
      Object.entries(preset).forEach(([key, value]) => {
        this.propertyChanged.emit({ property: key, value });
      });
    }
  }

  onDelete(): void {
    this.deleteElement.emit();
  }
}