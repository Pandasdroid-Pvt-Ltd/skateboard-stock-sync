import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <mat-card class="stat-card" [style.border-left-color]="color">
      <mat-card-content>
        <div class="stat-content">
          <div class="stat-info">
            <span class="stat-label">{{ label }}</span>
            <span class="stat-value">{{ prefix }}{{ value | number }}{{ suffix }}</span>
            <span class="stat-change" *ngIf="change" [class.positive]="change > 0" [class.negative]="change < 0">
              <mat-icon>{{ change > 0 ? 'trending_up' : 'trending_down' }}</mat-icon>
              {{ change > 0 ? '+' : '' }}{{ change }}%
            </span>
          </div>
          <div class="stat-icon" [style.background-color]="color + '20'" [style.color]="color">
            <mat-icon>{{ icon }}</mat-icon>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .stat-card {
      border-left: 4px solid;
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: pointer;
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 20px rgba(0,0,0,0.12);
      }
    }
    .stat-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .stat-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .stat-label {
      font-size: 13px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 500;
    }
    .stat-value {
      font-size: 28px;
      font-weight: 700;
      color: #1a1a2e;
      line-height: 1.2;
    }
    .stat-change {
      display: flex;
      align-items: center;
      gap: 2px;
      font-size: 12px;
      font-weight: 500;
      mat-icon { font-size: 14px; width: 14px; height: 14px; }
      &.positive { color: #4caf50; }
      &.negative { color: #f44336; }
    }
    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      mat-icon { font-size: 28px; width: 28px; height: 28px; }
    }
  `]
})
export class StatCardComponent {
  @Input() label = '';
  @Input() value: number | string = 0;
  @Input() icon = 'info';
  @Input() color = '#e94560';
  @Input() prefix = '';
  @Input() suffix = '';
  @Input() change?: number;
}
