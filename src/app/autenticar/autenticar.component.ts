import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { AutenticarService } from '../core/services/autenticar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-autenticar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './autenticar.component.html',
  styleUrls: ['./autenticar.component.css'],
})
export class AutenticarComponent implements OnInit {
  txtCodigo: string = '';
  alertaVisible: boolean = false;
  alertaVisible2: boolean = false;
  usuario: string = '';
  password: string = '';
  progressValue: number = 0;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private cookieService: CookieService,
    private router: Router,
    private autenticarService: AutenticarService
  ) {}

  ngOnInit() {
    this.usuario = this.cookieService.get('usuario') || '';
    this.password = this.cookieService.get('contrasena') || '';
    const token = this.cookieService.get('token');
    console.log('Valor de la cookie "token":', token);
    console.log('Usuario:', this.usuario);
    console.log('Contrasena:', this.password);
    const signUpButton = this.document.getElementById('btnAutenticar');
    const signInButton = this.document.getElementById('btnGenerar');
    const container = this.document.getElementById('container');
    const btnVerificar = this.document.getElementById('btnVerificar');
    const btnVerificarQR = this.document.getElementById('btnGenerarQR');

    if (btnVerificar && container) {
      btnVerificar.addEventListener('click', (event) => {
        this.verificarCodigo(event);
      });
    }
    if (btnVerificarQR && container) {
      btnVerificarQR.addEventListener('click', (event) => {
        this.autenticarToken(event);
      });
    }

    if (signUpButton && signInButton && container) {
      signUpButton.addEventListener('click', () => {
        container.classList.add('right-panel-active');
      });

      signInButton.addEventListener('click', () => {
        container.classList.remove('right-panel-active');
      });
    }
  }

  verificarCodigo(event: Event): void {
    event.preventDefault();
    const codigo = this.txtCodigo;
    this.autenticarService
      .validarToken(this.usuario, this.password, codigo)
      .subscribe(
        (response: any) => {
          console.log('Respuesta del servidor:', response);
          if (response && response.resultado === 'valido') {
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
          console.error('Error en la autenticación:', error);
        }
      );
  }

  autenticarToken(event: Event): void {
    event.preventDefault();
    this.autenticarService.asociarLlave(this.usuario, this.password).subscribe(
      (response) => {
        if (response && response.resultado === 'valido') {
          alert('Generar QR');
        } else {
          console.log('no valido');
          this.alertaVisible2 = true;
          this.progressValue = 0;
          const intervalId = setInterval(() => {
            this.progressValue += 10;
            if (this.progressValue >= 100) {
              clearInterval(intervalId);
              this.alertaVisible2 = false;
            }
          }, 300);
        }
      },
      (error) => {
        console.error('Error en la solicitud:', error);
      }
    );
  }

  validarQR(event: Event): void {
    event.preventDefault();
  }
}
