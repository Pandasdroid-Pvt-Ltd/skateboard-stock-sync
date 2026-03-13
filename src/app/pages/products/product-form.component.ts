import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Product } from '../../shared/models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.product ? 'Edit Product' : 'Add Product' }}</h2>
    <mat-dialog-content>
      <div class="form-grid">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Product Name</mat-label>
          <input matInput [(ngModel)]="form.name" required>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>SKU</mat-label>
          <input matInput [(ngModel)]="form.sku">
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Brand</mat-label>
          <input matInput [(ngModel)]="form.brand">
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Category</mat-label>
          <mat-select [(ngModel)]="form.category">
            <mat-option *ngFor="let cat of data.categories" [value]="cat">{{ cat }}</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Price ($)</mat-label>
          <input matInput type="number" [(ngModel)]="form.price">
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Cost ($)</mat-label>
          <input matInput type="number" [(ngModel)]="form.cost">
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Quantity</mat-label>
          <input matInput type="number" [(ngModel)]="form.quantity">
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Low Stock Threshold</mat-label>
          <input matInput type="number" [(ngModel)]="form.lowStockThreshold">
        </mat-form-field>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="!form.name">
        {{ data.product ? 'Update' : 'Add' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0 16px;
    }
    .full-width { grid-column: 1 / -1; }
    mat-dialog-content { max-height: 70vh; }
  `]
})
export class ProductFormComponent {
  form: Partial<Product>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { product?: Product; categories: string[] },
    private dialogRef: MatDialogRef<ProductFormComponent>
  ) {
    this.form = data.product
      ? { ...data.product }
      : { name: '', sku: '', brand: '', category: '', price: 0, cost: 0, quantity: 0, lowStockThreshold: 5 };
  }

  save(): void {
    this.dialogRef.close(this.form);
  }
}
