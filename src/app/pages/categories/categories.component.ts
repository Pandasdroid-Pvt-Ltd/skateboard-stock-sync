import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { MockDataService } from '../../shared/services/mock-data.service';
import { Category } from '../../shared/models/product.model';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatIconModule, MatButtonModule,
    MatDialogModule, MatSnackBarModule, PageHeaderComponent
  ],
  template: `
    <app-page-header title="Categories" subtitle="Organize your product catalog"
      actionLabel="Add Category" actionIcon="add" (action)="addCategory()">
    </app-page-header>

    <div class="categories-grid">
      <mat-card *ngFor="let cat of categories" class="category-card" [style.border-top-color]="cat.color">
        <mat-card-content>
          <div class="card-top">
            <div class="cat-icon" [style.background-color]="cat.color + '15'" [style.color]="cat.color">
              <mat-icon>{{ cat.icon }}</mat-icon>
            </div>
            <button mat-icon-button (click)="deleteCategory(cat)" class="delete-btn">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          <h3>{{ cat.name }}</h3>
          <p class="product-count">{{ cat.productCount }} products</p>
          <div class="count-bar">
            <div class="count-fill" [style.width.%]="(cat.productCount / maxCount) * 100" [style.background]="cat.color"></div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 20px;
    }
    .category-card {
      border-top: 4px solid;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 20px rgba(0,0,0,0.1);
      }
    }
    .card-top { display: flex; justify-content: space-between; align-items: flex-start; }
    .cat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      mat-icon { font-size: 24px; width: 24px; height: 24px; }
    }
    .delete-btn {
      opacity: 0;
      transition: opacity 0.2s;
    }
    .category-card:hover .delete-btn { opacity: 1; }
    h3 { margin: 16px 0 4px; font-size: 16px; font-weight: 600; }
    .product-count { color: #888; font-size: 13px; margin: 0 0 12px; }
    .count-bar { height: 4px; background: #f0f0f0; border-radius: 2px; overflow: hidden; }
    .count-fill { height: 100%; border-radius: 2px; transition: width 0.5s; }
  `]
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  maxCount = 1;

  constructor(
    private dataService: MockDataService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.dataService.getCategories().subscribe(cats => {
      this.categories = cats;
      this.maxCount = Math.max(...cats.map(c => c.productCount), 1);
    });
  }

  addCategory(): void {
    const name = prompt('Category name:');
    if (name) {
      this.dataService.addCategory({ name });
      this.snackBar.open('Category added', 'OK', { duration: 3000 });
    }
  }

  deleteCategory(cat: Category): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { title: 'Delete Category', message: `Delete "${cat.name}"?` }
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.dataService.deleteCategory(cat.id);
        this.snackBar.open('Category deleted', 'OK', { duration: 3000 });
      }
    });
  }
}
