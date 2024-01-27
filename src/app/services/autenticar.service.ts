import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AutenticarService {
  private apiUrl = 'http://localhost:8080/Sis_Gym/webresources/dto.usuario';

  constructor(private http: HttpClient) {}

  validarToken(logi: string, pass: string, codigo: string): Observable<any> {
    const body = `logi=${logi}&pass=${pass}&codigo=${codigo}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    return this.http.put<any>(
      `${this.apiUrl}/autenticarCodigo`,
      body.toString(),
      { headers }
    );
  }

  asociarLlave(logi: string, pass: string): Observable<any> {
    const body = `logi=${logi}&pass=${pass}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    return this.http.put<any>(
      `${this.apiUrl}/asociarLlave`,
      body.toString(),
      { headers }
    );
  }
}
