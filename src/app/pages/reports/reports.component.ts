import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { MockDataService } from '../../shared/services/mock-data.service';
import { Product } from '../../shared/models/product.model';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatDividerModule, PageHeaderComponent, StatCardComponent],
  template: `
    <app-page-header title="Reports" subtitle="Inventory analytics and insights"></app-page-header>

    <div class="stats-grid">
      <app-stat-card label="Total SKUs" [value]="totalProducts" icon="inventory_2" color="#0f3460"></app-stat-card>
      <app-stat-card label="Total Inventory Value" [value]="totalValue" icon="attach_money" color="#e94560" prefix="$"></app-stat-card>
      <app-stat-card label="Total Cost Basis" [value]="totalCost" icon="account_balance" color="#533483" prefix="$"></app-stat-card>
      <app-stat-card label="Potential Profit" [value]="totalProfit" icon="trending_up" color="#4caf50" prefix="$"></app-stat-card>
    </div>

    <div class="reports-grid">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Inventory by Category</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="category-report" *ngFor="let cat of categoryReport">
            <div class="cat-header">
              <span class="cat-name">{{ cat.name }}</span>
              <span class="cat-value">\${{ cat.value | number:'1.0-0' }}</span>
            </div>
            <div class="cat-bar-bg">
              <div class="cat-bar" [style.width.%]="(cat.value / maxCatValue) * 100"></div>
            </div>
            <div class="cat-meta">
              <span>{{ cat.count }} items</span>
              <span>{{ cat.units }} units</span>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-header>
          <mat-card-title>Stock Status Breakdown</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="status-breakdown">
            <div class="status-item">
              <div class="status-visual in-stock">
                <span class="status-pct">{{ inStockPct }}%</span>
              </div>
              <span class="status-label">In Stock</span>
              <span class="status-count">{{ inStockCount }} items</span>
            </div>
            <div class="status-item">
              <div class="status-visual low-stock">
                <span class="status-pct">{{ lowStockPct }}%</span>
              </div>
              <span class="status-label">Low Stock</span>
              <span class="status-count">{{ lowStockCount }} items</span>
            </div>
            <div class="status-item">
              <div class="status-visual out-of-stock">
                <span class="status-pct">{{ outStockPct }}%</span>
              </div>
              <span class="status-label">Out of Stock</span>
              <span class="status-count">{{ outStockCount }} items</span>
            </div>
          </div>

          <mat-divider class="my-divider"></mat-divider>

          <h3>Top 5 Most Valuable Items</h3>
          <div class="top-items">
            <div class="top-item" *ngFor="let item of topValueItems; let i = index">
              <span class="rank">{{ i + 1 }}</span>
              <div class="item-info">
                <span class="item-name">{{ item.name }}</span>
                <span class="item-detail">{{ item.quantity }} × \${{ item.price | number:'1.2-2' }}</span>
              </div>
              <span class="item-value">\${{ item.quantity * item.price | number:'1.0-0' }}</span>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card class="export-card">
        <mat-card-header>
          <mat-card-title>Export Reports</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="export-options">
            <button mat-stroked-button class="export-btn">
              <mat-icon>table_chart</mat-icon>
              <div>
                <span class="export-title">Inventory Report</span>
                <span class="export-desc">Full product list with stock levels</span>
              </div>
            </button>
            <button mat-stroked-button class="export-btn">
              <mat-icon>analytics</mat-icon>
              <div>
                <span class="export-title">Sales Report</span>
                <span class="export-desc">Monthly sales breakdown</span>
              </div>
            </button>
            <button mat-stroked-button class="export-btn">
              <mat-icon>warning</mat-icon>
              <div>
                <span class="export-title">Low Stock Report</span>
                <span class="export-desc">Items below threshold</span>
              </div>
            </button>
            <button mat-stroked-button class="export-btn">
              <mat-icon>account_balance</mat-icon>
              <div>
                <span class="export-title">Valuation Report</span>
                <span class="export-desc">Cost basis and profit margins</span>
              </div>
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
    .reports-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    .export-card { grid-column: 1 / -1; }

    .category-report { margin-bottom: 18px; }
    .cat-header { display: flex; justify-content: space-between; margin-bottom: 6px; }
    .cat-name { font-weight: 500; font-size: 14px; }
    .cat-value { font-weight: 600; font-size: 14px; color: #e94560; }
    .cat-bar-bg { height: 8px; background: #f0f0f0; border-radius: 4px; overflow: hidden; }
    .cat-bar { height: 100%; background: linear-gradient(90deg, #0f3460, #e94560); border-radius: 4px; transition: width 0.5s; }
    .cat-meta { display: flex; justify-content: space-between; font-size: 12px; color: #999; margin-top: 4px; }

    .status-breakdown { display: flex; justify-content: space-around; padding: 16px 0; }
    .status-item { text-align: center; }
    .status-visual {
      width: 80px; height: 80px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 8px;
      &.in-stock { background: #e8f5e9; color: #4caf50; }
      &.low-stock { background: #fff3e0; color: #ff9800; }
      &.out-of-stock { background: #fce4ec; color: #f44336; }
    }
    .status-pct { font-size: 20px; font-weight: 700; }
    .status-label { display: block; font-weight: 500; font-size: 13px; }
    .status-count { font-size: 12px; color: #888; }
    .my-divider { margin: 20px 0; }

    h3 { font-size: 15px; font-weight: 600; margin: 0 0 12px; }
    .top-items { display: flex; flex-direction: column; gap: 10px; }
    .top-item { display: flex; align-items: center; gap: 12px; }
    .rank {
      width: 24px; height: 24px; border-radius: 50%;
      background: #f0f0f0; display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 600;
    }
    .item-info { flex: 1; }
    .item-name { font-size: 13px; font-weight: 500; display: block; }
    .item-detail { font-size: 11px; color: #888; }
    .item-value { font-weight: 700; font-size: 14px; color: #e94560; }

    .export-options { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    .export-btn {
      display: flex; align-items: center; gap: 12px; padding: 20px 16px;
      text-align: left; height: auto;
      mat-icon { font-size: 28px; width: 28px; height: 28px; color: #0f3460; }
    }
    .export-title { display: block; font-weight: 600; font-size: 14px; }
    .export-desc { display: block; font-size: 12px; color: #888; font-weight: 400; }

    @media (max-width: 1024px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .reports-grid { grid-template-columns: 1fr; }
      .export-options { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 600px) {
      .stats-grid { grid-template-columns: 1fr; }
      .export-options { grid-template-columns: 1fr; }
    }
  `]
})
export class ReportsComponent implements OnInit {
  totalProducts = 0;
  totalValue = 0;
  totalCost = 0;
  totalProfit = 0;
  inStockCount = 0; lowStockCount = 0; outStockCount = 0;
  inStockPct = 0; lowStockPct = 0; outStockPct = 0;
  categoryReport: { name: string; count: number; units: number; value: number }[] = [];
  maxCatValue = 1;
  topValueItems: Product[] = [];

