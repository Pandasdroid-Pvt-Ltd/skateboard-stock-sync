import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatIconModule],
  template: `
    <mat-form-field appearance="outline" class="search-field">
      <mat-icon matPrefix>search</mat-icon>
      <input matInput [placeholder]="placeholder" [(ngModel)]="query" (ngModelChange)="search.emit($event)">
    </mat-form-field>
  `,
  styles: [`
    .search-field {
      width: 100%;
      max-width: 400px;
      ::ng-deep .mat-mdc-form-field-subscript-wrapper { display: none; }
    }
  `]
})
export class SearchInputComponent {
  @Input() placeholder = 'Search...';
  @Output() search = new EventEmitter<string>();
  query = '';
}
