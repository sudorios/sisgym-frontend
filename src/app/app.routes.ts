import { Routes } from '@angular/router';

import { LoginComponent } from './features/auth/login/login.component';
import { AutenticarComponent } from './autenticar/autenticar.component';
import { PerfilComponent } from './perfil/perfil.component';
import { isLoggedInGuard } from './guards/is-logged-in.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: 'login', component: LoginComponent },
  { path: 'autenticar', component: AutenticarComponent, canActivate: [isLoggedInGuard] },
  { path: 'perfil', component: PerfilComponent, canActivate: [isLoggedInGuard]},
  { 
    path: 'home',
    loadChildren: () => import('./features/home/home.routes').then(mod => mod.HomeRoutes),
    canActivate: [isLoggedInGuard]
  },
];
