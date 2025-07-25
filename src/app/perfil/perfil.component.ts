import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../core/layout/header/header.component';
import { FooterComponent } from '../core/layout/footer/footer.component';
import { LoginService } from '../core/services/login.service';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import { AutenticarService } from '../core/services/autenticar.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ShowForRolesDirective } from '../show-for-roles.directive';


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
    const usuario = this.cookieService.get('usuario') || '';
    const contrasena = this.cookieService.get('contrasena') || '';
    this.autenticaService.validarToken(usuario, contrasena, codigo).subscribe(
      (response) => {
        if (response && response.resultado === 'valido') {
          alert('valido');
          this.respuestaNoValida = false;
        } else {
          this.enviar = true;
          this.respuestaNoValida = true;
        }
      },
      (error) => {
        alert(error);
      }
    );
  }

  volverAHome(): void {
    this.router.navigate(['/home']);
  }

  constructor(
    private loginService: LoginService,
    private router: Router,
    private cookieService: CookieService,
    private autenticaService: AutenticarService
  ) {
    this.id = this.cookieService.get('id');
  }

  ngOnInit() {
    this.buscarUsuario(this.id);
  }

  buscarUsuario(codiUsua: string) {
    this.loginService.buscarUsuario(codiUsua).subscribe(
      (response) => {
        this.codigoUsuario = response.nombreUsuario.toUpperCase();
        this.tipoUsuario = response.tipoUsuario.toUpperCase();
        this.fechaRegistro = response.fechaRegistro;
        this.estadoUsuario = response.estadoUsuario.toUpperCase();
        this.nombreCompleto = response.nombreCompleto.toUpperCase();
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
