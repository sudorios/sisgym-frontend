import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ShowForRolesDirective } from '../../../show-for-roles.directive';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, ShowForRolesDirective],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  mostrarClientesOptions: boolean = false;
  activeTab: string = '';
  constructor(private router: Router) {}

  logo(): void {
    this.router.navigate(['/home']);
  }

  clientes(): void {
    this.router.navigate(['/home/clientes']);
  }
  exclientes(): void {
    this.router.navigate(['/home/exclientes']);
  }

  asistencia(): void {
    this.router.navigate(['/home/asistencia']);
  }

  reportes(): void {
    this.router.navigate(['/home/reportes']);
  }

  calendario(): void {
    this.router.navigate(['/home/calendario']);
  }

  configuracion(): void {
    this.router.navigate(['/home/configuracion']);
  }

  toggleClientesOptions(): void {
    this.mostrarClientesOptions = !this.mostrarClientesOptions;
  }
}
