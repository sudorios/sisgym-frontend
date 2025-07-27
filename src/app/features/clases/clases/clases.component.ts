import {
  Component,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { ClasesService } from '../../../core/services/clases.service';
import { FiltroPipe } from '../../../shared/pipes/filltro_clases.pipe';

@Component({
  selector: 'app-clases',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, FormsModule],
  templateUrl: './clases.component.html',
  styleUrl: './clases.component.css',
})
export class ClasesComponent implements OnInit {
  filtroClases = new FiltroPipe();
  //private token = this.cookieService.get('token');

  //(Modales, botones y div)
  mostrarModal: boolean = false;
  mostrarConfirmacion: boolean = false;
  tituloModal: string = 'Agregar clase';
  mostrarDivReg: boolean = true;
  mostrarDivMatri: boolean = false;
  mostrarDivPagar: boolean = false;
  mostrarEliminar: boolean = false;
  botonRegistrar: boolean = true;
  botonMatricular: boolean = false;
  botonPagar: boolean = false;
  botonEliminar: boolean = false;
  botonEditar: boolean = false;
  buscarClase: string = '';

  //Clases
  clases: any[] = [];
  clasesPaginados: any[] = [];
  length = 0;
  pageSize = 8;
  txtDesc: string = '';
  txtFecha: string = '';
  selectHorario: string = '1';
  txtInstructor: string = '';
  clienteAEliminar: any;
  clienteAEditar: any;
  valorIdCliente: number | undefined;

  contador: number = 0;
  ejecutarUnaVez: boolean = true;

  clasesFiltradas: any[] = [];

  constructor(
    private cookieService: CookieService,
    private clasesService: ClasesService
  ) {}

  ngOnInit(): void {
    this.page = 1;
    this.buscarClase = this.cookieService.get('fecha');
    this.contador = this.contarDigitos(this.buscarClase);
    const contadorAnterior = this.contador;
    console.log(this.contador);
this.getClasesByFecha();
  }

  //Tabla

  async getClases(): Promise<void> {
    const token = this.cookieService.get('token');
  
    try {
      const data = await this.clasesService.getClases(token).toPromise();
      this.clases = data ? data.sort((a, b) => b.idClases - a.idClases) : [];
      this.length = this.clases.length;
      this.clasesPaginados = this.clases.slice();
    } catch (error) {
      // Manejar errores
      console.error('Error al obtener las clases:', error);
    }
  }

  getClasesByFecha(): void {
    const token = this.cookieService.get('token');
    const fecha = this.cookieService.get('fecha');

    this.clasesService.getClasesByFecha(token, fecha).subscribe((data) => {
      this.clases = data ? data.sort((a, b) => b.idClases - a.idClases) : [];
      this.length = this.clases.length;
      this.clasesPaginados = this.clases.slice();
    });
  }

  async onKeyReleased(): Promise<void> {
    const contadorAnterior = this.contador;
    this.contador = this.contarDigitos(this.buscarClase);
  
  
    if (this.contador < contadorAnterior && this.ejecutarUnaVez) {
      await this.getClases();       
      this.clasesPaginados = this.filtroClases.transform(
        this.clases as any[],
        this.buscarClase
      );
      this.length = this.clasesPaginados.length;
      this.page = 1;

      this.ejecutarUnaVez = false;
    }
  
    if (this.buscarClase !== '') {
      this.clasesPaginados = this.filtroClases.transform(
        this.clases as any[],
        this.buscarClase
      );
      this.length = this.clasesPaginados.length;
      this.page = 1;
    }
  
    console.log('Contador de dígitos:', this.contador);
  }

  contarDigitos(texto: string): number {
    const soloNumeros = texto.replace(/\D/g, '');
    return soloNumeros.length;
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

  //registrar

  abrirModal() {
    this.tituloModal = 'Agregar clase';
    this.mostrarModal = true;
    this.mostrarDivReg = true;
    this.txtFecha = this.cookieService.get('fecha');
    this.botonRegistrar = true;

    this.mostrarEliminar = false;
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
      this.txtDesc.trim() === '' ||
      this.txtFecha.trim() === '' ||
      this.selectHorario.trim() === '' ||
      this.txtInstructor.trim() === ''
    ) {
      alert('Todos los campos son obligatorios');
      return;
    }
    const token = this.cookieService.get('token');
    const nuevaClase = {
      instructor: this.txtInstructor,
      fecha: this.txtFecha,
      horario: this.selectHorario,
      descripcion: this.txtDesc,
    };
    this.clasesService.crearClase(nuevaClase, token).subscribe(
      (response) => {
        this.getClasesByFecha();
        this.cerrarModal();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  eliminarClienteModal(idCliente: number): void {
    this.abrirModal();
    this.botonMatricular = false;
    this.tituloModal = 'Eliminar Cliente';
    this.mostrarDivReg = false;
    this.mostrarEliminar = true;
    this.botonEliminar = true;
    console.log(idCliente);
    this.clienteAEliminar = this.clases.find(
      (cliente) => cliente.idCliente === idCliente
    );
    this.botonRegistrar = false;
  }

  eliminarCliente(idCliente: number): void {
    const token = this.cookieService.get('token');
  }

  editarCliente(idCliente: number): void {
    this.abrirModal();
    this.clienteAEditar = this.clases.find(
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
      dni: this.txtDesc,
      nombreCliente: this.txtFecha,
      apellidos: this.selectHorario,
      emailClie: this.txtInstructor,
      estaClie: 1,
    };
    const codigo = this.valorIdCliente ?? 0;
    console.log(codigo);
  }

  limpiarInputs(): void {
    this.txtDesc = '';
    this.txtFecha = '';
    this.selectHorario = '1';
    this.txtInstructor = '';
  }

  cargarDatosCliente(cliente: any): void {
    this.txtDesc = cliente.dni || '';
    this.txtFecha = cliente.nombreCliente || '';
    this.selectHorario = cliente.apellidos || '';
    this.txtInstructor = cliente.emailClie;
  }

  generarReport() {}
}
