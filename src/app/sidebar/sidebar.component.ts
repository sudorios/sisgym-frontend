import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: '../home/home.component.css',
})
export class SidebarComponent {
  mostrarClientesOptions: boolean = false;

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

  toggleClientesOptions(): void {
    this.mostrarClientesOptions = !this.mostrarClientesOptions;
  }
}
