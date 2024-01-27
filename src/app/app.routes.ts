import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AutenticarComponent } from './autenticar/autenticar.component';
import { HomeComponent } from './home/home.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ExClientesComponent } from './clientes/ex-clientes/exclientes.component';
import { AsistenciaComponent } from './asistencia/asistencia.component';
import { ReportesComponent } from './reportes/reportes.component';
import { CalendarioComponent } from './clases/calendario/calendario.component';
import { ClasesComponent } from './clases/clases/clases.component';
import { PerfilComponent } from './perfil/perfil.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: 'login', component: LoginComponent },
  { path: 'autenticar', component: AutenticarComponent },
  { path: 'perfil', component: PerfilComponent},
  { 
    path: 'home',
    component: HomeComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'asistencia' },
      { path: 'clientes', component: ClientesComponent },
      { path: 'exclientes', component: ExClientesComponent },
      { path: 'asistencia', component: AsistenciaComponent },
      { path: 'reportes', component: ReportesComponent },
      { path: 'calendario', component: CalendarioComponent },
      { path: 'calendario/clases', component: ClasesComponent}
    ]
  },
];
