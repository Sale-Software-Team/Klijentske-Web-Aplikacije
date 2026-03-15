import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  currentUser$ = this.currentUserSubject.asObservable();
  isLoggedIn$ = this.currentUser$.pipe(map(user => !!user));

  constructor(private userService: UserService) {}

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  login(username: string, password: string): boolean {
    const user = this.userService.validateCredentials(username, password);
    if (user) {
      this.currentUserSubject.next(user);
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUserSubject.next(null);
  }

  register(userData: Omit<User, 'id'>): User {
    const newUser = this.userService.registerUser(userData);
    this.currentUserSubject.next(newUser);
    return newUser;
  }

  updateCurrentUser(updates: Partial<User>): void {
    const user = this.currentUser;
    if (user) {
      const updated = this.userService.updateProfile(user.id, updates);
      if (updated) {
        this.currentUserSubject.next(updated);
      }
    }
  }
}
