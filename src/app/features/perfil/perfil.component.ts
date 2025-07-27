import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../core/layout/header/header.component';
import { FooterComponent } from '../../core/layout/footer/footer.component';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
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
  id: string = '';
  codigoUsuario: number = 0;
  tipoUsuario: string = '';
  fechaRegistro: string = '';
  estadoUsuario: string = '';
  nombreCompleto: string = '';

  mostrar2FA: boolean = false;
  codigo: string = '';

  enviar: boolean = false;
  respuestaNoValida : boolean = false;

  verificarCodigo(): void {
    const codigo = this.codigo;
    

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
    private router: Router,
    private cookieService: CookieService
  ) {
    this.id = this.cookieService.get('id') || '1'; 
  }

  ngOnInit() {
    this.cargarDatosUsuario();
  }

  cargarDatosUsuarios() {
    const usuarioCookie = this.cookieService.get('usuario') || 'admin';
    const rolCookie = this.cookieService.get('rol') || 'admin';
    
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

    const datosUsuario = datosUsuarios[usuarioCookie] || datosUsuarios['default'];
    
    this.codigoUsuario = datosUsuario.nombreUsuario;
    this.tipoUsuario = datosUsuario.tipoUsuario;
    this.fechaRegistro = datosUsuario.fechaRegistro;
    this.estadoUsuario = datosUsuario.estadoUsuario;
    this.nombreCompleto = datosUsuario.nombreCompleto;
  }

  cargarDatosUsuario() {
    this.cargarDatosUsuarios();
  }
}
