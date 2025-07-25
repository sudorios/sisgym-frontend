import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PagoService {
  private apiUrl = 'http://localhost:8080/Sis_Gym/webresources/entities.pago';

  constructor(private http: HttpClient) { }

  crearPago(pago: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, pago)
    .pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }
}
