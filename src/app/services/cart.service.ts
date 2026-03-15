import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartItem } from '../models/cart-item.model';
import { Toy } from '../models/toy.model';
import { ToyService } from './toy.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  private nextId = 1;

  cartItems$ = this.cartItems.asObservable();

  cartCount$ = this.cartItems$.pipe(
    map(items => items.filter(i => i.status !== 'otkazano').length)
  );

  totalPrice$ = this.cartItems$.pipe(
    map(items =>
      items
        .filter(i => i.status !== 'otkazano')
        .reduce((sum, item) => sum + item.toy.price * item.quantity, 0)
    )
  );

  constructor(private toyService: ToyService) {}

  addToCart(toy: Toy): void {
    const current = this.cartItems.value;
    const existing = current.find(
      i => i.toy.toyId === toy.toyId && i.status === 'rezervisano'
    );
    if (existing) {
      this.updateQuantity(existing.id, existing.quantity + 1);
      return;
    }
    const newItem: CartItem = {
      id: this.nextId++,
      toy,
      quantity: 1,
      status: 'rezervisano',
      dateAdded: new Date().toISOString()
    };
    this.cartItems.next([...current, newItem]);
  }

  removeFromCart(itemId: number): void {
    const current = this.cartItems.value.filter(i => i.id !== itemId);
    this.cartItems.next(current);
  }

  updateStatus(itemId: number, status: CartItem['status']): void {
    const current = this.cartItems.value.map(item =>
      item.id === itemId ? { ...item, status } : item
    );
    this.cartItems.next(current);
  }

  updateQuantity(itemId: number, quantity: number): void {
    const current = this.cartItems.value.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    );
    this.cartItems.next(current);
  }

  rateToy(itemId: number, rating: number): void {
    const current = this.cartItems.value;
    const item = current.find(i => i.id === itemId);
    if (item && item.status === 'pristiglo') {
      const updated = current.map(i =>
        i.id === itemId ? { ...i, userRating: rating } : i
      );
      this.cartItems.next(updated);
    }
  }

  hasArrivedToy(toyId: number): boolean {
    return this.cartItems.value.some(
      i => i.toy.toyId === toyId && i.status === 'pristiglo'
    );
  }

  getItems(): CartItem[] {
    return this.cartItems.value;
  }
}
