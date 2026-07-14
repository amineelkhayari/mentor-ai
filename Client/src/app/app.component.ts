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
    <nav
      *ngIf="showNav"
      style="padding:12px 20px; display:flex; gap:16px; align-items:center; border-bottom:1px solid #222;"
    >
      <a routerLink="/formations">Formations</a>
      <a routerLink="/sessions">All sessions</a>
      <a routerLink="/my-sessions">My sessions</a>
      <a *ngIf="auth.isAdmin()" routerLink="/admin" style="color:#a79bff;">Admin</a>
      <span style="flex:1"></span>
      <button *ngIf="auth.isAuthenticated()" (click)="logout()" style="background:none;border:none;color:inherit;cursor:pointer;">
        Log out
      </button>
    </nav>
    <main [style.padding]="showNav ? '20px' : '0'">
      <router-outlet></router-outlet>
    </main>
  `,
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
