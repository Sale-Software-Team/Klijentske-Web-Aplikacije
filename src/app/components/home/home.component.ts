import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Toy, ToyType } from '../../models/toy.model';
import { ToyService } from '../../services/toy.service';
import { ToyCardComponent } from '../toys/toy-card/toy-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatButtonModule, MatIconModule,
    MatCardModule, MatProgressSpinnerModule, ToyCardComponent
  ],
  template: `
    <div class="home-page">
      <!-- Hero Section -->
      <section class="hero">
        <div class="container hero-content">
          <div class="hero-text">
            <h1>Pronađi savršenu <span class="highlight">igračku</span> za tvoje dete</h1>
            <p>Istražite naš katalog od 30 pažljivo odabranih igračaka za sve uzraste.
               Rezervišite online i uživajte u igri!</p>
            <a mat-raised-button routerLink="/toys" class="hero-btn">
              <mat-icon>toys</mat-icon> Pregledaj igračke
            </a>
          </div>
          <div class="hero-visual">
            <div class="hero-shapes">
              <div class="shape shape-1"></div>
              <div class="shape shape-2"></div>
              <div class="shape shape-3"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Toys -->
      <section class="featured container">
        <h2>Istaknute igračke</h2>
        @if (loading) {
          <div class="loading">
            <mat-spinner diameter="40"></mat-spinner>
          </div>
        } @else {
          <div class="toy-grid">
            @for (toy of featuredToys; track toy.toyId) {
              <app-toy-card [toy]="toy"></app-toy-card>
            }
          </div>
        }
      </section>

      <!-- Categories -->
      <section class="categories container">
        <h2>Kategorije</h2>
        <div class="category-grid">
          @for (type of toyTypes; track type.typeId) {
            <a [routerLink]="['/toys']" [queryParams]="{ type: type.name }" class="category-card clay-card-hover">
              <mat-icon>{{ getCategoryIcon(type.name) }}</mat-icon>
              <h3>{{ type.name }}</h3>
            </a>
          }
        </div>
      </section>
    </div>
  `,
  styles: [`
    .hero {
      background: linear-gradient(135deg, var(--peach) 0%, var(--lilac) 50%, var(--baby-blue) 100%);
      padding: 60px 0;
      position: relative;
      overflow: hidden;
    }

    .hero-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 40px;

      @media (max-width: 768px) {
        flex-direction: column;
        text-align: center;
      }
    }

    .hero-text {
      max-width: 560px;

      h1 {
        font-size: 2.8rem;
        margin: 0 0 16px;
        line-height: 1.2;

        @media (max-width: 768px) {
          font-size: 2rem;
        }
      }

      .highlight {
        color: #E85D75;
      }

      p {
        font-size: 1.15rem;
        color: var(--text-secondary);
        line-height: 1.6;
        margin-bottom: 24px;
      }
    }

    .hero-btn {
      background: var(--white) !important;
      color: var(--text-primary) !important;
      border-radius: 14px !important;
      padding: 10px 32px !important;
      font-size: 1.1rem !important;
      box-shadow: var(--clay-shadow) !important;
    }

    .hero-visual {
      position: relative;
      width: 300px;
      height: 300px;
      flex-shrink: 0;

      @media (max-width: 768px) {
        width: 200px;
        height: 200px;
      }
    }

    .hero-shapes {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .shape {
      position: absolute;
      border-radius: var(--clay-radius);
      border: var(--clay-border);
    }

    .shape-1 {
      width: 150px;
      height: 150px;
      background: var(--white);
      top: 20px;
      left: 20px;
      box-shadow: var(--clay-shadow);
      animation: float 3s ease-in-out infinite;
    }

    .shape-2 {
      width: 100px;
      height: 100px;
      background: var(--mint);
      bottom: 30px;
      right: 0;
      box-shadow: var(--clay-shadow);
      animation: float 3s ease-in-out infinite 0.5s;
      border-radius: 50%;
    }

    .shape-3 {
      width: 70px;
      height: 70px;
      background: var(--baby-blue);
      top: 0;
      right: 50px;
      box-shadow: var(--clay-shadow);
      animation: float 3s ease-in-out infinite 1s;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-15px); }
    }

    .featured {
      padding: 48px 0;

      h2 { margin-bottom: 24px; }
    }

    .loading {
      display: flex;
      justify-content: center;
      padding: 40px;
    }

    .categories {
      padding: 0 24px 48px;

      h2 { margin-bottom: 24px; }
    }

    .category-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 16px;

      @media (max-width: 1024px) {
        grid-template-columns: repeat(3, 1fr);
      }

      @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .category-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 24px 16px !important;
      text-align: center;
      text-decoration: none;
      color: var(--text-primary);

      mat-icon {
        font-size: 36px;
        width: 36px;
        height: 36px;
        color: var(--peach);
      }

      h3 {
        font-size: 0.9rem;
        margin: 0;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  featuredToys: Toy[] = [];
  toyTypes: ToyType[] = [];
  loading = true;

  constructor(private toyService: ToyService) {}

  ngOnInit(): void {
    this.toyService.getAllToys().subscribe(toys => {
      this.featuredToys = toys.slice(0, 6);
      this.loading = false;
    });
    this.toyService.getTypes().subscribe(types => this.toyTypes = types);
  }

  getCategoryIcon(typeName: string): string {
    const icons: Record<string, string> = {
      'Slagalica': 'extension',
      'Slikovnica': 'menu_book',
      'Figura': 'person',
      'Karakter': 'face',
      'Plišana igračka': 'pets',
      'Edukativna igračka': 'school',
      'Konstrukciona igračka': 'construction',
      'Društvena igra': 'casino',
      'Vozilo': 'directions_car',
      'Lutka': 'child_care'
    };
    return icons[typeName] || 'toys';
  }
}
