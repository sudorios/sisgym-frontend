import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../../core/services/login.service';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  txtUsuario: string = '';
  txtPassword: string = '';
  usuarioValido: boolean = true;
  alertaVisible: boolean = false;
  progressValue: number = 0;
  showPassword: boolean = true;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    const token = this.cookieService.get('token');
    if (token && token.trim() !== '') {
      this.router.navigate(['/home']);
    }
  }

   togglePassword() {
    this.showPassword = !this.showPassword;
  }

  IniciarSesion(): void {
    this.loginService
      .autenticar(this.txtUsuario, this.txtPassword)
      .subscribe((res) => {
        if (res.resultado === 'valido') {
          const passwordHash = this.loginService.cifrarSHA256(this.txtPassword);
          this.cookieService.set('token', res.token);
          this.cookieService.set('id', res.codiUsua);
          this.cookieService.set('usuario', this.txtUsuario);
          this.cookieService.set('contrasena', passwordHash);
          this.cookieService.set('userRole', res.tipoUsua);
          this.loginService.actualizarEstadoInicioSesion(true);
          this.loginService.updateUserRole(res.tipoUsua);
          this.router.navigate(['/home']);
        } else {
          this.alertaVisible = true;
          this.progressValue = 0;
          const intervalId = setInterval(() => {
            this.progressValue += 10;
            if (this.progressValue >= 100) {
              clearInterval(intervalId);
              this.alertaVisible = false;
            }
          }, 300);
        }
      });
  }
}
