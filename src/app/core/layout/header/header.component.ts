import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './header.component.html',
})

export class HeaderComponent {
  usuario: string = '';

  constructor(private router: Router, private cookieService: CookieService) {}

  mostrarModal: boolean = false;
  
  ajustes() {
    this.usuario = this.cookieService.get('usuario') || '';
  } 

  cerrarSesion() {
    this.cookieService.deleteAll();
    this.router.navigate(['/login']);
  }

  verPerfil() {
    this.router.navigate(['/perfil']);
  }

}
