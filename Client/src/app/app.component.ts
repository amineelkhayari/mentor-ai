import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService, DecodedToken } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
  <nav *ngIf="showNav" class="navbar">

  <!-- Logo -->
  <div class="navbar-brand">
    <span class="logo">🎓</span>
    <span class="title">MentorAI</span>
  </div>

  <!-- Main navigation -->
  <div class="navbar-links">

    <a routerLink="/formations" routerLinkActive="active">
      📚 Formations
    </a>

    <a routerLink="/sessions" routerLinkActive="active">
      🎥 Sessions
    </a>

    <a routerLink="/my-sessions" routerLinkActive="active">
      ⭐ My Learning
    </a>

    <a
      *ngIf="auth.isAdmin()"
      routerLink="/admin"
      routerLinkActive="active"
      class="admin-link"
    >
      ⚙️ Admin
    </a>

  </div>

  <!-- User area -->
  <div class="navbar-user" *ngIf="auth.isAuthenticated()">

    <div class="profile-wrapper">

      <div class="avatar">
        {{
          infoUser?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
            ?.charAt(0)
            ?.toUpperCase()
        }}
      </div>

      <div class="profile-menu">

        <div class="profile-header">

          <div class="avatar large">
            {{
              infoUser?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
                ?.charAt(0)
                ?.toUpperCase()
            }}
          </div>

          <div>
            <div class="profile-name">
              {{ infoUser?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] }}
            </div>

            <div class="profile-email">
              {{ infoUser?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] }}
            </div>
          </div>

        </div>

        <div class="profile-role">
          {{
            infoUser?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
          }}
        </div>

        <div class="menu-divider"></div>

        <button class="menu-item logout" (click)="logout()">
          🚪 Logout
        </button>

      </div>

    </div>

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
  infoUser:DecodedToken | null = null;
  constructor(public auth: AuthService, private router: Router) {
    this.infoUser = this.auth.decodeToken();
    console.log(this.infoUser,"hhhhhhhh");
    
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
