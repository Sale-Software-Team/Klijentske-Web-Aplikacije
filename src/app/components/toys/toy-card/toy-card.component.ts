import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Toy } from '../../../models/toy.model';
import { ToyService } from '../../../services/toy.service';
import { CartService } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth.service';
import { RatingComponent } from '../../shared/rating/rating.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toy-card',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatCardModule, MatButtonModule,
    MatIconModule, MatSnackBarModule, RatingComponent
  ],
  template: `
    <mat-card class="toy-card bounce-in">
      <div class="card-image" [routerLink]="['/toys', toy.toyId]">
        <img [src]="toyService.getImageUrl(toy)" [alt]="toy.name" loading="lazy" />
      </div>
      <mat-card-content class="card-content">
        <div class="card-type">{{ toy.type.name }}</div>
        <h3 class="card-title">{{ toy.name }}</h3>
        <div class="card-meta">
          <app-rating [rating]="toy.averageRating" [showValue]="true"></app-rating>
          <span class="card-age">{{ toy.ageGroup.name }}</span>
        </div>
        <div class="card-price">{{ toy.price | number:'1.0-0' }} RSD</div>
      </mat-card-content>
      <mat-card-actions class="card-actions">
        <a mat-button [routerLink]="['/toys', toy.toyId]" class="view-btn">
          <mat-icon>visibility</mat-icon> Pogledaj
        </a>
        <button mat-raised-button class="reserve-btn" (click)="addToCart()">
          <mat-icon>add_shopping_cart</mat-icon> Rezerviši
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .toy-card {
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      padding: 0 !important;
    }

    .card-image {
      width: 100%;
      height: 220px;
      overflow: hidden;
      cursor: pointer;
      background: var(--lilac);
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }

      &:hover img {
        transform: scale(1.05);
      }
    }

    .card-content {
      padding: 16px;
      flex: 1;
    }

    .card-type {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-light);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 4px;
    }

    .card-title {
      font-size: 1.1rem;
      margin: 0 0 8px;
      line-height: 1.3;
    }

    .card-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      flex-wrap: wrap;
      gap: 4px;
    }

    .card-age {
      font-size: 0.8rem;
      background: var(--baby-blue);
      padding: 2px 10px;
      border-radius: 10px;
      font-weight: 600;
    }

    .card-price {
      font-family: 'Fredoka', sans-serif;
      font-size: 1.3rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .card-actions {
      padding: 8px 16px 16px;
      display: flex;
      justify-content: space-between;
      gap: 8px;
    }

    .view-btn {
      border-radius: 14px !important;
    }

    .reserve-btn {
      background: var(--peach) !important;
      color: var(--text-primary) !important;
      border-radius: 14px !important;
    }
  `]
})
export class ToyCardComponent {
  @Input({ required: true }) toy!: Toy;

  constructor(
    public toyService: ToyService,
    private cartService: CartService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  addToCart(): void {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/toys' } });
      this.snackBar.open('Morate se prijaviti da biste rezervisali igračku', 'OK', { duration: 3000 });
      return;
    }
    this.cartService.addToCart(this.toy);
    this.snackBar.open(`${this.toy.name} dodato u korpu!`, 'OK', { duration: 2000 });
  }
}
