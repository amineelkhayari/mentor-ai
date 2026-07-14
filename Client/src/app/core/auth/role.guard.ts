import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { AppRole } from '../models/role.model';

/**
 * Usage in routes:
 *   { path: 'admin/categories', canActivate: [authGuard, roleGuard], data: { roles: ['Admin'] }, ... }
 */
export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const allowed: AppRole[] = route.data?.['roles'] ?? [];
  if (allowed.length === 0 || auth.hasRole(...allowed)) {
    return true;
  }

  return router.createUrlTree(['/sessions']);
};
