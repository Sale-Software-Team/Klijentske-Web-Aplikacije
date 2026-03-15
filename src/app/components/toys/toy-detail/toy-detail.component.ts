import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { Toy } from '../../../models/toy.model';
import { Review } from '../../../models/review.model';
import { ToyService } from '../../../services/toy.service';
import { CartService } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth.service';
import { RatingComponent } from '../../shared/rating/rating.component';
import { ReviewListComponent } from '../../shared/review-list/review-list.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toy-detail',
  standalone: true,
  imports: [
    CommonModule, RouterModule, FormsModule, MatCardModule, MatButtonModule,
    MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatSnackBarModule, MatProgressSpinnerModule, MatDividerModule,
    RatingComponent, ReviewListComponent
  ],
  template: `
    @if (loading) {
      <div class="loading container">
        <mat-spinner diameter="48"></mat-spinner>
      </div>
    } @else if (toy) {
      <div class="container page-content">
        <div class="detail-layout">
          <div class="detail-image clay-card">
            <img [src]="toyService.getImageUrl(toy)" [alt]="toy.name" />
          </div>

          <div class="detail-info">
            <div class="detail-type">{{ toy.type.name }}</div>
            <h1>{{ toy.name }}</h1>

            <div class="detail-rating">
              <app-rating [rating]="toy.averageRating" [showValue]="true"></app-rating>
              <span class="review-count">({{ toy.reviews.length }} recenzija)</span>
            </div>

            <p class="detail-description">{{ toy.description }}</p>

            <div class="detail-meta">
              <div class="meta-item">
                <mat-icon>child_care</mat-icon>
                <span><strong>Uzrast:</strong> {{ toy.ageGroup.name }}</span>
              </div>
              <div class="meta-item">
                <mat-icon>people</mat-icon>
                <span><strong>Ciljna grupa:</strong> {{ toy.targetGroup }}</span>
              </div>
              <div class="meta-item">
                <mat-icon>calendar_today</mat-icon>
                <span><strong>Datum proizvodnje:</strong> {{ toy.productionDate | date:'dd.MM.yyyy.' }}</span>
              </div>
            </div>

            <div class="detail-price">
              {{ toy.price | number:'1.0-0' }} RSD
            </div>

            <button mat-raised-button class="reserve-btn" (click)="addToCart()">
              <mat-icon>add_shopping_cart</mat-icon> Rezerviši
            </button>
          </div>
        </div>

        <mat-divider class="section-divider"></mat-divider>

        <section class="reviews-section">
          <h2>Recenzije</h2>

          @if (canReview) {
            <div class="review-form clay-card">
              <h3>Dodaj recenziju</h3>
              <div class="form-rating">
                <label>Vaša ocena:</label>
                <app-rating [rating]="newReview.rating" [interactive]="true" (ratingChange)="newReview.rating = $event"></app-rating>
              </div>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Komentar</mat-label>
                <textarea matInput [(ngModel)]="newReview.comment" rows="3"
                  placeholder="Napišite svoju recenziju..."></textarea>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Tip recenzenta</mat-label>
                <mat-select [(value)]="newReview.reviewerType">
                  <mat-option value="roditelj">Roditelj</mat-option>
                  <mat-option value="dete">Dete</mat-option>
                </mat-select>
              </mat-form-field>
              <button mat-raised-button class="submit-review-btn" (click)="submitReview()"
                [disabled]="!newReview.rating || !newReview.comment">
                <mat-icon>send</mat-icon> Pošalji recenziju
              </button>
            </div>
          }

          <app-review-list [reviews]="toy.reviews"></app-review-list>
        </section>
      </div>
    }
  `,
  styles: [`
    .loading {
      display: flex;
      justify-content: center;
      padding: 100px;
    }

    .detail-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-bottom: 40px;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 24px;
      }
    }

    .detail-image {
      overflow: hidden;
      padding: 0 !important;

      img {
        width: 100%;
        height: auto;
        display: block;
      }
    }

    .detail-type {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-light);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 4px;
    }

    h1 {
      margin: 0 0 12px;
      font-size: 2rem;
    }

    .detail-rating {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;

      .review-count {
        font-size: 0.85rem;
        color: var(--text-light);
      }
    }

    .detail-description {
      line-height: 1.7;
      color: var(--text-secondary);
      margin-bottom: 20px;
    }

    .detail-meta {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 20px;

      .meta-item {
        display: flex;
        align-items: center;
        gap: 10px;

        mat-icon {
          color: var(--peach);
          font-size: 20px;
          width: 20px;
          height: 20px;
        }
      }
    }

    .detail-price {
      font-family: 'Fredoka', sans-serif;
      font-size: 2rem;
      font-weight: 600;
      margin-bottom: 20px;
    }

    .reserve-btn {
      background: var(--peach) !important;
      color: var(--text-primary) !important;
      border-radius: 14px !important;
      padding: 8px 32px !important;
      font-size: 1.1rem !important;
    }

    .section-divider {
      margin: 40px 0;
    }

    .reviews-section h2 {
      margin-bottom: 20px;
    }

    .review-form {
      margin-bottom: 24px;

      h3 { margin: 0 0 16px; }

      .form-rating {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;

        label {
          font-weight: 600;
        }
      }

      .full-width {
        width: 100%;
      }
    }

    .submit-review-btn {
      background: var(--baby-blue) !important;
      color: var(--text-primary) !important;
      border-radius: 14px !important;
    }
  `]
})
export class ToyDetailComponent implements OnInit {
  toy: Toy | null = null;
  loading = true;
  canReview = false;

  newReview = {
    rating: 0,
    comment: '',
    reviewerType: 'roditelj' as 'dete' | 'roditelj'
  };

  constructor(
    private route: ActivatedRoute,
    public toyService: ToyService,
    private cartService: CartService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.toyService.getToyById(id).subscribe({
      next: toy => {
        this.toy = toy;
        this.loading = false;
        this.checkCanReview();
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  private checkCanReview(): void {
    if (!this.toy) return;
    this.canReview = this.authService.isLoggedIn &&
      this.cartService.hasArrivedToy(this.toy.toyId);
  }

  addToCart(): void {
    if (!this.toy) return;
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: `/toys/${this.toy.toyId}` } });
      this.snackBar.open('Morate se prijaviti da biste rezervisali igračku', 'OK', { duration: 3000 });
      return;
    }
    this.cartService.addToCart(this.toy);
    this.snackBar.open(`${this.toy.name} dodato u korpu!`, 'OK', { duration: 2000 });
  }

  submitReview(): void {
    if (!this.toy || !this.authService.currentUser) return;

    this.toyService.addReview({
      toyId: this.toy.toyId,
      userId: this.authService.currentUser.id,
      userName: `${this.authService.currentUser.firstName} ${this.authService.currentUser.lastName}`,
      rating: this.newReview.rating,
      comment: this.newReview.comment,
      date: new Date().toISOString(),
      reviewerType: this.newReview.reviewerType
    });

    // Refresh toy data
    this.toyService.getToyById(this.toy.toyId).subscribe(toy => {
      this.toy = toy;
    });

    this.newReview = { rating: 0, comment: '', reviewerType: 'roditelj' };
    this.snackBar.open('Recenzija uspešno dodata!', 'OK', { duration: 2000 });
  }
}
