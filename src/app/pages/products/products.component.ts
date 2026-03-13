import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { DataTableComponent, ColumnDef } from '../../shared/components/data-table/data-table.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { MockDataService } from '../../shared/services/mock-data.service';
import { Product } from '../../shared/models/product.model';
import { ProductFormComponent } from './product-form.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatDialogModule, MatSnackBarModule, MatButtonModule,
    MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatChipsModule,
    PageHeaderComponent, SearchInputComponent, DataTableComponent
  ],
  template: `
    <app-page-header title="Products" subtitle="Manage your skateboard inventory"
      actionLabel="Add Product" actionIcon="add" (action)="openForm()">
    </app-page-header>

    <div class="filters-row">
      <app-search-input placeholder="Search products..." (search)="onSearch($event)"></app-search-input>
      <mat-form-field appearance="outline" class="filter-select">
        <mat-label>Category</mat-label>
        <mat-select [(ngModel)]="selectedCategory" (selectionChange)="applyFilters()">
          <mat-option value="">All Categories</mat-option>
          <mat-option *ngFor="let cat of categories" [value]="cat">{{ cat }}</mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field appearance="outline" class="filter-select">
        <mat-label>Status</mat-label>
        <mat-select [(ngModel)]="selectedStatus" (selectionChange)="applyFilters()">
          <mat-option value="">All Status</mat-option>
          <mat-option value="in_stock">In Stock</mat-option>
          <mat-option value="low_stock">Low Stock</mat-option>
          <mat-option value="out_of_stock">Out of Stock</mat-option>
        </mat-select>
      </mat-form-field>
    </div>

    <app-data-table
      [data]="filteredProducts"
      [columns]="columns"
      [defaultPageSize]="10"
      (edit)="openForm($event)"
      (delete)="onDelete($event)">
    </app-data-table>
  `,
  styles: [`
    .filters-row {
      display: flex;
      gap: 16px;
      margin-bottom: 20px;
      flex-wrap: wrap;
      align-items: flex-start;
    }
    .filter-select {
      width: 180px;
      ::ng-deep .mat-mdc-form-field-subscript-wrapper { display: none; }
    }
    @media (max-width: 768px) {
      .filters-row { flex-direction: column; }
      .filter-select { width: 100%; }
    }
  `]
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  searchQuery = '';
  selectedCategory = '';
  selectedStatus = '';

  columns: ColumnDef[] = [
    { key: 'sku', label: 'SKU', width: '100px' },
    { key: 'name', label: 'Product Name' },
    { key: 'category', label: 'Category' },
    { key: 'brand', label: 'Brand' },
    { key: 'price', label: 'Price', type: 'currency', width: '90px' },
    { key: 'quantity', label: 'Stock', type: 'number', width: '80px' },
    { key: 'status', label: 'Status', type: 'badge', width: '120px', badgeMap: {
      'in_stock': { label: 'In Stock', color: '#4caf50' },
      'low_stock': { label: 'Low Stock', color: '#ff9800' },
      'out_of_stock': { label: 'Out of Stock', color: '#f44336' }
    }},
    { key: 'lastUpdated', label: 'Updated', type: 'date', width: '120px' },
  ];

  constructor(
    private dataService: MockDataService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.dataService.getProducts().subscribe(products => {
      this.products = products;
      this.categories = [...new Set(products.map(p => p.category))].sort();
      this.applyFilters();
    });
  }

  onSearch(query: string): void {
    this.searchQuery = query.toLowerCase();
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter(p => {
      const matchSearch = !this.searchQuery ||
        p.name.toLowerCase().includes(this.searchQuery) ||
        p.sku.toLowerCase().includes(this.searchQuery) ||
        p.brand.toLowerCase().includes(this.searchQuery);
      const matchCategory = !this.selectedCategory || p.category === this.selectedCategory;
      const matchStatus = !this.selectedStatus || p.status === this.selectedStatus;
      return matchSearch && matchCategory && matchStatus;
    });
  }

  openForm(product?: Product): void {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '560px',
      data: { product, categories: this.categories }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (product) {
          this.dataService.updateProduct(product.id, result);
          this.snackBar.open('Product updated', 'OK', { duration: 3000 });
        } else {
          this.dataService.addProduct(result);
          this.snackBar.open('Product added', 'OK', { duration: 3000 });
        }
      }
    });
  }

  onDelete(product: Product): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { title: 'Delete Product', message: `Delete "${product.name}"? This cannot be undone.` }
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.dataService.deleteProduct(product.id);
        this.snackBar.open('Product deleted', 'OK', { duration: 3000 });
      }
    });
  }
}
