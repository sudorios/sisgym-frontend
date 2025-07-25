import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  private apiUrl = 'http://localhost:8080/Sis_Gym/webresources/entities.factura';
  constructor(private http: HttpClient) { }
  crearFactura(factura: any): Observable<any>{
    return this.http.post<any>(this.apiUrl, factura)
    .pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }

  generarFactura(idFactura: number): Observable<any> {
    const url = `${this.apiUrl}/generarFactura/${idFactura}`;
    return this.http.get(url);

  }

  generarExcel(): Observable<any> {
    const url = `${this.apiUrl}/generarIngresos`;
    return this.http.get(url);
  }

  generarPDF(): Observable<any> {
    const url = `${this.apiUrl}/generarIngresosPDF`;
    return this.http.get(url);
  }

  getIngresos(): Observable<any[]> {
    const url = `${this.apiUrl}/ingresos`;
    return this.http.get<any[]>(url)
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      );
  }
}
