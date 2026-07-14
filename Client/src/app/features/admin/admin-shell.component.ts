import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="admin-shell">

  <aside class="admin-sidebar">

    <div class="sidebar-header">
      <h2>Admin Panel</h2>
      <p>Training Platform</p>
    </div>

    <nav class="admin-menu">

      <a routerLink="categories" routerLinkActive="active">
        📂 Categories
      </a>

      <a routerLink="formations" routerLinkActive="active">
        📚 Formations
      </a>

      <a routerLink="formateurs" routerLinkActive="active">
        🤖 AI Trainers
      </a>

      <a routerLink="sessions" routerLinkActive="active">
        🎥 Sessions
      </a>

      <a routerLink="users" routerLinkActive="active">
        👥 Users
      </a>

    </nav>

  </aside>

  <main class="admin-content">

    <div class="content-header">
      <h1>Administration</h1>
      <p>Manage your platform resources and AI trainers.</p>
    </div>

    <div class="content-card">
      <router-outlet></router-outlet>
    </div>

  </main>

</div>
  `,
  styleUrl: './admin.css',
})
export class AdminShellComponent {}
