import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { NgxPaginationModule } from 'ngx-pagination'
import { MatTableModule } from '@angular/material/table'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { Cliente } from '../../core/models/cliente.interface'
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
  displayedColumns = ['id','nombreCliente','apellidos','dni','emailClie','telefonoCliente','plan','acciones']
  clientes: Cliente[] = []
  clientesPaginados: Cliente[] = []
  length = 0
  pageSize = 8
  page = 1
  buscarClie = ''
  mostrarModal = false
  tituloModal = 'Registrar Cliente'
  mostrarDivReg = true
  mostrarEliminar = false
  botonRegistrar = true
  botonEditar = false
  botonEliminar = false
  enviar = false
  txtDNI = ''
  txtNombre = ''
  txtApellido = ''
  txtCorreo = ''
  txtTelefono = ''
  clienteAEliminar?: Cliente
  clienteAEditar?: Cliente
  valorIdCliente?: string

  constructor(
    private clientesService: ClientesService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.getClientes()
  }

  getClientes(): void {
    this.mostrarModal = false
    const token = this.cookieService.get('token')
    this.clientesService.getClientes(token).subscribe({
      next: data => {
        this.clientes = data.sort((a,b)=>+b.id - +a.id)
        this.length = this.clientes.length
        this.clientesPaginados = [...this.clientes]
      },
      error: err => console.error(err)
    })
  }

  onKeyReleased(): void {
    const term = this.buscarClie.trim().toLowerCase()
    this.clientesPaginados = this.clientes.filter(c=>
      [c.nombreCliente,c.apellidos,c.dni,c.emailClie,c.telefonoCliente]
        .some(f=>f?.toLowerCase().includes(term))
    )
    this.length = this.clientesPaginados.length
    this.page = 1
  }

  abrirModal(): void {
    this.tituloModal = 'Registrar Cliente'
    this.mostrarModal = this.mostrarDivReg = true
    this.resetButtons()
  }

  cerrarModal(): void {
    this.mostrarModal = false
    this.limpiarInputs()
    this.resetButtons()
  }

  private resetButtons(): void {
    this.botonRegistrar = true
    this.botonEditar = this.botonEliminar = false
    this.mostrarEliminar = false
  }

  private limpiarInputs(): void {
    this.txtDNI = ''
    this.txtNombre = ''
    this.txtApellido = ''
    this.txtCorreo = ''
    this.txtTelefono = ''
    this.enviar = false
  }

  camposObligatorios(): boolean {
    this.enviar = !(this.txtDNI.trim() && this.txtNombre.trim() && this.txtApellido.trim() && this.txtCorreo.trim())
    return !this.enviar
  }

  registrarCliente(): void {
    if (!this.camposObligatorios()) return
    const nuevo: Omit<Cliente,'id'> = {
      dni: this.txtDNI,
      nombreCliente: this.txtNombre,
      apellidos: this.txtApellido,
      emailClie: this.txtCorreo,
      telefonoCliente: this.txtTelefono,
      plan: { id:'1', nombre:'Básico', precio:150, duracionDias:30, fechaInicio:new Date().toISOString() }
    }
    this.clientesService.crearCliente(nuevo, this.cookieService.get('token'))
      .subscribe({ next: ()=>this.getClientes(), error: err=>console.error(err) })
    this.cerrarModal()
  }

  editarCliente(id: string): void {
    const cli = this.clientes.find(c=>c.id===id)
    if (!cli) return
    this.clienteAEditar = cli
    this.valorIdCliente = id
    this.tituloModal = 'Editar Cliente'
    this.mostrarModal = this.mostrarDivReg = true
    this.botonEditar = true
    this.txtDNI = cli.dni
    this.txtNombre = cli.nombreCliente
    this.txtApellido = cli.apellidos
    this.txtCorreo = cli.emailClie
    this.txtTelefono = cli.telefonoCliente||''
  }

  actualizarCliente(): void {
    if (!this.valorIdCliente||!this.camposObligatorios()) return
    const cambios: Partial<Omit<Cliente,'id'>> = {
      dni:this.txtDNI,
      nombreCliente:this.txtNombre,
      apellidos:this.txtApellido,
      emailClie:this.txtCorreo,
      telefonoCliente:this.txtTelefono
    }
    this.clientesService.editarCliente(this.valorIdCliente,cambios,this.cookieService.get('token'))
      .subscribe({ next: ()=>this.getClientes(), error: err=>console.error(err) })
    this.cerrarModal()
  }

  eliminarClienteModal(cliente: Cliente): void {
    this.clienteAEliminar = cliente
    this.tituloModal = 'Eliminar Cliente'
    this.mostrarModal = this.mostrarEliminar = true
    this.mostrarDivReg = false
    this.botonEliminar = true
    this.botonRegistrar = this.botonEditar = false
  }

  eliminarCliente(): void {
    if (!this.clienteAEliminar) return
    this.clientesService.eliminarCliente(this.clienteAEliminar.id,this.cookieService.get('token'))
      .subscribe({ next: ()=>this.getClientes(), error: err=>console.error(err) })
    this.cerrarModal()
  }
}
