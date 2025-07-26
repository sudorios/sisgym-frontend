import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
import { CookieService } from 'ngx-cookie-service'
import { LoginService } from '../../services/login.service'

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .navbar .nav-link,
    .dropdown-item {
      cursor: pointer;
    }
    .navbar .nav-link:focus,
    .navbar .nav-link:active,
    .dropdown-item:focus,
    .dropdown-item:active {
      background-color: transparent !important;
      outline: none !important;
      box-shadow: none !important;
    }
  `],
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  usuario: string = ''
  mostrarModal = false

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.usuario = this.cookieService.get('usuario') || 'Invitado'
  }

  cerrarSesion() {
    this.loginService.actualizarEstadoInicioSesion(false)
    this.loginService.updateUserRole('')
    
    this.cookieService.delete('token', '/')
    this.cookieService.delete('id', '/')
    this.cookieService.delete('usuario', '/')
    this.cookieService.delete('contrasena', '/')
    this.cookieService.delete('userRole', '/')
    this.cookieService.deleteAll()
    
    this.router.navigateByUrl('/login').then(() => {
      window.location.reload()
    })
  }

  verPerfil() {
    this.router.navigate(['/perfil'])
  }
}
