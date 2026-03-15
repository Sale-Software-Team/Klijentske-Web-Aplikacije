import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { ToyService } from '../../../services/toy.service';
import { ToyType } from '../../../models/toy.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,
    MatChipsModule, MatSnackBarModule
  ],
  template: `
    <div class="container page-content auth-page">
      <div class="auth-card clay-card">
        <div class="auth-header">
          <mat-icon class="auth-icon">person_add</mat-icon>
          <h2>Registracija</h2>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Ime</mat-label>
              <input matInput formControlName="firstName" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Prezime</mat-label>
              <input matInput formControlName="lastName" />
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" type="email" />
            <mat-icon matPrefix>email</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Telefon</mat-label>
            <input matInput formControlName="phone" />
            <mat-icon matPrefix>phone</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Adresa</mat-label>
            <input matInput formControlName="address" />
            <mat-icon matPrefix>home</mat-icon>
          </mat-form-field>

          <div class="chip-section">
            <label>Omiljeni tipovi igračaka:</label>
            <div class="chip-list">
              @for (type of toyTypes; track type.typeId) {
                <button type="button" class="type-chip"
                  [class.selected]="selectedTypes.includes(type.name)"
                  (click)="toggleType(type.name)">
                  {{ type.name }}
                </button>
              }
            </div>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Korisničko ime</mat-label>
            <input matInput formControlName="username" />
            <mat-icon matPrefix>person</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Lozinka</mat-label>
            <input matInput formControlName="password" type="password" />
            <mat-icon matPrefix>lock</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Potvrda lozinke</mat-label>
            <input matInput formControlName="confirmPassword" type="password" />
            <mat-icon matPrefix>lock</mat-icon>
            @if (form.hasError('passwordMismatch')) {
              <mat-error>Lozinke se ne poklapaju</mat-error>
            }
          </mat-form-field>

          <button mat-raised-button type="submit" class="submit-btn full-width"
            [disabled]="!form.valid">
            Registruj se
          </button>
        </form>

        <p class="auth-link">
          Već imate nalog? <a routerLink="/login">Prijavite se</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding-top: 40px;
    }

    .auth-card {
      width: 100%;
      max-width: 520px;
      padding: 40px !important;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 24px;

      .auth-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        color: var(--baby-blue);
      }

      h2 { margin: 8px 0 0; }
    }

    .form-row {
      display: flex;
      gap: 12px;

      mat-form-field { flex: 1; }

      @media (max-width: 480px) {
        flex-direction: column;
        gap: 0;
      }
    }

    .full-width { width: 100%; }

    .chip-section {
      margin-bottom: 16px;

      label {
        font-weight: 600;
        display: block;
        margin-bottom: 8px;
      }
    }

    .chip-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .type-chip {
      padding: 6px 16px;
      border-radius: 14px;
      border: 2px solid rgba(0, 0, 0, 0.08);
      background: var(--white);
      cursor: pointer;
      font-family: 'Nunito', sans-serif;
      font-size: 0.85rem;
      font-weight: 600;
      transition: all 0.2s;

      &:hover { background: var(--lilac); }

      &.selected {
        background: var(--baby-blue);
        border-color: rgba(0, 0, 0, 0.15);
      }
    }

    .submit-btn {
      background: var(--baby-blue) !important;
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
  `]
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  toyTypes: ToyType[] = [];
  selectedTypes: string[] = [];
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private toyService: ToyService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });

    this.toyService.getTypes().subscribe(types => this.toyTypes = types);
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  toggleType(typeName: string): void {
    const idx = this.selectedTypes.indexOf(typeName);
    if (idx >= 0) {
      this.selectedTypes.splice(idx, 1);
    } else {
      this.selectedTypes.push(typeName);
    }
  }

  onSubmit(): void {
    if (!this.form.valid) return;

    const { confirmPassword, ...userData } = this.form.value;

    if (this.userService.isUsernameTaken(userData.username)) {
      this.snackBar.open('Korisničko ime je zauzeto', 'OK', { duration: 3000 });
      return;
    }

    this.authService.register({
      ...userData,
      favoriteTypes: this.selectedTypes
    });

    this.snackBar.open('Uspešna registracija!', 'OK', { duration: 2000 });
    this.router.navigate(['/']);
  }
}
