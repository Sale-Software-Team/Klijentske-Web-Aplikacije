import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';
import { ToyService } from '../../../services/toy.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatIconModule, MatSnackBarModule,
    MatDividerModule
  ],
  template: `
    <div class="container page-content">
      <h1>Profil</h1>

      @if (user) {
        <div class="profile-layout">
          <div class="profile-card clay-card">
            <div class="profile-header">
              <div class="avatar">
                <mat-icon>person</mat-icon>
              </div>
              <h2>{{ user.firstName }} {{ user.lastName }}</h2>
              <p class="username">&#64;{{ user.username }}</p>
            </div>

            @if (editMode) {
              <div class="edit-form">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Ime</mat-label>
                  <input matInput [(ngModel)]="editData.firstName" />
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Prezime</mat-label>
                  <input matInput [(ngModel)]="editData.lastName" />
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Email</mat-label>
                  <input matInput [(ngModel)]="editData.email" type="email" />
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Telefon</mat-label>
                  <input matInput [(ngModel)]="editData.phone" />
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Adresa</mat-label>
                  <input matInput [(ngModel)]="editData.address" />
                </mat-form-field>

                <div class="edit-actions">
                  <button mat-button (click)="editMode = false">Otkaži</button>
                  <button mat-raised-button class="save-btn" (click)="saveProfile()">
                    <mat-icon>save</mat-icon> Sačuvaj
                  </button>
                </div>
              </div>
            } @else {
              <div class="profile-info">
                <div class="info-row">
                  <mat-icon>email</mat-icon>
                  <span>{{ user.email }}</span>
                </div>
                <div class="info-row">
                  <mat-icon>phone</mat-icon>
                  <span>{{ user.phone }}</span>
                </div>
                <div class="info-row">
                  <mat-icon>home</mat-icon>
                  <span>{{ user.address }}</span>
                </div>
                <div class="info-row">
                  <mat-icon>favorite</mat-icon>
                  <span>{{ user.favoriteTypes.join(', ') || 'Nema omiljenih tipova' }}</span>
                </div>

                <button mat-raised-button class="edit-btn" (click)="startEdit()">
                  <mat-icon>edit</mat-icon> Izmeni profil
                </button>
              </div>
            }
          </div>

          <div class="history-card clay-card">
            <h2>Istorija rezervacija</h2>
            <mat-divider></mat-divider>
            @if ((cartService.cartItems$ | async)?.length === 0) {
              <p class="empty">Nemate rezervacija</p>
            } @else {
              @for (item of cartService.cartItems$ | async; track item.id) {
                <div class="history-item">
                  <img [src]="toyService.getImageUrl(item.toy)" [alt]="item.toy.name" class="history-img" />
                  <div class="history-details">
                    <strong>{{ item.toy.name }}</strong>
                    <span class="history-price">{{ item.toy.price | number:'1.0-0' }} RSD</span>
                  </div>
                  <span class="status-badge" [class]="item.status">{{ item.status }}</span>
                </div>
              }
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    h1 { margin-bottom: 24px; }

    .profile-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    .profile-card {
      padding: 32px !important;
    }

    .profile-header {
      text-align: center;
      margin-bottom: 24px;

      .avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: var(--lilac);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 12px;

        mat-icon {
          font-size: 40px;
          width: 40px;
          height: 40px;
        }
      }

      h2 { margin: 0; }

      .username {
        color: var(--text-light);
        margin: 4px 0 0;
      }
    }

    .profile-info {
      .info-row {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 0;
        border-bottom: 1px solid rgba(0,0,0,0.05);

        mat-icon {
          color: var(--peach);
          font-size: 20px;
          width: 20px;
          height: 20px;
        }
      }
    }

    .edit-btn {
      margin-top: 20px;
      background: var(--baby-blue) !important;
      color: var(--text-primary) !important;
      border-radius: 14px !important;
      width: 100%;
    }

    .full-width { width: 100%; }

    .edit-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 8px;
    }

    .save-btn {
      background: var(--mint) !important;
      color: var(--text-primary) !important;
      border-radius: 14px !important;
    }

    .history-card {
      padding: 32px !important;

      h2 { margin: 0 0 16px; }

      mat-divider { margin-bottom: 16px; }
    }

    .history-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 0;
      border-bottom: 1px solid rgba(0,0,0,0.05);
    }

    .history-img {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      object-fit: cover;
    }

    .history-details {
      flex: 1;
      display: flex;
      flex-direction: column;

      .history-price {
        font-size: 0.85rem;
        color: var(--text-light);
      }
    }

    .empty {
      color: var(--text-light);
      font-style: italic;
      text-align: center;
      padding: 24px;
    }
  `]
})
export class ProfilePageComponent implements OnInit {
  user: User | null = null;
  editMode = false;
  editData: Partial<User> = {};

  constructor(
    private authService: AuthService,
    public cartService: CartService,
    public toyService: ToyService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
  }

  startEdit(): void {
    if (!this.user) return;
    this.editData = {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      phone: this.user.phone,
      address: this.user.address
    };
    this.editMode = true;
  }

  saveProfile(): void {
    this.authService.updateCurrentUser(this.editData);
    this.editMode = false;
    this.snackBar.open('Profil ažuriran!', 'OK', { duration: 2000 });
  }
}
