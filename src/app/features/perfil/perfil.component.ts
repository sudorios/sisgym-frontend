import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../core/layout/header/header.component';
import { FooterComponent } from '../../core/layout/footer/footer.component';
// import { LoginService } from '../../core/services/login.service'; // Comentado para usar datos estáticos
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
// import { AutenticarService } from '../../core/services/autenticar.service'; // Comentado para usar datos estáticos
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ShowForRolesDirective } from '../../show-for-roles.directive';


@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule, FormsModule, ShowForRolesDirective],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css',
})
export class PerfilComponent implements OnInit {
  //usuario
  id: string = '';
  codigoUsuario: number = 0;
  tipoUsuario: string = '';
  fechaRegistro: string = '';
  estadoUsuario: string = '';
  nombreCompleto: string = '';
  //2fa
  mostrar2FA: boolean = false;
  codigo: string = '';

  enviar: boolean = false;
  respuestaNoValida : boolean = false;

  verificarCodigo(): void {
    const codigo = this.codigo;
    
    // Simulación de validación 2FA con datos estáticos
    // Código válido de ejemplo: "123456"
    if (codigo === '123456') {
      alert('Código 2FA válido - Funcionalidad de demostración');
      this.respuestaNoValida = false;
      this.enviar = false;
    } else {
      this.enviar = true;
      this.respuestaNoValida = true;
    }
  }

  volverAHome(): void {
    this.router.navigate(['/home']);
  }

  constructor(
    // private loginService: LoginService, // Comentado para usar datos estáticos
    private router: Router,
    private cookieService: CookieService
    // private autenticaService: AutenticarService // Comentado para usar datos estáticos
  ) {
    this.id = this.cookieService.get('id') || '1'; // Valor por defecto si no hay cookie
  }

  ngOnInit() {
    this.cargarDatosUsuario();
  }

  // Método actualizado para usar datos estáticos en lugar de API
  cargarDatosUsuarios() {
    // Datos estáticos de demostración basados en cookies o valores por defecto
    const usuarioCookie = this.cookieService.get('usuario') || 'admin';
    const rolCookie = this.cookieService.get('rol') || 'admin';
    
    // Datos estáticos según el usuario logueado
    const datosUsuarios: { [key: string]: any } = {
      'admin': {
        nombreUsuario: 'ADMIN',
        tipoUsuario: 'ADMINISTRADOR',
        fechaRegistro: '2024-01-15',
        estadoUsuario: 'ACTIVO',
        nombreCompleto: 'ADMINISTRADOR DEL SISTEMA'
      },
      'empleado': {
        nombreUsuario: 'EMPLEADO01',
        tipoUsuario: 'EMPLEADO',
        fechaRegistro: '2024-03-20',
        estadoUsuario: 'ACTIVO',
        nombreCompleto: 'JUAN CARLOS PÉREZ GARCÍA'
      },
      'default': {
        nombreUsuario: 'USUARIO_DEMO',
        tipoUsuario: 'EMPLEADO',
        fechaRegistro: '2024-07-25',
        estadoUsuario: 'ACTIVO',
        nombreCompleto: 'USUARIO DE DEMOSTRACIÓN'
      }
    };

    // Seleccionar datos según el usuario en cookie o usar default
    const datosUsuario = datosUsuarios[usuarioCookie] || datosUsuarios['default'];
    
    // Asignar valores a las propiedades del componente
    this.codigoUsuario = datosUsuario.nombreUsuario;
    this.tipoUsuario = datosUsuario.tipoUsuario;
    this.fechaRegistro = datosUsuario.fechaRegistro;
    this.estadoUsuario = datosUsuario.estadoUsuario;
    this.nombreCompleto = datosUsuario.nombreCompleto;
  }

  // Método corregido (había un typo en el nombre)
  cargarDatosUsuario() {
    this.cargarDatosUsuarios();
  }
}
