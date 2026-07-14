import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { roleGuard } from './core/auth/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'formations', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'test',
    loadComponent: () => import('./features/call-test/call-test.component').then((m) => m.SimliTestComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'formations',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/formations/formation-list.component').then((m) => m.FormationListComponent),
  },
  {
    path: 'sessions',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/sessions/session-list.component').then((m) => m.SessionListComponent),
  },
  {
    path: 'my-sessions',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/sessions/my-sessions.component').then((m) => m.MySessionsComponent),
  },
  {
    path: 'sessions/:id/call',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/live-call/live-call.component').then((m) => m.LiveCallComponent),
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] },
    loadComponent: () =>
      import('./features/admin/admin-shell.component').then((m) => m.AdminShellComponent),
    children: [
      { path: '', redirectTo: 'categories', pathMatch: 'full' },
      {
        path: 'categories',
        loadComponent: () =>
          import('./features/admin/category-manage.component').then((m) => m.CategoryManageComponent),
      },
      {
        path: 'formations',
        loadComponent: () =>
          import('./features/admin/formation-manage.component').then((m) => m.formationManageComponent ),
      },
      {
        path: 'formateurs',
        loadComponent: () =>
          import('./features/admin/formateur-manage.component').then((m) => m.FormateurManageComponent),
      },
      {
        path: 'sessions',
        loadComponent: () =>
          import('./features/admin/session-manage.component').then((m) => m.SessionManageComponent),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/admin/user-manage.component').then((m) => m.UserManageComponent),
      },
    ],
  },
];
