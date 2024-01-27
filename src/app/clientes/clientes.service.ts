
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private apiUrl = 'http://localhost:8080/Sis_Gym/webresources/entities.cliente';
  private apiUrlReniec = 'https://dniruc.apisperu.com/api/v1/dni/';


  constructor(private http: HttpClient) { }

  getClientes(token: string): Observable<any[]> {
    const headers = new HttpHeaders().set('token', token);
    return this.http.get<any[]>(this.apiUrl, { headers });
  }
  getClientes2(token: string): Observable<any[]> {
    const headers = new HttpHeaders().set('token', token);
    return this.http.get<any[]>(`${this.apiUrl}/findAll2`, { headers });
  }

  getClienteByDNI(dni: string): Observable<any> {
    const urlCreate = `?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Ind0a2U5MEBnbWFpbC5jb20ifQ.Y-Tamk0c0yQeyiW3Lnh9cY2y3UtsSkG9DP7rP78rbFw`;
    const url = `${this.apiUrlReniec}${dni}${urlCreate}`;
    return this.http.get<any>(url);
  }

  eliminarCliente(idCliente: number, token: string): Observable<any> {
    const headers = new HttpHeaders().set('token', token);
    const url = `${this.apiUrl}/${idCliente}`;

    return this.http.delete<any>(url, { headers });
  }

  crearCliente(cliente: any, token: string): Observable<any> {
    const headers = new HttpHeaders().set('token', token);
    return this.http.post<any>(this.apiUrl, cliente, { headers });
  }

  imprimirPDF(token: string): Observable<any> {
    const headers = new HttpHeaders().set('token', token);
    return this.http.get<any>(`${this.apiUrl}/imprimirPDF`, { headers });
  }
  
  imprimirPDF2(token: string): Observable<any> {
    const headers = new HttpHeaders().set('token', token);
    return this.http.get<any>(`${this.apiUrl}/imprimirPDF2`, { headers });
  }

  editarCliente(id: number, cliente: any, token: string): Observable<any> {
    const headers = new HttpHeaders().set('token', token);
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<any>(url, cliente, { headers });
  }
  
  renovarCliente(id: number, token: string): Observable<any> {
    const headers = new HttpHeaders().set('token', token);
    const url = `${this.apiUrl}/renovar/${id}`;
    return this.http.delete<any>(url, { headers });
  }
}