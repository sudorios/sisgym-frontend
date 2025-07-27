import { CanActivateFn, Router } from '@angular/router';
import { ɵɵdirectiveInject as directiveInject } from '@angular/core';
import { LoginService } from '../services/login.service';
import { CookieService } from 'ngx-cookie-service';

export const isLoggedInGuard: CanActivateFn = (route, state) => {
  const loginService = directiveInject(LoginService);
  const cookieService = directiveInject(CookieService);
  const router = directiveInject(Router);
  const token = cookieService.get('token');

  if (token && token.trim() !== '') {
    if (!loginService.isLoggedIn) {
      loginService.actualizarEstadoInicioSesion(true);
      const userRole = cookieService.get('userRole');
      if (userRole && userRole.trim() !== '') {
        loginService.updateUserRole(userRole);
      }
    }
    return true;
  } else {
    return router.createUrlTree(['/login']);
  }
};
