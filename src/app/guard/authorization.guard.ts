import { inject } from '@angular/core';
import { CanActivateChildFn } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';
import { Location } from '@angular/common';

export const authorizationGuard: CanActivateChildFn = (childRoute, state) => {
  const routeMatcher = new RouteMatcher();
  const authService = inject(AuthenticationService);
  const location = inject(Location);
  const menu = childRoute.data['path'];

  if (authService.hasAuthority(menu)) {
    return true;
  }

  location.back();
  return false;
};

export class RouteMatcher {
  public requestMatchers(url: string, publicUrls: string[]): boolean {
    let isIncluded = false;
    for(let publicUrl of publicUrls) {
      let urls = url.split('/');
      let publics = publicUrl.split('/');
      if (urls.length == publics.length) {
        isIncluded = urls.find((value, index) => !publics.includes(value) && publics[index] !== '**') == undefined;
      }
      if (isIncluded) return isIncluded;
    }
    return isIncluded;
  }
}
