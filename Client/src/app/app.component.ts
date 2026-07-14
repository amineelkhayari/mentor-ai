import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
   <nav *ngIf="showNav" class="navbar">
  <div class="navbar-brand">
    <span class="logo">🎓</span>
    <span class="title">MentorAI Platform</span>
  </div>

  <div class="navbar-links">
    <a routerLink="/formations" routerLinkActive="active">Formations</a>
    <a routerLink="/sessions" routerLinkActive="active">Sessions</a>
    <a routerLink="/my-sessions" routerLinkActive="active">My Sessions</a>

    <a
      *ngIf="auth.isAdmin()"
      routerLink="/admin"
      routerLinkActive="active"
      class="admin-link"
    >
      Admin
    </a>
  </div>

  <div class="navbar-actions">
    <button
      *ngIf="auth.isAuthenticated()"
      (click)="logout()"
      class="logout-btn"
    >
      Logout
    </button>
  </div>
</nav>

<main class="page-content" [class.no-nav]="!showNav">
  <router-outlet></router-outlet>
</main>
  `,
    styleUrl: './app.component.css'
})
export class AppComponent {
  showNav = true;

  constructor(public auth: AuthService, private router: Router) {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.showNav = !e.urlAfterRedirects.startsWith('/login') && !e.urlAfterRedirects.startsWith('/register');
      });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
