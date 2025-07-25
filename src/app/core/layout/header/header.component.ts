import { Component, OnInit } from '@angular/core';
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
export class HeaderComponent implements OnInit {
  usuario: string = '';
  mostrarModal = false;

  constructor(
    private router: Router,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    this.usuario = this.cookieService.get('usuario') || 'Invitado';
  }

  cerrarSesion() {
    this.cookieService.deleteAll();
    this.router.navigate(['/login']);
  }

  verPerfil() {
    this.router.navigate(['/perfil']);
  }
}
