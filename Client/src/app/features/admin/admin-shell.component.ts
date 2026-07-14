import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="admin-shell">
      <nav class="admin-tabs">
        <a routerLink="categories" routerLinkActive="active">Categories</a>
        <a routerLink="formations" routerLinkActive="active">Formations</a>
        <a routerLink="formateurs" routerLinkActive="active">Trainers (AI)</a>
        <a routerLink="sessions" routerLinkActive="active">Sessions</a>
        <a routerLink="users" routerLinkActive="active">Users</a>
      </nav>
      <div class="admin-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styleUrl: './admin.css',
})
export class AdminShellComponent {}
