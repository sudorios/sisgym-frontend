import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  txtUsuario: string = '';
  txtPassword: string = '';
  usuarioValido: boolean = true;
  alertaVisible: boolean = false;
  progressValue: number = 0;
  showPassword: boolean = true;

  constructor(private loginService: LoginService, private router: Router, private cookieService: CookieService) {}

  verContrasena(): void {
    this.showPassword = !this.showPassword;
  }

  IniciarSesion(): void {
    const passwordHash = this.loginService.cifrarSHA256(this.txtPassword);
    this.loginService
      .validarUsuario(this.txtUsuario, passwordHash, '2023-12-12')
      .subscribe(
        (response: any) => {  
          if(response && response.resultado === 'valido') {
            console.log('Token generado:', response.token);
            this.cookieService.set('token', response.token);
            this.cookieService.set('id', response.codiUsua);
            //this.cookieService.set('rol', response.tipoUsua);
            this.cookieService.set('usuario', this.txtUsuario);
            this.cookieService.set('contrasena', passwordHash);
            this.loginService.actualizarEstadoInicioSesion(true);
            this.loginService.updateUserRole(response.tipoUsua);
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
        },
        (error) => {
          console.error('Error al autenticar:', error);       
        }
      );
  }
}
