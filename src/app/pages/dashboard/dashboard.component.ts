import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { MockDataService } from '../../shared/services/mock-data.service';
import { DashboardStats } from '../../shared/models/product.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatCardModule, MatIconModule, MatButtonModule,
    MatChipsModule, MatTooltipModule, StatCardComponent, PageHeaderComponent
  ],
  template: `
    <app-page-header title="Dashboard" subtitle="Welcome back! Here's your inventory overview."></app-page-header>

    <div class="stats-grid" *ngIf="stats">
      <app-stat-card label="Total Products" [value]="stats.totalProducts" icon="inventory_2" color="#0f3460" [change]="12"></app-stat-card>
      <app-stat-card label="Inventory Value" [value]="stats.totalValue" icon="attach_money" color="#e94560" prefix="$" [change]="8"></app-stat-card>
      <app-stat-card label="Low Stock Items" [value]="stats.lowStockCount" icon="warning" color="#ff9800" [change]="-5"></app-stat-card>
      <app-stat-card label="Monthly Sales" [value]="stats.monthlySales" icon="trending_up" color="#4caf50" prefix="$" [change]="15"></app-stat-card>
    </div>

    <div class="dashboard-grid" *ngIf="stats">
      <!-- Sales Chart -->
      <mat-card class="chart-card">
        <mat-card-header>
          <mat-card-title>Sales vs Purchases</mat-card-title>
          <mat-card-subtitle>Last 7 months</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="chart-container">
            <div class="bar-chart">
              <div class="bar-group" *ngFor="let d of stats.salesData">
                <div class="bars">
                  <div class="bar sales-bar" [style.height.%]="(d.sales / maxSales) * 100" matTooltip="\${{ d.sales }}">
                    <span class="bar-value">\${{ d.sales | number:'1.0-0' }}</span>
                  </div>
                  <div class="bar purchase-bar" [style.height.%]="(d.purchases / maxSales) * 100" matTooltip="\${{ d.purchases }}">
                    <span class="bar-value">\${{ d.purchases | number:'1.0-0' }}</span>
                  </div>
                </div>
                <span class="bar-label">{{ d.month }}</span>
              </div>
            </div>
            <div class="chart-legend">
              <span><span class="legend-dot sales"></span> Sales</span>
              <span><span class="legend-dot purchases"></span> Purchases</span>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Top Categories -->
      <mat-card class="categories-card">
        <mat-card-header>
          <mat-card-title>Top Categories</mat-card-title>
          <mat-card-subtitle>By product count</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="category-list">
            <div class="category-item" *ngFor="let cat of stats.topCategories; let i = index">
              <div class="category-rank">{{ i + 1 }}</div>
              <div class="category-info">
                <span class="category-name">{{ cat.name }}</span>
                <div class="category-bar-bg">
                  <div class="category-bar-fill" [style.width.%]="(cat.count / maxCategory) * 100"></div>
                </div>
              </div>
              <span class="category-count">{{ cat.count }}</span>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Recent Activity -->
      <mat-card class="activity-card">
        <mat-card-header>
          <mat-card-title>Recent Activity</mat-card-title>
          <mat-card-subtitle>Last 3 days</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="activity-list">
            <div class="activity-item" *ngFor="let item of stats.recentActivity">
              <div class="activity-icon" [ngClass]="item.type">
                <mat-icon>{{ getActivityIcon(item.type) }}</mat-icon>
              </div>
              <div class="activity-info">
                <span class="activity-action">{{ item.action }}</span>
                <span class="activity-product">{{ item.product }}</span>
              </div>
              <div class="activity-meta">
                <span class="activity-qty" [ngClass]="item.type">
                  {{ item.type === 'in' ? '+' : item.type === 'out' ? '-' : '' }}{{ item.quantity }}
                </span>
                <span class="activity-date">{{ item.date | date:'MMM d, HH:mm' }}</span>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Quick Actions -->
      <mat-card class="quick-actions-card">
        <mat-card-header>
          <mat-card-title>Quick Actions</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="actions-grid">
            <button mat-stroked-button routerLink="/products" class="action-btn">
              <mat-icon>add_circle</mat-icon>
              <span>Add Product</span>
            </button>
            <button mat-stroked-button routerLink="/orders" class="action-btn">
              <mat-icon>receipt_long</mat-icon>
              <span>New Order</span>
            </button>
            <button mat-stroked-button routerLink="/alerts" class="action-btn alert-btn">
              <mat-icon>notifications_active</mat-icon>
              <span>View Alerts</span>
            </button>
            <button mat-stroked-button routerLink="/reports" class="action-btn">
              <mat-icon>download</mat-icon>
              <span>Export Report</span>
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 24px;
    }
    .dashboard-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 20px;
    }
    .chart-card { grid-column: 1; }
    .categories-card { grid-column: 2; }
    .activity-card { grid-column: 1; }
    .quick-actions-card { grid-column: 2; }

    /* Bar Chart */
    .chart-container { padding: 16px 0; }
    .bar-chart {
      display: flex;
      align-items: flex-end;
      justify-content: space-around;
      height: 220px;
      padding: 0 8px;
    }
    .bar-group { display: flex; flex-direction: column; align-items: center; gap: 8px; }
    .bars { display: flex; gap: 4px; align-items: flex-end; height: 200px; }
    .bar {
      width: 28px;
      border-radius: 4px 4px 0 0;
      transition: height 0.5s;
      position: relative;
      cursor: pointer;
      min-height: 4px;
    }
    .bar-value {
      position: absolute;
      top: -20px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 10px;
      color: #666;
      white-space: nowrap;
      display: none;
    }
    .bar:hover .bar-value { display: block; }
    .sales-bar { background: #e94560; }
    .purchase-bar { background: #0f3460; }
    .bar-label { font-size: 12px; color: #666; }
    .chart-legend {
      display: flex;
      justify-content: center;
      gap: 24px;
      margin-top: 16px;
      font-size: 13px;
      color: #666;
    }
    .legend-dot {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 2px;
      margin-right: 6px;
      &.sales { background: #e94560; }
      &.purchases { background: #0f3460; }
    }

    /* Categories */
    .category-list { display: flex; flex-direction: column; gap: 14px; padding-top: 8px; }
    .category-item { display: flex; align-items: center; gap: 12px; }
    .category-rank {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #f0f0f0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
      color: #666;
    }
    .category-info { flex: 1; }
    .category-name { font-size: 13px; font-weight: 500; display: block; margin-bottom: 4px; }
    .category-bar-bg {
      height: 6px;
      background: #f0f0f0;
      border-radius: 3px;
      overflow: hidden;
    }
    .category-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #e94560, #0f3460);
      border-radius: 3px;
      transition: width 0.5s;
    }
    .category-count { font-weight: 600; font-size: 14px; color: #333; }

    /* Activity */
    .activity-list { display: flex; flex-direction: column; gap: 12px; padding-top: 8px; }
    .activity-item { display: flex; align-items: center; gap: 12px; }
    .activity-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      mat-icon { font-size: 18px; width: 18px; height: 18px; }
      &.in { background: #e8f5e9; color: #4caf50; }
      &.out { background: #fce4ec; color: #e94560; }
      &.alert { background: #fff3e0; color: #ff9800; }
      &.order { background: #e3f2fd; color: #0f3460; }
    }
    .activity-info { flex: 1; }
    .activity-action { font-size: 13px; font-weight: 500; display: block; }
    .activity-product { font-size: 12px; color: #888; }
    .activity-meta { text-align: right; }
    .activity-qty {
      display: block;
      font-weight: 600;
      font-size: 14px;
      &.in { color: #4caf50; }
      &.out { color: #e94560; }
    }
    .activity-date { font-size: 11px; color: #999; }

    /* Quick Actions */
    .actions-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding-top: 8px; }
    .action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 20px 16px;
      mat-icon { font-size: 28px; width: 28px; height: 28px; color: #0f3460; }
    }
    .alert-btn mat-icon { color: #f44336; }

    @media (max-width: 1024px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .dashboard-grid { grid-template-columns: 1fr; }
      .chart-card, .categories-card, .activity-card, .quick-actions-card { grid-column: 1; }
    }
    @media (max-width: 600px) {
      .stats-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats?: DashboardStats;
  maxSales = 0;
  maxCategory = 0;

  constructor(private dataService: MockDataService) {}

  ngOnInit(): void {
    this.dataService.getDashboardStats().subscribe(stats => {
      this.stats = stats;
      this.maxSales = Math.max(...stats.salesData.map(d => Math.max(d.sales, d.purchases)));
      this.maxCategory = Math.max(...stats.topCategories.map(c => c.count));
    });
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'in': return 'add_circle';
      case 'out': return 'remove_circle';
      case 'alert': return 'warning';
      case 'order': return 'shopping_cart';
      default: return 'info';
    }
  }
}
