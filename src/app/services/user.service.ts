import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private users: User[] = [
    {
      id: 1,
      firstName: 'Marko',
      lastName: 'Petrović',
      email: 'marko@example.com',
      phone: '0641234567',
      address: 'Knez Mihailova 10, Beograd',
      favoriteTypes: ['Slagalica', 'Edukativna igračka'],
      username: 'marko',
      password: 'marko123'
    },
    {
      id: 2,
      firstName: 'Ana',
      lastName: 'Jovanović',
      email: 'ana@example.com',
      phone: '0659876543',
      address: 'Bulevar Oslobođenja 5, Novi Sad',
      favoriteTypes: ['Plišana igračka', 'Lutka'],
      username: 'ana',
      password: 'ana123'
    }
  ];
  private nextId = 3;

  findByUsername(username: string): User | undefined {
    return this.users.find(u => u.username === username);
  }

  validateCredentials(username: string, password: string): User | null {
    const user = this.findByUsername(username);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  registerUser(userData: Omit<User, 'id'>): User {
    const newUser: User = { ...userData, id: this.nextId++ };
    this.users.push(newUser);
    return newUser;
  }

  updateProfile(userId: number, updates: Partial<User>): User | null {
    const index = this.users.findIndex(u => u.id === userId);
    if (index === -1) return null;
    this.users[index] = { ...this.users[index], ...updates, id: userId };
    return this.users[index];
  }

  isUsernameTaken(username: string): boolean {
    return this.users.some(u => u.username === username);
  }
}
