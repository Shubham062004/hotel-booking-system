import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  const requiredRole = route.data?.['role'] as string | undefined;
  if (requiredRole && auth.getRole() !== requiredRole) {
    // Redirect to the user's appropriate page instead of blocking
    router.navigate([auth.isAdmin() ? '/admin' : '/hotels']);
    return false;
  }

  return true;
};
