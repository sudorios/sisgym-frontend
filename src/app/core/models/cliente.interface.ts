import { Plan } from "./plan-interface";

export interface Cliente {
  id: string;
  dni: string;
  nombreCliente: string;
  apellidos: string;
  emailClie: string;
  telefonoCliente?: string;
  plan: Plan;
}


export interface ClienteForm {
  dni: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
}

export interface ModalState {
  mostrar: boolean;
  modo: 'registrar' | 'editar' | 'eliminar';
}

