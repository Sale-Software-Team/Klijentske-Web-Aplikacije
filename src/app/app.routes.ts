import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent) },
  { path: 'toys', loadComponent: () => import('./components/toys/toy-list/toy-list.component').then(m => m.ToyListComponent) },
  { path: 'toys/:id', loadComponent: () => import('./components/toys/toy-detail/toy-detail.component').then(m => m.ToyDetailComponent) },
  { path: 'cart', loadComponent: () => import('./components/cart/cart-page/cart-page.component').then(m => m.CartPageComponent), canActivate: [authGuard] },
  { path: 'login', loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent) },
  { path: 'profile', loadComponent: () => import('./components/profile/profile-page/profile-page.component').then(m => m.ProfilePageComponent), canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
