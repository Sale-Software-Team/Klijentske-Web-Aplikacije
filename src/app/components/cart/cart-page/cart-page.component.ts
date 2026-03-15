import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CartService } from '../../../services/cart.service';
import { ToyService } from '../../../services/toy.service';
import { AuthService } from '../../../services/auth.service';
import { CartItemComponent } from '../cart-item/cart-item.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatIconModule, MatButtonModule,
    MatDialogModule, MatSnackBarModule, CartItemComponent
  ],
  template: `
    <div class="container page-content">
      <h1>Korpa</h1>

      @if ((cartService.cartItems$ | async)?.length === 0) {
        <div class="empty-cart clay-card">
          <mat-icon>shopping_cart</mat-icon>
          <h3>Korpa je prazna</h3>
          <p>Dodajte igračke iz kataloga</p>
          <a mat-raised-button routerLink="/toys" class="browse-btn">
            <mat-icon>toys</mat-icon> Pregledaj igračke
          </a>
        </div>
      } @else {
        <div class="cart-items">
          @for (item of cartService.cartItems$ | async; track item.id) {
            <app-cart-item
              [item]="item"
              (changeStatus)="onChangeStatus(item.id, $event)"
              (remove)="onRemove(item.id)"
              (cancel)="onCancel(item.id)"
              (rate)="onRate(item.id, $event, item)">
            </app-cart-item>
          }
        </div>

        <div class="cart-summary clay-card">
          <div class="summary-row">
            <span>Ukupna cena:</span>
            <span class="total-price">{{ cartService.totalPrice$ | async | number:'1.0-0' }} RSD</span>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    h1 { margin-bottom: 24px; }

    .empty-cart {
      text-align: center;
      padding: 64px !important;

      mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        color: var(--text-light);
      }

      h3 { margin: 16px 0 8px; }
      p { color: var(--text-light); margin-bottom: 24px; }
    }

    .browse-btn {
      background: var(--peach) !important;
      color: var(--text-primary) !important;
      border-radius: 14px !important;
    }

    .cart-summary {
      margin-top: 24px;
      padding: 24px !important;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 1.2rem;
    }

    .total-price {
      font-family: 'Fredoka', sans-serif;
      font-size: 1.8rem;
      font-weight: 600;
    }
  `]
})
export class CartPageComponent {
  constructor(
    public cartService: CartService,
    private toyService: ToyService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  onChangeStatus(itemId: number, status: 'rezervisano' | 'pristiglo' | 'otkazano'): void {
    this.cartService.updateStatus(itemId, status);
    this.snackBar.open('Status ažuriran', 'OK', { duration: 2000 });
  }

  onRemove(itemId: number): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Ukloni iz korpe',
        message: 'Da li ste sigurni da želite da uklonite ovu igračku iz korpe?'
      }
    });
    ref.afterClosed().subscribe(result => {
      if (result) {
        this.cartService.removeFromCart(itemId);
        this.snackBar.open('Igračka uklonjena iz korpe', 'OK', { duration: 2000 });
      }
    });
  }

  onCancel(itemId: number): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Otkaži rezervaciju',
        message: 'Da li ste sigurni da želite da otkažete ovu rezervaciju?'
      }
    });
    ref.afterClosed().subscribe(result => {
      if (result) {
        this.cartService.updateStatus(itemId, 'otkazano');
        this.snackBar.open('Rezervacija otkazana', 'OK', { duration: 2000 });
      }
    });
  }

  onRate(itemId: number, rating: number, item: any): void {
    this.cartService.rateToy(itemId, rating);

    if (this.authService.currentUser) {
      this.toyService.addReview({
        toyId: item.toy.toyId,
        userId: this.authService.currentUser.id,
        userName: `${this.authService.currentUser.firstName} ${this.authService.currentUser.lastName}`,
        rating,
        comment: `Ocena: ${rating}/5`,
        date: new Date().toISOString(),
        reviewerType: 'roditelj'
      });
    }

    this.snackBar.open('Ocena sačuvana!', 'OK', { duration: 2000 });
  }
}
