import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],
  template: `
    <footer class="footer">
      <div class="container footer-content">
        <div class="footer-brand">
          <span class="footer-logo">IgračkaShop</span>
          <p>Digitalna prodavnica igračaka za decu</p>
        </div>
        <div class="footer-links">
          <a routerLink="/">Početna</a>
          <a routerLink="/toys">Igračke</a>
        </div>
        <div class="footer-copy">
          <p>&copy; 2026 IgračkaShop - KVA Projekat</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--white);
      border-top: var(--clay-border);
      padding: 32px 0;
      margin-top: 48px;
    }

    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 24px;
    }

    .footer-logo {
      font-family: 'Fredoka', sans-serif;
      font-size: 1.3rem;
      font-weight: 600;
    }

    .footer-brand p {
      margin: 4px 0 0;
      font-size: 0.85rem;
      color: var(--text-light);
    }

    .footer-links {
      display: flex;
      gap: 24px;

      a {
        color: var(--text-secondary);
        font-weight: 600;
        transition: color 0.2s;

        &:hover { color: var(--text-primary); }
      }
    }

    .footer-copy {
      font-size: 0.85rem;
      color: var(--text-light);

      p { margin: 0; }
    }

    @media (max-width: 768px) {
      .footer-content {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
})
export class FooterComponent {}
