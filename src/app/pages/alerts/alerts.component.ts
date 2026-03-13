import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { MockDataService } from '../../shared/services/mock-data.service';
import { StockAlert } from '../../shared/models/product.model';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatChipsModule, PageHeaderComponent],
  template: `
    <app-page-header title="Stock Alerts" [subtitle]="alerts.length + ' items need attention'"></app-page-header>

    <div class="alert-summary">
      <div class="summary-card critical">
        <mat-icon>error</mat-icon>
        <div>
          <span class="count">{{ criticalCount }}</span>
          <span class="label">Out of Stock</span>
        </div>
      </div>
      <div class="summary-card warning">
        <mat-icon>warning</mat-icon>
        <div>
          <span class="count">{{ warningCount }}</span>
          <span class="label">Low Stock</span>
        </div>
      </div>
    </div>

    <div class="alerts-list">
      <mat-card *ngFor="let alert of alerts" class="alert-card" [class.critical]="alert.severity === 'critical'">
        <mat-card-content>
          <div class="alert-row">
            <div class="alert-icon" [class.critical]="alert.severity === 'critical'">
              <mat-icon>{{ alert.severity === 'critical' ? 'error' : 'warning' }}</mat-icon>
            </div>
            <div class="alert-info">
              <span class="alert-product">{{ alert.productName }}</span>
              <span class="alert-sku">{{ alert.sku }}</span>
            </div>
            <div class="alert-stock">
              <span class="stock-current">{{ alert.currentStock }}</span>
              <span class="stock-label">in stock</span>
              <span class="stock-threshold">Threshold: {{ alert.threshold }}</span>
            </div>
            <mat-chip-set>
              <mat-chip [class.critical-chip]="alert.severity === 'critical'"
                        [class.warning-chip]="alert.severity === 'warning'">
                {{ alert.severity === 'critical' ? 'OUT OF STOCK' : 'LOW STOCK' }}
              </mat-chip>
            </mat-chip-set>
            <button mat-stroked-button color="primary">Reorder</button>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card *ngIf="alerts.length === 0" class="empty-card">
        <mat-card-content class="empty-state">
          <mat-icon>check_circle</mat-icon>
          <h3>All Clear!</h3>
          <p>No stock alerts at this time.</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .alert-summary { display: flex; gap: 20px; margin-bottom: 24px; }
    .summary-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px 24px;
      border-radius: 12px;
      flex: 1;
      max-width: 280px;
      &.critical { background: #fce4ec; color: #c62828; }
      &.warning { background: #fff3e0; color: #e65100; }
      mat-icon { font-size: 36px; width: 36px; height: 36px; }
      .count { font-size: 32px; font-weight: 700; display: block; line-height: 1; }
      .label { font-size: 13px; opacity: 0.8; }
    }
    .alerts-list { display: flex; flex-direction: column; gap: 12px; }
    .alert-card {
      transition: transform 0.2s;
      &:hover { transform: translateX(4px); }
      &.critical { border-left: 4px solid #f44336; }
      &:not(.critical) { border-left: 4px solid #ff9800; }
    }
    .alert-row {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }
    .alert-icon {
      width: 40px; height: 40px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      background: #fff3e0; color: #ff9800;
      &.critical { background: #fce4ec; color: #f44336; }
    }
    .alert-info { flex: 1; min-width: 150px; }
    .alert-product { font-weight: 600; display: block; font-size: 14px; }
    .alert-sku { font-size: 12px; color: #888; }
    .alert-stock { text-align: center; min-width: 80px; }
    .stock-current { font-size: 24px; font-weight: 700; display: block; color: #333; }
    .stock-label { font-size: 11px; color: #888; display: block; }
    .stock-threshold { font-size: 11px; color: #aaa; }
    .critical-chip { background: #f44336 !important; color: white !important; }
    .warning-chip { background: #ff9800 !important; color: white !important; }
    .empty-state {
      text-align: center; padding: 48px;
      mat-icon { font-size: 64px; width: 64px; height: 64px; color: #4caf50; }
      h3 { margin: 16px 0 8px; }
      p { color: #888; }
    }
    @media (max-width: 768px) {
      .alert-summary { flex-direction: column; }
      .summary-card { max-width: 100%; }
    }
  `]
})
export class AlertsComponent implements OnInit {
  alerts: StockAlert[] = [];
  criticalCount = 0;
  warningCount = 0;

  constructor(private dataService: MockDataService) {}

  ngOnInit(): void {
    this.dataService.getAlerts().subscribe(alerts => {
      this.alerts = alerts;
      this.criticalCount = alerts.filter(a => a.severity === 'critical').length;
      this.warningCount = alerts.filter(a => a.severity === 'warning').length;
    });
  }
}
