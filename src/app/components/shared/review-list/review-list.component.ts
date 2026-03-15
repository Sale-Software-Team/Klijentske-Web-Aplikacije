import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { Review } from '../../../models/review.model';
import { RatingComponent } from '../rating/rating.component';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatBadgeModule, MatIconModule, RatingComponent],
  template: `
    @if (reviews.length === 0) {
      <p class="no-reviews">Još nema recenzija za ovu igračku.</p>
    }
    @for (review of reviews; track review.id) {
      <div class="review-card clay-card">
        <div class="review-header">
          <div class="reviewer-info">
            <mat-icon>person</mat-icon>
            <strong>{{ review.userName }}</strong>
            <span class="reviewer-badge" [class]="review.reviewerType">
              {{ review.reviewerType === 'dete' ? 'Dete' : 'Roditelj' }}
            </span>
          </div>
          <app-rating [rating]="review.rating"></app-rating>
        </div>
        <p class="review-comment">{{ review.comment }}</p>
        <span class="review-date">{{ review.date | date:'dd.MM.yyyy.' }}</span>
      </div>
    }
  `,
  styles: [`
    .review-card {
      margin-bottom: 16px;
      padding: 16px !important;
    }

    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      flex-wrap: wrap;
      gap: 8px;
    }

    .reviewer-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .reviewer-badge {
      font-size: 0.75rem;
      padding: 2px 10px;
      border-radius: 10px;
      font-weight: 600;

      &.dete { background: var(--baby-blue); }
      &.roditelj { background: var(--lilac); }
    }

    .review-comment {
      margin: 8px 0;
      line-height: 1.5;
    }

    .review-date {
      font-size: 0.8rem;
      color: var(--text-light);
    }

    .no-reviews {
      color: var(--text-light);
      font-style: italic;
      text-align: center;
      padding: 24px;
    }
  `]
})
export class ReviewListComponent {
  @Input() reviews: Review[] = [];
}
