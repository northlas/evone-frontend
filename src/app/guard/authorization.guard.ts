import { inject } from '@angular/core';
import { CanActivateChildFn } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';
import { Location } from '@angular/common';

export const authorizationGuard: CanActivateChildFn = (childRoute, state) => {
  const authService = inject(AuthenticationService);
  const location = inject(Location)
  const menu = childRoute.data['path'];
  
  if (authService.hasAuthority(menu)) {
    return true;
  }

  location.back();
  return false;
};
