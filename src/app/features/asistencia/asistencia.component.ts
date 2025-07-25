import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { AsistenciaService } from '../../core/services/asistencia.service';

@Component({
  selector: 'app-asistencia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './asistencia.component.html'
})

export class AsistenciaComponent {
  txtDNI: string = '';
  nombreCliente: string = '';
  diasRestantes: string = '';
  colorTexto: string = '';

  constructor(
    private cookieService: CookieService,
    private asistenciaService: AsistenciaService
  ) {}

  crearAsistencia(): void {
    const token = this.cookieService.get('token');
  
    if (this.txtDNI === '' || this.txtDNI.length < 8) {
      this.nombreCliente = 'Cliente no encontrado';
      this.colorTexto = 'red';
      return;
    } else {
      const asistencia = { clienteidCliente: this.txtDNI };
      this.asistenciaService.crearAsistencia(asistencia, token).subscribe(
        (response) => {
          if (response.error) {
            if (response.error === 'Error: Token no válido') {
              //console.error('Token no válido');
            } else {
              //console.error('Error desconocido:', response.error);
            }
          } else {
            const nombre = response.nombreCliente;
            const apellidos = response.apellidos;
            const diasRestantes = response.diasDiferencia;
            this.nombreCliente = nombre + ' ' + apellidos;
            this.diasRestantes = "Dias restantes: " + diasRestantes;
            this.colorTexto = 'black';
          }
        },
        (error) => {
          if (error.status === 404 && error.error.error === 'Matricula expirada') {
            this.nombreCliente = 'Matricula expirada';
            this.diasRestantes = '';
            this.colorTexto = 'red';
          } else if (error.status === 404 && error.error.error === 'Membresia inactiva') {
            const diasRestantes = error.error.fechaInicio;
            this.nombreCliente = 'Membresia inactiva';
            this.colorTexto = 'green';
            this.diasRestantes = "Dia de inicio: " + diasRestantes;
          } else if (error.status === 404) {
            this.nombreCliente = 'Cliente no encontrado';
            this.colorTexto = 'red';
            this.diasRestantes = '';
          }           
          else {
            console.error('Error del servicio:', error);
          }
        }
      );
    }
  }
}
