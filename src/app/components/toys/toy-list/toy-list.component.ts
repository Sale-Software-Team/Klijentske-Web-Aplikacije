import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { Toy } from '../../../models/toy.model';
import { ToyService } from '../../../services/toy.service';
import { ToyCardComponent } from '../toy-card/toy-card.component';
import { SearchFilterComponent, FilterCriteria } from '../../search/search-filter/search-filter.component';

@Component({
  selector: 'app-toy-list',
  standalone: true,
  imports: [
    CommonModule, MatProgressSpinnerModule, MatIconModule,
    ToyCardComponent, SearchFilterComponent
  ],
  template: `
    <div class="container page-content">
      <h1>Igračke</h1>

      <app-search-filter [initialType]="initialType" (filterChange)="onFilterChange($event)"></app-search-filter>

      @if (loading) {
        <div class="loading">
          <mat-spinner diameter="48"></mat-spinner>
          <p>Učitavanje igračaka...</p>
        </div>
      } @else if (filteredToys.length === 0) {
        <div class="empty-state clay-card">
          <mat-icon>search_off</mat-icon>
          <h3>Nema rezultata</h3>
          <p>Pokušajte sa drugačijim filterima</p>
        </div>
      } @else {
        <p class="results-count">Prikazano {{ filteredToys.length }} od {{ allToys.length }} igračaka</p>
        <div class="toy-grid">
          @for (toy of filteredToys; track toy.toyId) {
            <app-toy-card [toy]="toy"></app-toy-card>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    h1 {
      margin-bottom: 24px;
    }

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 64px;
      gap: 16px;
      color: var(--text-light);
    }

    .empty-state {
      text-align: center;
      padding: 64px !important;

      mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        color: var(--text-light);
      }

      h3 { margin: 16px 0 8px; }
      p { color: var(--text-light); }
    }

    .results-count {
      color: var(--text-light);
      margin-bottom: 16px;
      font-size: 0.9rem;
    }
  `]
})
export class ToyListComponent implements OnInit {
  allToys: Toy[] = [];
  filteredToys: Toy[] = [];
  loading = true;
  initialType = '';

  private lastCriteria: FilterCriteria | null = null;
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);

  constructor(private toyService: ToyService) {}

  ngOnInit(): void {
    this.initialType = this.route.snapshot.queryParams['type'] || '';

    this.toyService.getAllToys().subscribe({
      next: toys => {
        this.allToys = toys;
        this.loading = false;

        // Apply pending filter or show all
        if (this.lastCriteria) {
          this.applyFilter(this.lastCriteria);
        } else if (this.initialType) {
          // Filter hasn't arrived yet but we have initialType
          this.applyFilter({
            searchTerm: '', type: this.initialType, ageGroup: '',
            targetGroup: '', minPrice: null, maxPrice: null, sortBy: ''
          });
        } else {
          this.filteredToys = toys;
        }
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  onFilterChange(criteria: FilterCriteria): void {
    this.lastCriteria = criteria;
    if (this.allToys.length > 0) {
      this.applyFilter(criteria);
    }
  }

  private applyFilter(criteria: FilterCriteria): void {
    let result = [...this.allToys];

    if (criteria.searchTerm) {
      const term = criteria.searchTerm.toLowerCase();
      result = result.filter(t =>
        t.name.toLowerCase().includes(term) ||
        t.description.toLowerCase().includes(term)
      );
    }

    if (criteria.type) {
      result = result.filter(t => t.type.name === criteria.type);
    }

    if (criteria.ageGroup) {
      result = result.filter(t => t.ageGroup.name === criteria.ageGroup);
    }

    if (criteria.targetGroup) {
      result = result.filter(t =>
        t.targetGroup === criteria.targetGroup || t.targetGroup === 'svi'
      );
    }

    if (criteria.minPrice != null) {
      result = result.filter(t => t.price >= criteria.minPrice!);
    }

    if (criteria.maxPrice != null) {
      result = result.filter(t => t.price <= criteria.maxPrice!);
    }

    switch (criteria.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating-desc':
        result.sort((a, b) => b.averageRating - a.averageRating);
        break;
    }

    this.filteredToys = result;
    this.cdr.markForCheck();
  }
}
