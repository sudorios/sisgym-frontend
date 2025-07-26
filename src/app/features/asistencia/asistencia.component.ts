// src/app/features/asistencia/asistencia.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import moment from 'moment';
import { AsistenciaService } from '../../core/services/asistencia.service';
import { ClientesService } from '../../core/services/clientes.service';
import { Cliente } from '../../core/models/cliente.interface';

@Component({
  selector: 'app-asistencia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './asistencia.component.html'
})
export class AsistenciaComponent {
  txtDNI = '';
  cliente?: Cliente | null;
  diasRestantes = '';
  colorTexto = '';

  constructor(
    private cookieService: CookieService,
    private asistenciaService: AsistenciaService,
    private clientesService: ClientesService
  ) {}

 buscarCliente(): void {
    const token = this.cookieService.get('token');
    if (this.txtDNI.length < 8) {
      this.cliente = null;
      this.diasRestantes = '';
      this.colorTexto = 'red';
      return;
    }

    this.clientesService.getClienteByDNI(this.txtDNI, token).subscribe({
      next: cli => {
        if (cli) {
          this.cliente = cli;
          const inicio = moment(cli.plan.fechaInicio, 'YYYY-MM-DD');
          const hoy = moment();
          const transcurridos = hoy.diff(inicio, 'days');
          const restantes = cli.plan.duracionDias - transcurridos;
          if (restantes > 0) {
            this.diasRestantes = `Días restantes: ${restantes}`;
            this.colorTexto = 'black';
          } else {
            this.diasRestantes = 'Membresía expirada';
            this.colorTexto = 'red';
          }
        } else {
          this.cliente = null;
          this.diasRestantes = '';
          this.colorTexto = 'red';
        }
      },
      error: () => {
        this.cliente = null;
        this.diasRestantes = '';
        this.colorTexto = 'red';
      }
    });
  }

  crearAsistencia(): void {
    if (!this.cliente) {
      this.colorTexto = 'red';
      this.diasRestantes = '';
      return;
    }

    const token = this.cookieService.get('token');
    const asistencia = { clienteidCliente: this.txtDNI };

    this.asistenciaService.crearAsistencia(asistencia, token)
      .subscribe({
        next: response => {
          const nombre = response.nombreCliente;
          const apellidos = response.apellidos;
          const dias = response.diasDiferencia;
          this.diasRestantes = `Días restantes: ${dias}`;
          this.colorTexto = 'black';
        },
        error: err => {
          this.colorTexto = 'red';
          // Manejo de errores igual que antes...
        }
      });
  }
}
