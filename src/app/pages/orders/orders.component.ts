import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { DataTableComponent, ColumnDef } from '../../shared/components/data-table/data-table.component';
import { MockDataService } from '../../shared/services/mock-data.service';
import { Order } from '../../shared/models/product.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatSelectModule, MatFormFieldModule,
    PageHeaderComponent, SearchInputComponent, DataTableComponent
  ],
  template: `
    <app-page-header title="Orders" subtitle="Track sales and purchase orders"></app-page-header>

    <div class="filters-row">
      <app-search-input placeholder="Search orders..." (search)="onSearch($event)"></app-search-input>
      <mat-form-field appearance="outline" class="filter-select">
        <mat-label>Type</mat-label>
        <mat-select [(ngModel)]="selectedType" (selectionChange)="applyFilters()">
          <mat-option value="">All</mat-option>
          <mat-option value="sale">Sales</mat-option>
          <mat-option value="purchase">Purchases</mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field appearance="outline" class="filter-select">
        <mat-label>Status</mat-label>
        <mat-select [(ngModel)]="selectedStatus" (selectionChange)="applyFilters()">
          <mat-option value="">All</mat-option>
          <mat-option value="completed">Completed</mat-option>
          <mat-option value="processing">Processing</mat-option>
          <mat-option value="pending">Pending</mat-option>
          <mat-option value="cancelled">Cancelled</mat-option>
        </mat-select>
      </mat-form-field>
    </div>

    <app-data-table
      [data]="filteredOrders"
      [columns]="columns"
      [showActions]="false"
      [defaultPageSize]="10">
    </app-data-table>
  `,
  styles: [`
    .filters-row {
      display: flex; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; align-items: flex-start;
    }
    .filter-select {
      width: 160px;
      ::ng-deep .mat-mdc-form-field-subscript-wrapper { display: none; }
    }
    @media (max-width: 768px) {
      .filters-row { flex-direction: column; }
      .filter-select { width: 100%; }
    }
  `]
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: any[] = [];
  searchQuery = '';
  selectedType = '';
  selectedStatus = '';

  columns: ColumnDef[] = [
    { key: 'orderNumber', label: 'Order #', width: '130px' },
    { key: 'type', label: 'Type', type: 'badge', width: '100px', badgeMap: {
      'sale': { label: 'Sale', color: '#4caf50' },
      'purchase': { label: 'Purchase', color: '#0f3460' }
    }},
    { key: 'customerOrSupplier', label: 'Customer / Supplier' },
    { key: 'itemCount', label: 'Items', type: 'number', width: '70px' },
    { key: 'total', label: 'Total', type: 'currency', width: '100px' },
    { key: 'status', label: 'Status', type: 'badge', width: '120px', badgeMap: {
      'completed': { label: 'Completed', color: '#4caf50' },
      'processing': { label: 'Processing', color: '#2196f3' },
      'pending': { label: 'Pending', color: '#ff9800' },
      'cancelled': { label: 'Cancelled', color: '#9e9e9e' }
    }},
    { key: 'date', label: 'Date', type: 'date', width: '120px' },
  ];

  constructor(private dataService: MockDataService) {}

  ngOnInit(): void {
    this.dataService.getOrders().subscribe(orders => {
      this.orders = orders;
      this.applyFilters();
    });
  }

  onSearch(query: string): void {
    this.searchQuery = query.toLowerCase();
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredOrders = this.orders
      .filter(o => {
        const matchSearch = !this.searchQuery ||
          o.orderNumber.toLowerCase().includes(this.searchQuery) ||
          (o.customer || '').toLowerCase().includes(this.searchQuery) ||
          (o.supplier || '').toLowerCase().includes(this.searchQuery);
        const matchType = !this.selectedType || o.type === this.selectedType;
        const matchStatus = !this.selectedStatus || o.status === this.selectedStatus;
        return matchSearch && matchType && matchStatus;
      })
      .map(o => ({
        ...o,
        customerOrSupplier: o.customer || o.supplier || '—',
        itemCount: o.items.length
      }));
  }
}
