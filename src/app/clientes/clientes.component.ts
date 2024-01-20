import { Component, OnInit } from '@angular/core';
import { ClientesService } from './clientes.service';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { MatriculaService } from '../services/matricula.service';
import moment from 'moment';
import { PagoService } from './pago.service';
import { FacturaService } from '../services/factura.service';
import { timer } from 'rxjs';
import { FiltroPipe } from './filtro.pipe';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, FormsModule, FiltroPipe],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css',
})
export class ClientesComponent implements OnInit {
  filtroClientes = new FiltroPipe();

  //(Modales, botones y div)
  mostrarModal: boolean = false;
  mostrarConfirmacion: boolean = false;
  tituloModal: string = 'Registrar Cliente';
  mostrarDivReg: boolean = true;
  mostrarDivMatri: boolean = false;
  mostrarDivPagar: boolean = false;
  mostrarEliminar: boolean = false;
  botonRegistrar: boolean = true;
  botonMatricular: boolean = false;
  botonPagar: boolean = false;
  botonEliminar: boolean = false;
  botonEditar: boolean = false;
  buscarClie: string = '';

  //Clientes
  clientes: any[] = [];
  clientesPaginados: any[] = [];
  length = 0;
  pageSize = 8;
  txtDNI: string = '';
  txtNombre: string = '';
  txtApellido: string = '';
  txtCorreo: string = '';
  txtTelefono: string = '';
  clienteAEliminar: any;
  clienteAEditar: any;
  valorIdCliente: number | undefined;

  //Matricula y pago
  matriculaSeleccionada: number = 1;
  fechaInicio: string = '';
  fechaFin: string = '';
  valorIdMembresia: number | undefined;
  metodoPago: string = 'Tarjeta';
  monto: string = '';

  //Factura
  fechaInicioG: string = '';
  fechaFinG: string = '';
  montoG: string = '';
  valorIdPago: number | undefined;
  valorIdFactura: number | undefined;

  constructor(
    private clientesService: ClientesService,
    private cookieService: CookieService,
    private matriculaService: MatriculaService,
    private pagoService: PagoService,
    private facturaService: FacturaService
  ) {}

  ngOnInit(): void {
    this.getClientes();
    this.page = 1;
  }

  getClientes(): void {
    const token = this.cookieService.get('token');

    this.clientesService.getClientes(token).subscribe((data) => {
      this.clientes = data.sort((a, b) => b.idCliente - a.idCliente);
      this.length = this.clientes.length;
      this.clientesPaginados = this.clientes.slice();
    });
  }

  onKeyReleased(): void {
    this.clientesPaginados = this.filtroClientes.transform(
      this.clientes as any[],
      this.buscarClie
    );
    this.length = this.clientesPaginados.length;
    this.page = 1;
  }

