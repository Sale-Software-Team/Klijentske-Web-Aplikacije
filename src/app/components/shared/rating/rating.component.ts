import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="rating" [class.interactive]="interactive">
      @for (star of stars; track star) {
        <mat-icon
          (click)="interactive && onStarClick(star)"
          (mouseenter)="interactive && (hoverRating = star)"
          (mouseleave)="interactive && (hoverRating = 0)"
          [class.filled]="star <= displayRating"
          [class.half]="star - 0.5 === displayRating"
        >
          {{ getStarIcon(star) }}
        </mat-icon>
      }
      @if (showValue && rating > 0) {
        <span class="rating-value">{{ rating }}</span>
      }
    </div>
  `,
  styles: [`
    .rating {
      display: inline-flex;
      align-items: center;
      gap: 2px;
    }

    mat-icon {
      color: #DDD;
      font-size: 22px;
      width: 22px;
      height: 22px;

      &.filled { color: #FFD700; }
      &.half { color: #FFD700; }
    }

    .interactive mat-icon {
      cursor: pointer;
      transition: transform 0.15s ease;

      &:hover { transform: scale(1.2); }
    }

    .rating-value {
      margin-left: 6px;
      font-weight: 600;
      font-size: 0.9rem;
      color: var(--text-secondary);
    }
  `]
})
export class RatingComponent {
  @Input() rating = 0;
  @Input() interactive = false;
  @Input() showValue = false;
  @Output() ratingChange = new EventEmitter<number>();

  stars = [1, 2, 3, 4, 5];
  hoverRating = 0;

  get displayRating(): number {
    return this.hoverRating || this.rating;
  }

  getStarIcon(star: number): string {
    const r = this.displayRating;
    if (star <= r) return 'star';
    if (star - 0.5 <= r) return 'star_half';
    return 'star_border';
  }

  onStarClick(star: number): void {
    this.rating = star;
    this.ratingChange.emit(star);
  }
}
