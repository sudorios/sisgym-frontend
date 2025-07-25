import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ClasesService {
  private apiUrl = 'http://localhost:8080/Sis_Gym/webresources/entities.clases';
  constructor(private http: HttpClient) { }
  
  getClases(token: string): Observable<any[]> {
    const headers = new HttpHeaders().set('token', token);
    const apiUrlWithJson = `${this.apiUrl}/json`;
    
    return this.http.get<any[]>(apiUrlWithJson, { headers });
  }

  getClasesByFecha(token: string, fecha: string): Observable<any[]> {
    const headers = new HttpHeaders().set('token', token);
    const apiUrlWithFecha = `${this.apiUrl}/buscarFecha/${fecha}`;
    return this.http.get<any[]>(apiUrlWithFecha, { headers });
  }

  crearClase(clase: any, token: string): Observable<any> {
    const headers = new HttpHeaders().set('token', token);
    const apiUrlCrear = `${this.apiUrl}`;
    return this.http.post(apiUrlCrear, clase, { headers });
  }
  
}
