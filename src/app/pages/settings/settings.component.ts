import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatSlideToggleModule, MatSelectModule, MatDividerModule,
    MatIconModule, MatSnackBarModule, PageHeaderComponent
  ],
  template: `
    <app-page-header title="Settings" subtitle="Configure your StockSync preferences"></app-page-header>

    <div class="settings-grid">
      <mat-card>
        <mat-card-header>
          <mat-icon mat-card-avatar>store</mat-icon>
          <mat-card-title>Store Information</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="form-grid">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Store Name</mat-label>
              <input matInput [(ngModel)]="storeName">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput [(ngModel)]="email" type="email">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Phone</mat-label>
              <input matInput [(ngModel)]="phone">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Address</mat-label>
              <input matInput [(ngModel)]="address">
            </mat-form-field>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-header>
          <mat-icon mat-card-avatar>notifications</mat-icon>
          <mat-card-title>Notifications</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="toggle-list">
            <div class="toggle-item">
              <div>
                <span class="toggle-label">Low Stock Alerts</span>
                <span class="toggle-desc">Get notified when products fall below threshold</span>
              </div>
              <mat-slide-toggle [(ngModel)]="lowStockAlerts" color="primary"></mat-slide-toggle>
            </div>
            <mat-divider></mat-divider>
            <div class="toggle-item">
              <div>
                <span class="toggle-label">Order Notifications</span>
                <span class="toggle-desc">Receive alerts for new orders</span>
              </div>
              <mat-slide-toggle [(ngModel)]="orderNotifs" color="primary"></mat-slide-toggle>
            </div>
            <mat-divider></mat-divider>
            <div class="toggle-item">
              <div>
                <span class="toggle-label">Email Reports</span>
                <span class="toggle-desc">Weekly inventory summary via email</span>
              </div>
              <mat-slide-toggle [(ngModel)]="emailReports" color="primary"></mat-slide-toggle>
            </div>
            <mat-divider></mat-divider>
            <div class="toggle-item">
              <div>
                <span class="toggle-label">SMS Alerts</span>
                <span class="toggle-desc">Critical alerts via SMS</span>
              </div>
              <mat-slide-toggle [(ngModel)]="smsAlerts" color="primary"></mat-slide-toggle>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-header>
          <mat-icon mat-card-avatar>tune</mat-icon>
          <mat-card-title>Inventory Settings</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Default Low Stock Threshold</mat-label>
              <input matInput type="number" [(ngModel)]="defaultThreshold">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Currency</mat-label>
              <mat-select [(ngModel)]="currency">
                <mat-option value="USD">USD ($)</mat-option>
                <mat-option value="JPY">JPY (¥)</mat-option>
                <mat-option value="EUR">EUR (€)</mat-option>
                <mat-option value="GBP">GBP (£)</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Timezone</mat-label>
              <mat-select [(ngModel)]="timezone">
                <mat-option value="Asia/Tokyo">Asia/Tokyo (JST)</mat-option>
                <mat-option value="UTC">UTC</mat-option>
                <mat-option value="America/New_York">America/New York (EST)</mat-option>
                <mat-option value="Europe/London">Europe/London (GMT)</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>SKU Prefix</mat-label>
              <input matInput [(ngModel)]="skuPrefix">
            </mat-form-field>
          </div>
        </mat-card-content>
      </mat-card>

      <div class="save-row">
        <button mat-raised-button color="primary" (click)="save()">
          <mat-icon>save</mat-icon>
          Save Settings
        </button>
      </div>
    </div>
  `,
  styles: [`
    .settings-grid { display: flex; flex-direction: column; gap: 20px; max-width: 800px; }
    .form-grid {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 0 16px; padding-top: 8px;
    }
    .full-width { grid-column: 1 / -1; }
    .toggle-list { padding-top: 8px; }
    .toggle-item {
      display: flex; justify-content: space-between; align-items: center;
      padding: 12px 0;
    }
    .toggle-label { font-weight: 500; display: block; font-size: 14px; }
    .toggle-desc { font-size: 12px; color: #888; }
    .save-row { display: flex; justify-content: flex-end; }
    @media (max-width: 600px) {
      .form-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class SettingsComponent {
  storeName = 'Skateboard Sunabe';
  email = 'info@skateboardsunabe.com';
  phone = '+81-98-XXX-XXXX';
  address = 'Sunabe, Chatan, Okinawa, Japan';
  lowStockAlerts = true;
  orderNotifs = true;
  emailReports = false;
  smsAlerts = false;
  defaultThreshold = 5;
  currency = 'JPY';
  timezone = 'Asia/Tokyo';
  skuPrefix = 'SKU';

  constructor(private snackBar: MatSnackBar) {}

  save(): void {
    this.snackBar.open('Settings saved successfully', 'OK', { duration: 3000 });
  }
}
