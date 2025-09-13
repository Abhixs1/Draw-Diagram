// import { Component, Input, Output, EventEmitter } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms'; // ✅ Correct import
 
// @Component({
//   selector: 'app-header',
//   standalone: true,
//   imports: [CommonModule, FormsModule], // ✅ This is now valid
//   template: `
//     <header class="header">
//       <div class="header-left">
//         <h1 class="app-title">{{ title }}</h1>
//         <p class="app-subtitle">{{ subtitle }}</p>
//       </div>
 
//       <div class="header-center">
//         <div class="header-tags">
//           <input
//             class="tag title-tag"
//             [(ngModel)]="titleTag"
//             (ngModelChange)="titleTagChange.emit($event)"
//             placeholder="Title - HR" />
 
//           <input
//             class="tag user-tag"
//             [(ngModel)]="userTag"
//             (ngModelChange)="userTagChange.emit($event)"
//             placeholder="Tags - John Doe" />
//         </div>
//       </div>
 
//       <div class="header-right">
//         <button class="help-btn" (click)="onHelpClick()">?</button>
//       </div>
//     </header>
//   `,
//   styleUrls: ['./header.component.css']
// })
// export class HeaderComponent {
//   @Input() title: string = 'mavim';
//   @Input() subtitle: string = 'change it';
 
//   @Input() titleTag: string = 'Title - HR';
//   @Output() titleTagChange = new EventEmitter<string>();
 
//   @Input() userTag: string = 'Tags - John Doe';
//   @Output() userTagChange = new EventEmitter<string>();
 
//   onHelpClick(): void {
//     console.log('Help clicked');
//   }
// }
 
 