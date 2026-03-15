import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,
    MatSnackBarModule
  ],
  template: `
    <div class="container page-content auth-page">
      <div class="auth-card clay-card">
        <div class="auth-header">
          <mat-icon class="auth-icon">login</mat-icon>
          <h2>Prijava</h2>
        </div>

        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Korisničko ime</mat-label>
            <input matInput [(ngModel)]="username" name="username" required />
            <mat-icon matPrefix>person</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Lozinka</mat-label>
            <input matInput [type]="hidePassword ? 'password' : 'text'"
              [(ngModel)]="password" name="password" required />
            <mat-icon matPrefix>lock</mat-icon>
            <button mat-icon-button matSuffix type="button"
              (click)="hidePassword = !hidePassword">
              <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
          </mat-form-field>

          <button mat-raised-button type="submit" class="submit-btn full-width"
            [disabled]="!loginForm.valid">
            Prijavi se
          </button>
        </form>

        <p class="auth-link">
          Nemate nalog? <a routerLink="/register">Registrujte se</a>
        </p>

        <div class="test-accounts">
          <p><strong>Test nalozi:</strong></p>
          <p>marko / marko123</p>
          <p>ana / ana123</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding-top: 60px;
    }

    .auth-card {
      width: 100%;
      max-width: 420px;
      padding: 40px !important;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 32px;

      .auth-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        color: var(--peach);
      }

      h2 { margin: 8px 0 0; }
    }

    .full-width { width: 100%; }

    .submit-btn {
      background: var(--peach) !important;
      color: var(--text-primary) !important;
      border-radius: 14px !important;
      padding: 10px !important;
      font-size: 1rem !important;
      margin-top: 8px;
    }

    .auth-link {
      text-align: center;
      margin-top: 24px;
      color: var(--text-secondary);

      a {
        color: var(--text-primary);
        font-weight: 700;
        text-decoration: underline;
      }
    }

    .test-accounts {
      margin-top: 24px;
      padding: 16px;
      background: var(--lilac);
      border-radius: 14px;
      font-size: 0.85rem;
      text-align: center;

      p { margin: 4px 0; }
    }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  hidePassword = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  onSubmit(): void {
    if (this.authService.login(this.username, this.password)) {
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
      this.router.navigateByUrl(returnUrl);
      this.snackBar.open('Uspešna prijava!', 'OK', { duration: 2000 });
    } else {
      this.snackBar.open('Pogrešno korisničko ime ili lozinka', 'OK', { duration: 3000 });
    }
  }
}
