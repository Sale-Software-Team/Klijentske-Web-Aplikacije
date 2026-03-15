import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from './components/layout/header/header.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule, RouterOutlet, RouterModule, MatSidenavModule,
    MatListModule, MatIconModule, HeaderComponent, FooterComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(public authService: AuthService) {}
}
