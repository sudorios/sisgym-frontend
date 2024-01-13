import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MatriculaService {

  private apiUrl = 'http://localhost:8080/Sis_Gym/webresources/entities.matricula';

  constructor(private http: HttpClient) { }

  crearMatricula(matricula: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, matricula)
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      );
  }

  contarMembresias(): Observable<any> {
    const contadorUrl = `${this.apiUrl}/contar-mb`;
    return this.http.get<any>(contadorUrl)
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      );
  }
}
