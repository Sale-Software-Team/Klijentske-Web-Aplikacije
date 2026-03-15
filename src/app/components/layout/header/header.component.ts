import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatToolbarModule, MatButtonModule,
    MatIconModule, MatBadgeModule, MatMenuModule
  ],
  template: `
    <mat-toolbar class="header-toolbar">
      <div class="toolbar-content container">
        <div class="left-section">
          <button mat-icon-button class="menu-btn" (click)="toggleSidenav.emit()">
            <mat-icon>menu</mat-icon>
          </button>
          <a routerLink="/" class="logo">
            <mat-icon class="logo-icon">toys</mat-icon>
            <span class="logo-text">IgračkaShop</span>
          </a>
        </div>

        <nav class="nav-links">
          <a mat-button routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Početna</a>
          <a mat-button routerLink="/toys" routerLinkActive="active">Igračke</a>
        </nav>

        <div class="right-section">
          <a mat-icon-button routerLink="/cart" class="cart-btn">
            <mat-icon [matBadge]="cartCount$ | async" matBadgeColor="warn"
              [matBadgeHidden]="(cartCount$ | async) === 0">
              shopping_cart
            </mat-icon>
          </a>

          @if (authService.isLoggedIn$ | async) {
            <button mat-button [matMenuTriggerFor]="userMenu" class="user-btn">
              <mat-icon>person</mat-icon>
              <span class="username">{{ (authService.currentUser$ | async)?.firstName }}</span>
            </button>
            <mat-menu #userMenu="matMenu">
              <a mat-menu-item routerLink="/profile">
                <mat-icon>account_circle</mat-icon> Profil
              </a>
              <a mat-menu-item routerLink="/cart">
                <mat-icon>shopping_cart</mat-icon> Korpa
              </a>
              <button mat-menu-item (click)="authService.logout()">
                <mat-icon>logout</mat-icon> Odjavi se
              </button>
            </mat-menu>
          } @else {
            <a mat-button routerLink="/login" class="auth-btn">Prijava</a>
            <a mat-raised-button routerLink="/register" class="register-btn">Registracija</a>
          }
        </div>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .header-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: var(--white) !important;
      padding: 0 !important;
      height: auto !important;
      min-height: 64px;
    }

    .toolbar-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 8px 24px;
    }

    .left-section {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .menu-btn {
      display: none;

      @media (max-width: 768px) {
        display: inline-flex;
      }
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
    }

    .logo-icon {
      color: var(--peach);
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .logo-text {
      font-family: 'Fredoka', sans-serif;
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .nav-links {
      display: flex;
      gap: 8px;

      @media (max-width: 768px) {
        display: none;
      }

      a {
        font-family: 'Nunito', sans-serif;
        font-weight: 600;
        border-radius: 14px;

        &.active {
          background: rgba(253, 188, 180, 0.2);
        }
      }
    }

    .right-section {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .cart-btn {
      margin-right: 4px;
    }

    .user-btn {
      border-radius: 14px;
    }

    .username {
      @media (max-width: 480px) {
        display: none;
      }
    }

    .auth-btn {
      @media (max-width: 480px) {
        display: none;
      }
    }

    .register-btn {
      background: var(--peach) !important;
      color: var(--text-primary) !important;
      border-radius: 14px !important;

      @media (max-width: 480px) {
        font-size: 0.8rem;
        padding: 0 12px;
      }
    }
  `]
})
export class HeaderComponent {
  @Output() toggleSidenav = new EventEmitter<void>();

  cartCount$;

  constructor(
    public authService: AuthService,
    private cartService: CartService
  ) {
    this.cartCount$ = this.cartService.cartCount$;
  }
}
