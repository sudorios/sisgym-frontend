// src/app/clientes/clientes.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

import { Cliente } from '../../core/models/cliente.interface';
import { ClientesService } from '../../core/services/clientes.service';
import { CookieService } from 'ngx-cookie-service';
import { MatriculaService } from '../../core/services/matricula.service';
import { PagoService } from '../../core/services/pago.service';
import { FacturaService } from '../../core/services/factura.service';
import { FiltroPipe } from './filtro.pipe';


@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    FiltroPipe
  ],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  filtroClientes = new FiltroPipe();
  token = this.cookieService.get('token');

  // UI state
  mostrarModal = false;
  tituloModal = 'Registrar Cliente';
  mostrarDivReg = true;
  mostrarDivMatri = false;
  mostrarDivPagar = false;
  mostrarEliminar = false;
  botonRegistrar = true;
  botonMatricular = false;
  botonPagar = false;
  botonEliminar = false;
  botonEditar = false;
  enviar = false;
  loading = false;

  // Data
  clientes: Cliente[] = [];
  clientesPaginados: Cliente[] = [];
  length = 0;
  pageSize = 8;
  page = 1;
  buscarClie = '';

  // Campos form
  txtDNI = '';
  txtNombre = '';
  txtApellido = '';
  txtCorreo = '';
  txtTelefono = '';
  clienteAEliminar?: Cliente;
  clienteAEditar?: Cliente;
  valorIdCliente?: string;

  // Matricula & pago
  matriculaSeleccionada = 1;
  fechaInicio = '';
  fechaFin = '';
  valorIdMembresia?: number;
  metodoPago = 'Tarjeta';
  monto = '';

  // Factura
  fechaInicioG = '';
  fechaFinG = '';
  montoG = '';
  valorIdPago?: number;

  constructor(
    private clientesService: ClientesService,
    private cookieService: CookieService,
  ) {}

  ngOnInit(): void {
    this.getClientes();
  }

  getClientes(): void {
    this.loading = true;
    this.clientesService.getClientes(this.token).subscribe({
      next: data => {
        this.clientes = data.sort((a, b) => +b.id - +a.id);
        this.length = this.clientes.length;
        this.clientesPaginados = [...this.clientes];
      },
      error: err => console.error('Error al obtener clientes:', err),
      complete: () => this.loading = false
    });
  }

  onKeyReleased(): void {
    this.clientesPaginados = this.filtroClientes.transform(
      this.clientes,
      this.buscarClie
    );
    this.length = this.clientesPaginados.length;
    this.page = 1;
  }

  abrirModal(): void {
    this.tituloModal = 'Registrar Cliente';
    this.mostrarModal = this.mostrarDivReg = true;
    this.resetButtons();
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.limpiarInputs();
    this.resetButtons();
  }

  private resetButtons(): void {
    this.botonRegistrar = true;
    this.botonMatricular =
    this.botonPagar =
    this.botonEliminar =
    this.botonEditar = false;
    this.mostrarEliminar = false;
    this.mostrarDivMatri = this.mostrarDivPagar = false;
  }

  limpiarInputs(): void {
    this.txtDNI = this.txtNombre = this.txtApellido = this.txtCorreo = this.txtTelefono = '';
    this.matriculaSeleccionada = 1;
    this.fechaInicio = this.fechaFin = '';
    this.metodoPago = 'Tarjeta';
    this.monto = '';
    this.enviar = false;
  }

  camposObligatorios(): boolean {
    this.enviar = !(
      this.txtDNI.trim() &&
      this.txtNombre.trim() &&
      this.txtApellido.trim() &&
      this.txtCorreo.trim()
    );
    return !this.enviar;
  }

  registrarCliente(): void {
    if (!this.camposObligatorios()) return;
    const nuevo: Omit<Cliente, 'id'> = {
      dni: this.txtDNI,
      nombreCliente: this.txtNombre,
      apellidos: this.txtApellido,
      emailClie: this.txtCorreo,
      telefonoCliente: this.txtTelefono,
      plan: { id: '1', nombre: 'Básico', precio: 150, duracionDias: 30, fechaInicio: new Date().toISOString() }
    };
    this.clientesService.crearCliente(nuevo, this.token).subscribe({
      next: () => this.getClientes(),
      error: err => console.error(err)
    });
    this.cerrarModal();
  }

  editarCliente(id: string): void {
    const cli = this.clientes.find(c => c.id === id);
    if (!cli) return;
    this.clienteAEditar = cli;
    this.valorIdCliente = id;
    this.tituloModal = 'Editar Cliente';
    this.mostrarModal = true;
    this.mostrarDivReg = true;
    this.botonEditar = true;
    this.cargarDatosCliente(cli);
  }

  actualizarCliente(): void {
    if (!this.valorIdCliente) return;
    const cambios: Partial<Omit<Cliente, 'id'>> = {
      dni: this.txtDNI,
      nombreCliente: this.txtNombre,
      apellidos: this.txtApellido,
      emailClie: this.txtCorreo,
      telefonoCliente: this.txtTelefono
    };
    this.clientesService.editarCliente(this.valorIdCliente, cambios, this.token)
      .subscribe({ next: () => this.getClientes(), error: err => console.error(err) });
    this.cerrarModal();
  }

  eliminarClienteModal(cliente: Cliente): void {
    this.clienteAEliminar = cliente;
    this.tituloModal = 'Eliminar Cliente';
    this.mostrarModal = this.mostrarEliminar = true;
    this.botonEliminar = true;
    this.botonRegistrar = this.botonMatricular = this.botonPagar = this.botonEditar = false;
  }

  eliminarCliente(): void {
    if (!this.clienteAEliminar) return;
    this.clientesService.eliminarCliente(this.clienteAEliminar.id, this.token)
      .subscribe({ next: () => this.getClientes(), error: err => console.error(err) });
    this.cerrarModal();
  }

  cargarDatosCliente(cli: Cliente): void {
    this.txtDNI = cli.dni;
    this.txtNombre = cli.nombreCliente;
    this.txtApellido = cli.apellidos;
    this.txtCorreo = cli.emailClie;
    this.txtTelefono = cli.telefonoCliente || '';
  }
}
