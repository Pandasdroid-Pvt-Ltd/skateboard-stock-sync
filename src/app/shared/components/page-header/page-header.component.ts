import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="page-header">
      <div class="header-left">
        <h1>{{ title }}</h1>
        <p *ngIf="subtitle" class="subtitle">{{ subtitle }}</p>
      </div>
      <div class="header-right">
        <button mat-raised-button color="primary" *ngIf="actionLabel" (click)="action.emit()">
          <mat-icon *ngIf="actionIcon">{{ actionIcon }}</mat-icon>
          {{ actionLabel }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
    }
    h1 {
      margin: 0;
      font-size: 26px;
      font-weight: 700;
      color: #1a1a2e;
    }
    .subtitle {
      margin: 4px 0 0;
      color: #666;
      font-size: 14px;
    }
    .header-right { display: flex; gap: 8px; }
  `]
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() actionLabel = '';
  @Input() actionIcon = '';
  @Output() action = new EventEmitter<void>();
}
