import { Component, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { ToyService } from '../../../services/toy.service';
import { AgeGroup, ToyType } from '../../../models/toy.model';

export interface FilterCriteria {
  searchTerm: string;
  type: string;
  ageGroup: string;
  targetGroup: string;
  minPrice: number | null;
  maxPrice: number | null;
  sortBy: string;
}

@Component({
  selector: 'app-search-filter',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonToggleModule, MatIconModule, MatButtonModule
  ],
  template: `
    <div class="filter-container clay-card">
      <div class="filter-row">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Pretraži igračke</mat-label>
          <input matInput (input)="onSearchInput($event)" placeholder="Unesite naziv..." />
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
      </div>

      <div class="filter-row filters">
        <mat-form-field appearance="outline">
          <mat-label>Tip</mat-label>
          <mat-select [(value)]="filters.type" (selectionChange)="emitFilters()">
            <mat-option value="">Svi tipovi</mat-option>
            @for (type of types; track type.typeId) {
              <mat-option [value]="type.name">{{ type.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Uzrast</mat-label>
          <mat-select [(value)]="filters.ageGroup" (selectionChange)="emitFilters()">
            <mat-option value="">Svi uzrasti</mat-option>
            @for (ag of ageGroups; track ag.ageGroupId) {
              <mat-option [value]="ag.name">{{ ag.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Sortiraj</mat-label>
          <mat-select [(value)]="filters.sortBy" (selectionChange)="emitFilters()">
            <mat-option value="">Podrazumevano</mat-option>
            <mat-option value="price-asc">Cena ↑</mat-option>
            <mat-option value="price-desc">Cena ↓</mat-option>
            <mat-option value="name-asc">Naziv A-Z</mat-option>
            <mat-option value="rating-desc">Ocena ↓</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div class="filter-row">
        <mat-button-toggle-group [(value)]="filters.targetGroup" (change)="emitFilters()">
          <mat-button-toggle value="">Svi</mat-button-toggle>
          <mat-button-toggle value="dečak">Dečaci</mat-button-toggle>
          <mat-button-toggle value="devojčica">Devojčice</mat-button-toggle>
        </mat-button-toggle-group>

        <div class="price-range">
          <mat-form-field appearance="outline" class="price-field">
            <mat-label>Min cena</mat-label>
            <input matInput type="number" [(ngModel)]="filters.minPrice" (change)="emitFilters()" />
          </mat-form-field>
          <span class="price-sep">—</span>
          <mat-form-field appearance="outline" class="price-field">
            <mat-label>Max cena</mat-label>
            <input matInput type="number" [(ngModel)]="filters.maxPrice" (change)="emitFilters()" />
          </mat-form-field>
        </div>

        <button mat-button (click)="resetFilters()" class="reset-btn">
          <mat-icon>clear</mat-icon> Resetuj
        </button>
      </div>
    </div>
  `,
  styles: [`
    .filter-container {
      margin-bottom: 24px;
    }

    .filter-row {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      align-items: center;
      margin-bottom: 12px;

      &:last-child { margin-bottom: 0; }
    }

    .search-field {
      flex: 1;
      min-width: 200px;
    }

    .filters {
      mat-form-field {
        flex: 1;
        min-width: 150px;
      }
    }

    .price-range {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .price-field {
      width: 120px;
    }

    .price-sep {
      color: var(--text-light);
    }

    mat-button-toggle-group {
      border-radius: 14px;
      overflow: hidden;
    }

    .reset-btn {
      margin-left: auto;
      border-radius: 14px !important;
    }

    @media (max-width: 768px) {
      .filters mat-form-field {
        min-width: 100%;
      }

      .price-range {
        width: 100%;

        .price-field { flex: 1; width: auto; }
      }
    }
  `]
})
export class SearchFilterComponent implements OnInit, OnDestroy {
  @Output() filterChange = new EventEmitter<FilterCriteria>();

  types: ToyType[] = [];
  ageGroups: AgeGroup[] = [];

  filters: FilterCriteria = {
    searchTerm: '',
    type: '',
    ageGroup: '',
    targetGroup: '',
    minPrice: null,
    maxPrice: null,
    sortBy: ''
  };

  private searchSubject = new Subject<string>();
  private cdr = inject(ChangeDetectorRef);

  constructor(private toyService: ToyService) {}

  ngOnInit(): void {
    this.toyService.getTypes().subscribe(t => { this.types = t; this.cdr.markForCheck(); });
    this.toyService.getAgeGroups().subscribe(ag => { this.ageGroups = ag; this.cdr.markForCheck(); });

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.filters.searchTerm = term;
      this.emitFilters();
    });
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);
  }

  emitFilters(): void {
    this.filterChange.emit({ ...this.filters });
  }

  resetFilters(): void {
    this.filters = {
      searchTerm: '',
      type: '',
      ageGroup: '',
      targetGroup: '',
      minPrice: null,
      maxPrice: null,
      sortBy: ''
    };
    this.emitFilters();
  }
}
