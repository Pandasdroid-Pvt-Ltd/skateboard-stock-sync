import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule, MatIconModule],
  template: `
    <div class="sidebar" [class.collapsed]="collapsed">
      <div class="brand">
        <mat-icon class="brand-icon">skateboarding</mat-icon>
        <span class="brand-text" *ngIf="!collapsed">StockSync</span>
      </div>

      <mat-nav-list>
        <a mat-list-item *ngFor="let item of navItems" [routerLink]="item.route"
           routerLinkActive="active" (click)="navClick.emit()">
          <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
          <span matListItemTitle *ngIf="!collapsed">{{ item.label }}</span>
          <span class="nav-badge" *ngIf="item.badge && !collapsed" [style.background]="item.badgeColor">
            {{ item.badge }}
          </span>
        </a>
      </mat-nav-list>

      <div class="sidebar-footer" *ngIf="!collapsed">
        <div class="powered-by">
          <span>Powered by</span>
          <strong>Pandasdroid</strong>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sidebar {
      width: 260px;
      height: 100%;
      background: #1a1a2e;
      color: white;
      display: flex;
      flex-direction: column;
      transition: width 0.3s;
      overflow: hidden;
    }
    .sidebar.collapsed { width: 64px; }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px 16px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .brand-icon { color: #e94560; font-size: 32px; width: 32px; height: 32px; }
    .brand-text {
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 0.5px;
      white-space: nowrap;
    }
    mat-nav-list {
      flex: 1;
      padding-top: 8px;
    }
    a[mat-list-item] {
      color: rgba(255,255,255,0.7);
      border-radius: 0;
      margin: 2px 8px;
      border-radius: 8px;
      transition: all 0.2s;
      &:hover {
        background: rgba(255,255,255,0.08);
        color: white;
      }
      &.active {
        background: rgba(233, 69, 96, 0.15);
        color: #e94560;
        mat-icon { color: #e94560; }
      }
      mat-icon { color: rgba(255,255,255,0.5); }
    }
    .nav-badge {
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 10px;
      color: white;
      margin-left: auto;
    }
    .sidebar-footer {
      padding: 16px;
      border-top: 1px solid rgba(255,255,255,0.08);
      text-align: center;
    }
    .powered-by {
      font-size: 11px;
      color: rgba(255,255,255,0.4);
      span { display: block; }
      strong { color: #e94560; }
    }
  `]
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Output() navClick = new EventEmitter<void>();

  navItems = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Products', icon: 'inventory_2', route: '/products' },
    { label: 'Categories', icon: 'category', route: '/categories' },
    { label: 'Orders', icon: 'receipt_long', route: '/orders' },
    { label: 'Alerts', icon: 'notifications', route: '/alerts', badge: '3', badgeColor: '#f44336' },
    { label: 'Reports', icon: 'analytics', route: '/reports' },
    { label: 'Settings', icon: 'settings', route: '/settings' },
  ];
}
