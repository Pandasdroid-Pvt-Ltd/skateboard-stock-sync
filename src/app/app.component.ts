import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { ToolbarComponent } from './layout/toolbar/toolbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatSidenavModule, SidebarComponent, ToolbarComponent],
  template: `
    <mat-sidenav-container class="app-container">
      <mat-sidenav #sidenav [mode]="sidenavMode" [opened]="sidenavOpened" class="app-sidenav"
        (closedStart)="sidenavOpened = false">
        <app-sidebar [collapsed]="false" (navClick)="onNavClick()"></app-sidebar>
      </mat-sidenav>

      <mat-sidenav-content class="app-content">
        <app-toolbar (toggleSidebar)="toggleSidenav()"></app-toolbar>
        <main class="page-content">
          <router-outlet></router-outlet>
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .app-container { height: 100vh; }
    .app-sidenav {
      width: 260px;
      border-right: none;
      ::ng-deep .mat-drawer-inner-container { display: flex; }
    }
    .app-content {
      display: flex;
      flex-direction: column;
      background: #f5f6fa;
    }
    .page-content {
      flex: 1;
      padding: 24px;
      overflow-y: auto;
    }
    @media (max-width: 768px) {
      .page-content { padding: 16px; }
    }
  `]
})
export class AppComponent {
  sidenavMode: 'side' | 'over' = 'side';
  sidenavOpened = true;

  constructor() {
    this.updateSidenavMode();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => this.updateSidenavMode());
    }
  }

  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }

  onNavClick(): void {
    if (this.sidenavMode === 'over') {
      this.sidenavOpened = false;
    }
  }

  private updateSidenavMode(): void {
    if (typeof window !== 'undefined') {
      this.sidenavMode = window.innerWidth < 1024 ? 'over' : 'side';
      this.sidenavOpened = window.innerWidth >= 1024;
    }
  }
}
