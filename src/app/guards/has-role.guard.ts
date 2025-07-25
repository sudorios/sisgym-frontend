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

    const userRole = this.loginService.getUserRole();

    if (userRole && roles.includes(userRole)) {
      return true; 
    } else {
      window.alert('No tienes permitido entrar a esta página.');
      this.router.navigate(['/']);
      return false;
    }
  }
}