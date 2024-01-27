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
  token: string = '';

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
  enviar: boolean = false;
  loading: boolean = false;

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
  ) {
    this.token = this.cookieService.get('token');
  }

  //Modal Metodos

  abrirModal() {
    this.tituloModal = 'Registrar Cliente';
    this.mostrarModal = this.mostrarDivReg = true;
    this.mostrarEliminar = false;
    this.botonRegistrar = true;
    this.botonEliminar = false;
  }

  limpiarInputs(): void {
    this.txtDNI =
      this.txtNombre =
      this.txtApellido =
      this.txtCorreo =
      this.txtTelefono =
        '';
    this.matriculaSeleccionada = 1;
    this.fechaInicio = this.fechaFin = 'Selecciona fecha';
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

  actualizarCamposAutomaticamente(): void {
    const dni = this.txtDNI;
    if (dni.length === 8) {
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

  cerrarModal() {
    this.mostrarModal = false;
    this.limpiarInputs();
    this.botonPagar =
      this.botonMatricular =
      this.mostrarDivMatri =
      this.mostrarDivPagar =
      this.botonEditar =
        false;
  }

  cambiarTipoMembresia(): void {
    this.calcularFechaFin();
  }

  calcularFechaFin(): void {
    const idMembresia = this.matriculaSeleccionada.toString();
    const momentFechaInicio = moment(this.fechaInicio);

    const diasAñadir =
      idMembresia === '1' ? 90 : idMembresia === '2' ? 150 : 30;
    momentFechaInicio.add(diasAñadir, 'days');

    this.fechaFin = momentFechaInicio.format('YYYY-MM-DD');
  }

  //Listar-Paginacion-Filtro

  ngOnInit(): void {
    this.getClientes();
    this.page = 1;
  }

  getClientes(): void {
    this.loading = true; 
    this.clientesService.getClientes(this.token).subscribe(
      (data) => {
        this.clientes = data.sort((a, b) => b.idCliente - a.idCliente);
        this.length = this.clientes.length;
        this.clientesPaginados = this.clientes.slice();
      },
      (error) => {
        console.error('Error al obtener clientes:', error);
      },
      () => {
        this.loading = false;
      }
    );
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

  //Registros

  camposObligatorios(): boolean {
    if (
      this.txtDNI.trim() === '' ||
      this.txtNombre.trim() === '' ||
      this.txtApellido.trim() === '' ||
      this.txtCorreo.trim() === '' 
    ) {
      this.enviar = true;
      return false;
    }
    return true;
  }

  registrarCliente(): void {
     if (!this.camposObligatorios()) {
      return; 
    } 
    const nuevoCliente = {
      dni: this.txtDNI,
      nombreCliente: this.txtNombre,
      apellidos: this.txtApellido,
      emailClie: this.txtCorreo,
      telefonoCliente: this.txtTelefono,
    };

    this.clientesService.crearCliente(nuevoCliente, this.token).subscribe(
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
        if (error.error.error === 'Cliente ya existente') {
          alert('Cliente ya existente');
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

  //Factura y reportes

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
    this.reportePDF(this.token);
  }

  //Eliminar

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
    this.clientesService.eliminarCliente(idCliente, this.token).subscribe(
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

  //Editar

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
    this.clientesService
      .editarCliente(codigo, nuevoCliente, this.token)
      .subscribe(
        (response) => {
          this.getClientes();
          this.cerrarModal();
        },
        (error) => {
          console.error('Error al editar el cliente:', error);
        }
      );
  }
}
