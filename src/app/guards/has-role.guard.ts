// has-role.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../core/services/login.service';

@Injectable({
  providedIn: 'root',
})

export class HasRoleGuard implements CanActivate {
  constructor(private loginService: LoginService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const roles = (route.data as any).roles as string[];

    // Obtiene el rol actual del servicio de autenticación
    const userRole = this.loginService.getUserRole();

    if (userRole && roles.includes(userRole)) {
      return true; // El usuario tiene los roles necesarios, permitir acceso
    } else {
      // Redirigir a una página de acceso denegado o a la página principal
      window.alert('No tienes permitido entrar a esta página.');

      // Redirigir a la página principal
      this.router.navigate(['/']);
      return false;
    }
  }
}