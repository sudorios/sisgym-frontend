import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
  private apiUrl = 'http://localhost:8080/Sis_Gym/webresources/entities.asistencia';
  constructor(private http: HttpClient) { }

  crearAsistencia(asistencia: any, token: string): Observable<any> {
    const headers = new HttpHeaders().set('token', token);
    return this.http.post<any>(this.apiUrl, asistencia, { headers });
  }

  contarAsistencias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/contar-asis`);
  }
}
