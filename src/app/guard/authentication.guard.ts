import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';
import { inject } from '@angular/core';

export const authenticationGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  return new Promise(resolve => {
    if(authService.isUserLoggedIn()) {
      resolve(true)
    }
    else {
      authService.clearToken();
      router.navigate(['/vendor'])
      resolve(false);
    }
  });
};
