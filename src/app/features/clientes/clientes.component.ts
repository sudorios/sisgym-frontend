import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { NgxPaginationModule } from 'ngx-pagination'
import { MatTableModule } from '@angular/material/table'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { Cliente, ClienteForm, ModalState } from '../../core/models/cliente.interface'
import { ClientesService } from '../../core/services/clientes.service'
import { CookieService } from 'ngx-cookie-service'

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  displayedColumns = ['id', 'nombreCliente', 'apellidos', 'dni', 'emailClie', 'telefonoCliente', 'plan', 'acciones'];
  clientes: Cliente[] = [];
  clientesPaginados: Cliente[] = [];
  length = 0;
  pageSize = 8;
  page = 1;
  buscarClie = '';

  modal: ModalState = { mostrar: false, modo: 'registrar' };
  enviar = false;
  formCliente: ClienteForm = { dni: '', nombre: '', apellido: '', correo: '', telefono: '' };
  clienteSeleccionado?: Cliente;

  constructor(
    private clientesService: ClientesService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.getClientes();
  }

  getClientes(): void {
    this.modal.mostrar = false;
    const token = this.cookieService.get('token');
    this.clientesService.getClientes(token).subscribe({
      next: data => {
        this.clientes = data.sort((a, b) => +b.id - +a.id);
        this.length = this.clientes.length;
        this.clientesPaginados = [...this.clientes];
      },
      error: err => console.error(err)
    });
  }

  onKeyReleased(): void {
    const term = this.buscarClie.trim().toLowerCase();
    this.clientesPaginados = this.clientes.filter(c =>
      [c.nombreCliente, c.apellidos, c.dni, c.emailClie, c.telefonoCliente].some(f => f?.toLowerCase().includes(term))
    );
    this.length = this.clientesPaginados.length;
    this.page = 1;
  }

  abrirModal(modo: ModalState['modo'], cliente?: Cliente): void {
    this.modal = { mostrar: true, modo };
    this.enviar = false;
    this.clienteSeleccionado = cliente;

    if (modo === 'registrar') {
      this.limpiarFormulario();
    } else if (cliente) {
      this.formCliente = {
        dni: cliente.dni,
        nombre: cliente.nombreCliente,
        apellido: cliente.apellidos,
        correo: cliente.emailClie,
        telefono: cliente.telefonoCliente || ''
      };
    }
  }

  cerrarModal(): void {
    this.modal.mostrar = false;
    this.limpiarFormulario();
  }

  limpiarFormulario(): void {
    this.formCliente = { dni: '', nombre: '', apellido: '', correo: '', telefono: '' };
    this.enviar = false;
  }

  camposObligatorios(): boolean {
    const { dni, nombre, apellido, correo } = this.formCliente;
    this.enviar = !(dni.trim() && nombre.trim() && apellido.trim() && correo.trim());
    return !this.enviar;
  }

  registrarCliente(): void {
    if (!this.camposObligatorios()) return;
    const nuevo: Omit<Cliente, 'id'> = {
      dni: this.formCliente.dni,
      nombreCliente: this.formCliente.nombre,
      apellidos: this.formCliente.apellido,
      emailClie: this.formCliente.correo,
      telefonoCliente: this.formCliente.telefono,
      plan: {
        id: '1',
        nombre: 'Básico',
        precio: 150,
        duracionDias: 30,
        fechaInicio: new Date().toISOString()
      }
    };
    this.clientesService.crearCliente(nuevo, this.cookieService.get('token')).subscribe({
      next: () => this.getClientes(),
      error: err => console.error(err)
    });
    this.cerrarModal();
  }

  actualizarCliente(): void {
    if (!this.clienteSeleccionado || !this.camposObligatorios()) return;
    const cambios: Partial<Omit<Cliente, 'id'>> = {
      dni: this.formCliente.dni,
      nombreCliente: this.formCliente.nombre,
      apellidos: this.formCliente.apellido,
      emailClie: this.formCliente.correo,
      telefonoCliente: this.formCliente.telefono
    };
    this.clientesService.editarCliente(this.clienteSeleccionado.id, cambios, this.cookieService.get('token')).subscribe({
      next: () => this.getClientes(),
      error: err => console.error(err)
    });
    this.cerrarModal();
  }

  eliminarCliente(): void {
    if (!this.clienteSeleccionado) return;
    this.clientesService.eliminarCliente(this.clienteSeleccionado.id, this.cookieService.get('token')).subscribe({
      next: () => this.getClientes(),
      error: err => console.error(err)
    });
    this.cerrarModal();
  }
}
