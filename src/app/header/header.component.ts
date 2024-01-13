import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: '../home/home.component.css'
})
export class HeaderComponent {

  constructor(private router: Router) {}

  mostrarModal: boolean = false;
  toggleModal() {
    this.mostrarModal = !this.mostrarModal;
  }

  cerrarSesion() {
    this.router.navigate(['/login']);
  }
}
