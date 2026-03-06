import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const recruiterGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isRecruiter) return true;
  if (auth.isAdmin) return router.createUrlTree(['/admin/dashboard']);
  return router.createUrlTree(['/login']);
};
