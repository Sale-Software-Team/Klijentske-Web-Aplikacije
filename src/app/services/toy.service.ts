import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { ToyApi, Toy, AgeGroup, ToyType } from '../models/toy.model';
import { Review } from '../models/review.model';
import { environment } from '../environment';

@Injectable({ providedIn: 'root' })
export class ToyService {
  private reviewsMap = new BehaviorSubject<Map<number, Review[]>>(new Map());
  private nextReviewId = 1;

  constructor(private http: HttpClient) {}

  getAllToys(): Observable<Toy[]> {
    return this.http.get<ToyApi[]>(`${environment.apiUrl}/toy`).pipe(
      map(toys => toys.map(t => this.mapToToy(t)))
    );
  }

  getToyById(id: number): Observable<Toy> {
    return this.http.get<ToyApi>(`${environment.apiUrl}/toy/${id}`).pipe(
      map(t => this.mapToToy(t))
    );
  }

  getAgeGroups(): Observable<AgeGroup[]> {
    return this.http.get<AgeGroup[]>(`${environment.apiUrl}/age-group`);
  }

  getTypes(): Observable<ToyType[]> {
    return this.http.get<ToyType[]>(`${environment.apiUrl}/type`);
  }

  getImageUrl(toy: ToyApi): string {
    return environment.apiBaseUrl + toy.imageUrl;
  }

  getReviews(toyId: number): Review[] {
    return this.reviewsMap.value.get(toyId) || [];
  }

  get reviews$(): Observable<Map<number, Review[]>> {
    return this.reviewsMap.asObservable();
  }

  addReview(review: Omit<Review, 'id'>): void {
    const current = new Map(this.reviewsMap.value);
    const toyReviews = current.get(review.toyId) || [];
    const newReview: Review = { ...review, id: this.nextReviewId++ };
    current.set(review.toyId, [...toyReviews, newReview]);
    this.reviewsMap.next(current);
  }

  getAverageRating(toyId: number): number {
    const reviews = this.getReviews(toyId);
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }

  private mapToToy(api: ToyApi): Toy {
    return {
      ...api,
      reviews: this.getReviews(api.toyId),
      averageRating: this.getAverageRating(api.toyId)
    };
  }
}
