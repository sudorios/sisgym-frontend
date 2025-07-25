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
