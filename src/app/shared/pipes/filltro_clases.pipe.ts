import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtro',
  standalone: true
})
export class FiltroPipe implements PipeTransform {

  transform(clases: any[], term: string): any[] {
    if (!term || term.trim() === '') {
      return clases;
    }
    term = term.toLowerCase();
    return clases.filter(clase =>
      clase.descripcion.toLowerCase().includes(term) ||
      clase.fecha.includes(term) ||
      clase.horario.toLowerCase().includes(term) ||
      clase.instructor.toLowerCase().includes(term) 
    );
  }
}
