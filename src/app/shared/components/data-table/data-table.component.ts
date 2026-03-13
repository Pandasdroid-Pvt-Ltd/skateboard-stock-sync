import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

export interface ColumnDef {
  key: string;
  label: string;
  sortable?: boolean;
  type?: 'text' | 'currency' | 'number' | 'date' | 'badge' | 'custom';
  badgeMap?: Record<string, { label: string; color: string }>;
  width?: string;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatSortModule, MatPaginatorModule,
    MatButtonModule, MatIconModule, MatTooltipModule, MatSelectModule, FormsModule
  ],
  template: `
    <div class="table-container">
      <div class="table-toolbar" *ngIf="showToolbar">
        <div class="toolbar-left">
          <span class="result-count">{{ filteredData.length }} results</span>
        </div>
        <div class="toolbar-right">
          <div class="page-size-selector">
            <span>Show</span>
            <mat-form-field appearance="outline" class="page-size-field">
              <mat-select [(ngModel)]="pageSize" (selectionChange)="onPageSizeChange()">
                <mat-option *ngFor="let size of pageSizeOptions" [value]="size">{{ size }}</mat-option>
              </mat-select>
            </mat-form-field>
            <span>entries</span>
          </div>
        </div>
      </div>

      <div class="table-scroll">
        <table mat-table [dataSource]="pagedData" matSort (matSortChange)="onSort($event)">

          <ng-container *ngFor="let col of columns" [matColumnDef]="col.key">
            <th mat-header-cell *matHeaderCellDef [mat-sort-header]="col.sortable !== false ? col.key : ''"
                [disabled]="col.sortable === false" [style.width]="col.width || 'auto'">
              {{ col.label }}
            </th>
            <td mat-cell *matCellDef="let row" [style.width]="col.width || 'auto'">
              <ng-container [ngSwitch]="col.type">
                <span *ngSwitchCase="'currency'">\${{ row[col.key] | number:'1.2-2' }}</span>
                <span *ngSwitchCase="'number'">{{ row[col.key] | number }}</span>
                <span *ngSwitchCase="'date'">{{ row[col.key] | date:'MMM d, y' }}</span>
                <span *ngSwitchCase="'badge'" class="badge" [style.background-color]="getBadgeColor(col, row[col.key])">
                  {{ getBadgeLabel(col, row[col.key]) }}
                </span>
                <ng-container *ngSwitchDefault>{{ row[col.key] }}</ng-container>
              </ng-container>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions" *ngIf="showActions">
            <th mat-header-cell *matHeaderCellDef style="width: 100px;">Actions</th>
            <td mat-cell *matCellDef="let row">
              <button mat-icon-button matTooltip="Edit" (click)="edit.emit(row)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button matTooltip="Delete" color="warn" (click)="delete.emit(row)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="table-row" (click)="rowClick.emit(row)"></tr>

          <tr class="no-data-row" *matNoDataRow>
            <td [attr.colspan]="displayedColumns.length" class="no-data">
              <mat-icon>inbox</mat-icon>
              <span>No data found</span>
            </td>
          </tr>
        </table>
      </div>

      <div class="pagination-bar" *ngIf="filteredData.length > 0">
        <div class="pagination-info">
          Showing {{ startIndex + 1 }}–{{ endIndex }} of {{ filteredData.length }}
        </div>
        <div class="pagination-controls">
          <button mat-icon-button (click)="goToFirst()" [disabled]="pageIndex === 0" matTooltip="First page">
            <mat-icon>first_page</mat-icon>
          </button>
          <button mat-icon-button (click)="goToPrev()" [disabled]="pageIndex === 0" matTooltip="Previous page">
            <mat-icon>chevron_left</mat-icon>
          </button>

          <button *ngFor="let p of visiblePages" mat-mini-fab
            [color]="p === pageIndex ? 'primary' : undefined"
            [class.active-page]="p === pageIndex"
            [class.inactive-page]="p !== pageIndex"
            (click)="goToPage(p)">
            {{ p + 1 }}
          </button>

          <button mat-icon-button (click)="goToNext()" [disabled]="pageIndex >= totalPages - 1" matTooltip="Next page">
            <mat-icon>chevron_right</mat-icon>
          </button>
          <button mat-icon-button (click)="goToLast()" [disabled]="pageIndex >= totalPages - 1" matTooltip="Last page">
            <mat-icon>last_page</mat-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .table-container {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }
    .table-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border-bottom: 1px solid #eee;
      flex-wrap: wrap;
      gap: 12px;
    }
    .result-count { color: #666; font-size: 13px; }
    .toolbar-right { display: flex; align-items: center; gap: 12px; }
    .page-size-selector {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: #666;
    }
    .page-size-field {
      width: 72px;
      ::ng-deep .mat-mdc-form-field-subscript-wrapper { display: none; }
      ::ng-deep .mat-mdc-text-field-wrapper { padding: 0 8px; }
    }
    .table-scroll { overflow-x: auto; }
    table { width: 100%; }
    .table-row {
      cursor: pointer;
      transition: background-color 0.15s;
      &:hover { background-color: #f5f5f5; }
    }
    th.mat-mdc-header-cell {
      font-weight: 600;
      font-size: 13px;
      color: #444;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      background: #fafafa;
    }
    td.mat-mdc-cell { font-size: 14px; }
    .badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      color: white;
      white-space: nowrap;
    }
    .no-data {
      text-align: center;
      padding: 48px 16px;
      color: #999;
      mat-icon { font-size: 48px; width: 48px; height: 48px; display: block; margin: 0 auto 8px; }
    }
    .pagination-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border-top: 1px solid #eee;
      flex-wrap: wrap;
      gap: 12px;
    }
    .pagination-info { font-size: 13px; color: #666; }
    .pagination-controls {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .inactive-page {
      background: #f0f0f0 !important;
      color: #333 !important;
      box-shadow: none !important;
    }
    .active-page { }
  `]
})
export class DataTableComponent implements OnChanges {
  @Input() data: any[] = [];
  @Input() columns: ColumnDef[] = [];
  @Input() showActions = true;
  @Input() showToolbar = true;
  @Input() pageSizeOptions = [5, 10, 25, 50];
  @Input() defaultPageSize = 10;

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() rowClick = new EventEmitter<any>();

