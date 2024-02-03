import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { ClientesComponent } from '../clientes/clientes.component';
import { ExClientesComponent } from '../clientes/ex-clientes/exclientes.component';
import { AsistenciaComponent } from '../asistencia/asistencia.component';
import { ReportesComponent } from '../reportes/reportes.component';
import { CalendarioComponent } from '../clases/calendario/calendario.component';
import { ClasesComponent } from '../clases/clases/clases.component';
import { HasRoleGuard } from '../guards/has-role.guard';
import { ConfiguracionComponent } from '../configuracion/configuracion.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: '' },
      { path: 'clientes', component: ClientesComponent, canActivate: [HasRoleGuard], data: { roles: ['admin', 'recepcion'] } },
      { path: 'exclientes', component: ExClientesComponent, canActivate: [HasRoleGuard], data: { roles: ['admin', 'recepcion'] } },
      { path: 'asistencia', component: AsistenciaComponent, canActivate: [HasRoleGuard], data: { roles: ['admin', 'recepcion'] } },
      { path: 'reportes', component: ReportesComponent, canActivate: [HasRoleGuard], data: { roles: ['admin', 'contador', 'licenciado'] } },
      { path: 'calendario', component: CalendarioComponent, canActivate: [HasRoleGuard], data: { roles: ['admin', 'recepcion'] } },
      { path: 'calendario/clases', component: ClasesComponent, canActivate: [HasRoleGuard], data: { roles: ['admin', 'recepcion'] } },
      { path: 'configuracion', component: ConfiguracionComponent}
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutes {}