  page = 1;

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
    }
  }

  nextPage(): void {
    if (this.page < Math.ceil(this.length / this.pageSize)) {
      this.page++;
    }
  }

  actualizarCamposAutomaticamente(): void {
    const dni = this.txtDNI;
    if (dni.length === 8) {
      console.log('DNI llegó a 8');
      this.clientesService.getClienteByDNI(dni).subscribe((data) => {
        this.txtNombre = data.nombres || 'Nombre no encontrado';
        this.txtApellido =
          `${data.apellidoPaterno} ${data.apellidoMaterno}` ||
          'Apellido no encontrado';
      });
    } else {
      this.txtNombre = '';
      this.txtApellido = '';
    }
  }

  abrirModal() {
    this.tituloModal = 'Registrar Cliente';
    this.mostrarModal = true;
    this.mostrarDivReg = true;
    this.mostrarEliminar = false;
    this.botonRegistrar = true;
    this.botonEliminar = false;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.limpiarInputs();

    this.botonPagar = false;
    this.botonMatricular = false;
    this.mostrarDivMatri = false;
    this.mostrarDivPagar = false;
    this.botonEditar = false;
  }

  registrarCliente(): void {
    if (
      this.txtDNI.trim() === '' ||
      this.txtNombre.trim() === '' ||
      this.txtApellido.trim() === '' ||
      this.txtCorreo.trim() === '' ||
      this.txtTelefono.trim() === ''
    ) {
      alert('Todos los campos son obligatorios');
      return;
    }

    const token = this.cookieService.get('token');
    const nuevoCliente = {
      dni: this.txtDNI,
      nombreCliente: this.txtNombre,
      apellidos: this.txtApellido,
      emailClie: this.txtCorreo,
      telefonoCliente: this.txtTelefono,
    };

    this.clientesService.crearCliente(nuevoCliente, token).subscribe(
      (response) => {
        this.getClientes();
        this.valorIdCliente = response;
        this.mostrarDivReg = false;
        this.tituloModal = 'Matricular Cliente';
        this.mostrarDivMatri = true;
        this.botonRegistrar = false;
        this.botonMatricular = true;
      },
      (error) => {
        if ((error.error.error === 'Cliente ya existente')) {
        alert("Cliente ya existente");
        } else {
          console.log(error);
        }
      }
    );
  }

  matricularCliente(): void {
    console.log(this.valorIdCliente);
    const matricula = {
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin,
      idCliente: this.valorIdCliente,
      idMembresia: this.matriculaSeleccionada,
    };
    this.matriculaService.crearMatricula(matricula).subscribe(
      (response) => {
        console.log('Matrícula creada exitosamente:', response);
        this.valorIdMembresia = response;
        this.mostrarDivMatri = false;
        this.botonMatricular = false;
        this.botonPagar = true;
        this.mostrarDivPagar = true;
        this.tituloModal = 'Pagar';
        this.fechaInicioG = this.fechaInicio;
        this.fechaFinG = this.fechaFin;

        switch (String(this.matriculaSeleccionada)) {
          case '1':
            this.monto = '150';
            break;
          case '2':
            this.monto = '250';
            break;
          case '3':
            this.monto = '69';
            break;
          default:
            this.monto = '?';
            break;
        }
      },
      (error) => {
        console.error('Error al crear la matrícula:', error);
      }
    );
  }

  cambiarTipoMembresia(): void {
    console.log('Tipo de membresía seleccionada:', this.matriculaSeleccionada);
    this.calcularFechaFin();
  }

  pagoCliente(): void {
    const fechaactual = moment().format('YYYY-MM-DD');

    const pago = {
      fechaPago: fechaactual,
      matricula: this.valorIdMembresia,
      metodoPago: this.metodoPago,
      monto: this.monto,
    };
    this.pagoService.crearPago(pago).subscribe(
      (response) => {
        console.log('Pago exitoso:', response);
        this.montoG = this.monto;
        this.valorIdPago = response;
        this.CrearFactura();
        this.cerrarModal();
      },
      (error) => {
        console.error('Error al crear el pago:', error);
      }
    );
  }

  CrearFactura(): void {
    const montoNumerico = parseFloat(this.monto);
    const factura = {
      fechaInicio: this.fechaInicioG,
      fechaFin: this.fechaFinG,
      subtotal: montoNumerico - montoNumerico * 0.18,
      total: this.monto,
      clienteidCliente: this.valorIdCliente,
      empleadoidEmpleado: 1,
      pago: this.valorIdPago,
    };
    this.facturaService.crearFactura(factura).subscribe(
      (response) => {
        this.generarFactura(response);
        timer(5000).subscribe(() => {
          this.abriFactura(response);
        });
        this.cerrarModal();
      },
      (error) => {
        console.error('Error al crear el pago:', error);
      }
    );
  }

  generarFactura(idFactura: number): void {
    this.facturaService.generarFactura(idFactura).subscribe(
      (response) => {
        console.log('Factura generada con éxito');
      },
      (error) => {
        console.error('Error al generar la factura:', error);
      }
    );
  }

  abriFactura(id: number) {
    const url = `http://localhost:8080/Sis_Gym/factura/factura${id}.pdf`;
    window.open(url, 'factura', 'width=800, height=600');
  }

  abrirReporte() {
    window.open(
      'http://localhost:8080/Sis_Gym/reporte/Registro.pdf',
      'width=800, height=600'
    );
  }

  calcularFechaFin(): void {
    const idMembresia = this.matriculaSeleccionada.toString();
    const momentFechaInicio = moment(this.fechaInicio);

    if (idMembresia === '1') {
      momentFechaInicio.add(90, 'days');
    } else if (idMembresia === '2') {
      momentFechaInicio.add(150, 'days');
    } else if (idMembresia === '3') {
      momentFechaInicio.add(30, 'days');
    }

    this.fechaFin = momentFechaInicio.format('YYYY-MM-DD');
  }

  eliminarClienteModal(idCliente: number): void {
    this.abrirModal();
    this.botonMatricular = false;
    this.tituloModal = 'Eliminar Cliente';
    this.mostrarDivReg = false;
    this.mostrarEliminar = true;
    this.botonEliminar = true;
    console.log(idCliente);
    this.clienteAEliminar = this.clientes.find(
      (cliente) => cliente.idCliente === idCliente
    );
    this.botonRegistrar = false;
  }
  eliminarCliente(idCliente: number): void {
    const token = this.cookieService.get('token');
    this.clientesService.eliminarCliente(idCliente, token).subscribe(
      (response) => {
        console.log('Cliente eliminado exitosamente:', response);
        this.clientes = this.clientes.filter(
          (cliente) => cliente.idCliente !== idCliente
        );
        this.length = this.clientes.length;
        this.clientesPaginados = this.filtroClientes.transform(
          this.clientes as any[],
          this.buscarClie
        );
        this.length = this.clientesPaginados.length;
        this.page = 1;
        this.cerrarModal();
      },
      (error) => {
        console.error('Error al eliminar el cliente:', error);
      }
    );
  }

  editarCliente(idCliente: number): void {
    this.abrirModal();
    this.clienteAEditar = this.clientes.find(
      (cliente) => cliente.idCliente === idCliente
    );
    this.valorIdCliente = idCliente;
    this.tituloModal = 'Editar Cliente';
    this.botonMatricular = false;
    this.cargarDatosCliente(this.clienteAEditar);
    this.botonRegistrar = false;
    this.botonEditar = true;
  }
  actualizarCliente(): void {
    const token = this.cookieService.get('token');
    const nuevoCliente = {
      dni: this.txtDNI,
      nombreCliente: this.txtNombre,
      apellidos: this.txtApellido,
      emailClie: this.txtCorreo,
      telefonoCliente: this.txtTelefono,
      estaClie: 1,
    };
    const codigo = this.valorIdCliente ?? 0;
    console.log(codigo);
    this.clientesService.editarCliente(codigo, nuevoCliente, token).subscribe(
      (response) => {
        this.getClientes();
        this.cerrarModal();
      },
      (error) => {
        console.error('Error al editar el cliente:', error);
      }
    );
  }

  limpiarInputs(): void {
    this.txtDNI = '';
    this.txtNombre = '';
    this.txtApellido = '';
    this.txtCorreo = '';
    this.txtTelefono = '';
    this.matriculaSeleccionada = 1;
    this.fechaInicio = 'Selecciona fecha';
    this.fechaFin = 'Selecciona fecha';
    this.metodoPago = '1';
    this.monto = '';
  }

  cargarDatosCliente(cliente: any): void {
    this.txtDNI = cliente.dni || '';
    this.txtNombre = cliente.nombreCliente || '';
    this.txtApellido = cliente.apellidos || '';
    this.txtCorreo = cliente.emailClie || '';
    this.txtTelefono = cliente.telefonoCliente || '';
  }

  reportePDF(token: string): void {
    this.clientesService.imprimirPDF(token).subscribe(
      (response) => {
        if (response && response.status === 'valido') {
          timer(5000).subscribe(() => {
            this.abrirReporte();
          });
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  generarReport() {
    const token = this.cookieService.get('token');
    this.reportePDF(token);
  }
}