  filteredData: any[] = [];
  pagedData: any[] = [];
  pageIndex = 0;
  pageSize = 10;
  totalPages = 0;
  startIndex = 0;
  endIndex = 0;
  visiblePages: number[] = [];

  get displayedColumns(): string[] {
    const cols = this.columns.map(c => c.key);
    if (this.showActions) cols.push('actions');
    return cols;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['defaultPageSize']) {
      this.pageSize = this.defaultPageSize;
      this.filteredData = [...this.data];
      this.pageIndex = 0;
      this.updatePage();
    }
  }

  onSort(sort: Sort): void {
    if (!sort.active || sort.direction === '') {
      this.filteredData = [...this.data];
    } else {
      this.filteredData = [...this.data].sort((a, b) => {
        const aVal = a[sort.active];
        const bVal = b[sort.active];
        const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return sort.direction === 'asc' ? cmp : -cmp;
      });
    }
    this.pageIndex = 0;
    this.updatePage();
  }

  onPageSizeChange(): void {
    this.pageIndex = 0;
    this.updatePage();
  }

  goToPage(p: number): void { this.pageIndex = p; this.updatePage(); }
  goToFirst(): void { this.pageIndex = 0; this.updatePage(); }
  goToLast(): void { this.pageIndex = this.totalPages - 1; this.updatePage(); }
  goToPrev(): void { if (this.pageIndex > 0) { this.pageIndex--; this.updatePage(); } }
  goToNext(): void { if (this.pageIndex < this.totalPages - 1) { this.pageIndex++; this.updatePage(); } }

  private updatePage(): void {
    this.totalPages = Math.ceil(this.filteredData.length / this.pageSize);
    this.startIndex = this.pageIndex * this.pageSize;
    this.endIndex = Math.min(this.startIndex + this.pageSize, this.filteredData.length);
    this.pagedData = this.filteredData.slice(this.startIndex, this.endIndex);
    this.calcVisiblePages();
  }

  private calcVisiblePages(): void {
    const maxVisible = 5;
    let start = Math.max(0, this.pageIndex - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible);
    if (end - start < maxVisible) start = Math.max(0, end - maxVisible);
    this.visiblePages = Array.from({ length: end - start }, (_, i) => start + i);
  }

  getBadgeColor(col: ColumnDef, value: string): string {
    return col.badgeMap?.[value]?.color || '#607D8B';
  }
  getBadgeLabel(col: ColumnDef, value: string): string {
    return col.badgeMap?.[value]?.label || value;
  }
}
