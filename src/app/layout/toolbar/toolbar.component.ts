import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, MatBadgeModule, MatDividerModule],
  template: `
    <mat-toolbar class="app-toolbar">
      <button mat-icon-button (click)="toggleSidebar.emit()">
        <mat-icon>menu</mat-icon>
      </button>
      <span class="spacer"></span>
      <button mat-icon-button matBadge="3" matBadgeColor="warn" matBadgeSize="small">
        <mat-icon>notifications</mat-icon>
      </button>
      <button mat-icon-button [matMenuTriggerFor]="userMenu">
        <mat-icon>account_circle</mat-icon>
      </button>
      <mat-menu #userMenu="matMenu">
        <button mat-menu-item>
          <mat-icon>person</mat-icon>
          <span>Profile</span>
        </button>
        <button mat-menu-item>
          <mat-icon>settings</mat-icon>
          <span>Settings</span>
        </button>
        <mat-divider></mat-divider>
        <button mat-menu-item>
          <mat-icon>logout</mat-icon>
          <span>Sign Out</span>
        </button>
      </mat-menu>
    </mat-toolbar>
  `,
  styles: [`
    .app-toolbar {
      background: white;
      color: #333;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
      z-index: 10;
      position: sticky;
      top: 0;
    }
    .spacer { flex: 1; }
  `]
})
export class ToolbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
}