  constructor(private dataService: MockDataService) {}

  ngOnInit(): void {
    this.dataService.getProducts().subscribe(products => {
      this.totalProducts = products.length;
      this.totalValue = products.reduce((s, p) => s + p.price * p.quantity, 0);
      this.totalCost = products.reduce((s, p) => s + p.cost * p.quantity, 0);
      this.totalProfit = this.totalValue - this.totalCost;

      this.inStockCount = products.filter(p => p.status === 'in_stock').length;
      this.lowStockCount = products.filter(p => p.status === 'low_stock').length;
      this.outStockCount = products.filter(p => p.status === 'out_of_stock').length;
      this.inStockPct = Math.round((this.inStockCount / this.totalProducts) * 100);
      this.lowStockPct = Math.round((this.lowStockCount / this.totalProducts) * 100);
      this.outStockPct = Math.round((this.outStockCount / this.totalProducts) * 100);

      const catMap = new Map<string, { count: number; units: number; value: number }>();
      products.forEach(p => {
        const existing = catMap.get(p.category) || { count: 0, units: 0, value: 0 };
        existing.count++;
        existing.units += p.quantity;
        existing.value += p.price * p.quantity;
        catMap.set(p.category, existing);
      });
      this.categoryReport = Array.from(catMap.entries())
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.value - a.value);
      this.maxCatValue = Math.max(...this.categoryReport.map(c => c.value), 1);

      this.topValueItems = [...products]
        .sort((a, b) => (b.price * b.quantity) - (a.price * a.quantity))
        .slice(0, 5);
    });
  }
}
