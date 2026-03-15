import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CartItem } from '../../../models/cart-item.model';
import { ToyService } from '../../../services/toy.service';
import { RatingComponent } from '../../shared/rating/rating.component';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatIconModule, MatButtonModule,
    MatMenuModule, RatingComponent
  ],
  template: `
    <div class="cart-item clay-card" [class]="item.status">
      <div class="item-image" [routerLink]="['/toys', item.toy.toyId]">
        <img [src]="toyService.getImageUrl(item.toy)" [alt]="item.toy.name" />
      </div>

      <div class="item-details">
        <a [routerLink]="['/toys', item.toy.toyId]" class="item-name">{{ item.toy.name }}</a>
        <div class="item-meta">
          <span class="status-badge" [class]="item.status">{{ getStatusLabel() }}</span>
          <span class="item-date">{{ item.dateAdded | date:'dd.MM.yyyy.' }}</span>
        </div>
        <div class="item-price">{{ item.toy.price | number:'1.0-0' }} RSD</div>

        @if (item.status === 'pristiglo') {
          <div class="item-rating">
            <span>Vaša ocena:</span>
            <app-rating
              [rating]="item.userRating || 0"
              [interactive]="true"
              (ratingChange)="onRate($event)">
            </app-rating>
          </div>
        }
      </div>

      <div class="item-actions">
        @if (item.status === 'rezervisano') {
          <button mat-icon-button [matMenuTriggerFor]="statusMenu" matTooltip="Promeni status">
            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #statusMenu="matMenu">
            <button mat-menu-item (click)="changeStatus.emit('pristiglo')">
              <mat-icon>check_circle</mat-icon> Pristiglo
            </button>
            <button mat-menu-item (click)="cancel.emit()">
              <mat-icon>cancel</mat-icon> Otkaži
            </button>
          </mat-menu>
        }
        @if (item.status === 'pristiglo') {
          <button mat-icon-button (click)="remove.emit()" matTooltip="Ukloni">
            <mat-icon>delete</mat-icon>
          </button>
        }
      </div>
    </div>
  `,
  styles: [`
    .cart-item {
      display: flex;
      gap: 16px;
      align-items: center;
      padding: 16px !important;
      margin-bottom: 16px;

      &.otkazano {
        opacity: 0.6;
      }
    }

    .item-image {
      width: 100px;
      height: 100px;
      border-radius: 14px;
      overflow: hidden;
      flex-shrink: 0;
      cursor: pointer;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      @media (max-width: 480px) {
        width: 70px;
        height: 70px;
      }
    }

    .item-details {
      flex: 1;
    }

    .item-name {
      font-family: 'Fredoka', sans-serif;
      font-size: 1.1rem;
      font-weight: 500;
      display: block;
      margin-bottom: 6px;

      &:hover { text-decoration: underline; }
    }

    .item-meta {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 6px;
    }

    .item-date {
      font-size: 0.8rem;
      color: var(--text-light);
    }

    .item-price {
      font-family: 'Fredoka', sans-serif;
      font-size: 1.2rem;
      font-weight: 600;
    }

    .item-rating {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 6px;
      font-size: 0.85rem;
    }

    .item-actions {
      flex-shrink: 0;
    }
  `]
})
export class CartItemComponent {
  @Input({ required: true }) item!: CartItem;
  @Output() changeStatus = new EventEmitter<CartItem['status']>();
  @Output() remove = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() rate = new EventEmitter<number>();

  constructor(public toyService: ToyService) {}

  getStatusLabel(): string {
    switch (this.item.status) {
      case 'rezervisano': return 'Rezervisano';
      case 'pristiglo': return 'Pristiglo';
      case 'otkazano': return 'Otkazano';
    }
  }

  onRate(rating: number): void {
    this.rate.emit(rating);
  }
}
