import { CanActivateFn, Router } from '@angular/router';
import { ɵɵdirectiveInject as directiveInject } from '@angular/core';
import { LoginService } from '../core/services/login.service';

export const isLoggedInGuard: CanActivateFn = (route, state) => {
  const loginService = directiveInject(LoginService);
  const isLoggedIn = loginService.isLoggedIn;

  if (isLoggedIn) {
    return isLoggedIn;
  } else {
    const router = directiveInject(Router);
    return router.createUrlTree(['/login']);
  }
};
