import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtro',
  standalone: true
})
export class FiltroPipe implements PipeTransform {

  transform(clientes: any[], term: string): any[] {
    if (!term || term.trim() === '') {
      return clientes;
    }

    term = term.toLowerCase();
    return clientes.filter(cliente =>
      cliente.nombreCliente.toLowerCase().includes(term) ||
      cliente.apellidos.toLowerCase().includes(term) ||
      cliente.dni.includes(term) ||
      cliente.emailClie.toLowerCase().includes(term) ||
      cliente.telefonoCliente.includes(term)
    );
  }
}
