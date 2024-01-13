import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
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

  constructor(private loginService: LoginService, private router: Router, private cookieService: CookieService) {}

  autenticar(): void {
    const passwordHash = this.loginService.cifrarSHA256(this.txtPassword);
    console.log('Usuario:', this.txtUsuario);
    console.log('Contraseña:', passwordHash);
    this.loginService
      .validarUsuario(this.txtUsuario, passwordHash, '2023-12-12')
      .subscribe(
        (response: any) => {  // Asegúrate de ajustar el tipo según la estructura de tu respuesta
          //console.log('Respuesta del servidor:', response);         
          if(response && response.resultado === 'valido') {
            console.log('Token generado:', response.token);
            this.cookieService.set('token', response.token);
            this.cookieService.set('usuario', this.txtUsuario);
            this.cookieService.set('contrasena', passwordHash);
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
