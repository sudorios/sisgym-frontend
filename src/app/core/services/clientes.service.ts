import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Cliente } from '../models/cliente.interface';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private readonly apiUrl = 
    'https://688390b821fa24876a9e878d.mockapi.io/sisgym/cliente';

  constructor(private http: HttpClient) {}

  private authHeaders(token: string): HttpHeaders {
    return new HttpHeaders().set('token', token);
  }

  getClientes(token: string): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl, {
      headers: this.authHeaders(token)
    });
  }

  getClienteByDNI(dni: string, token: string): Observable<Cliente | null> {
    return this.http
      .get<Cliente[]>(`${this.apiUrl}?dni=${dni}`, {
        headers: this.authHeaders(token)
      })
      .pipe(
        map(list => (list.length ? list[0] : null))
      );
  }

  crearCliente(
    cliente: Omit<Cliente, 'id'>,
    token: string
  ): Observable<Cliente> {
    return this.http.post<Cliente>(
      this.apiUrl,
      cliente,
      { headers: this.authHeaders(token) }
    );
  }

  editarCliente(
    id: string,
    cambios: Partial<Omit<Cliente, 'id'>>,
    token: string
  ): Observable<Cliente> {
    return this.http.put<Cliente>(
      `${this.apiUrl}/${id}`,
      cambios,
      { headers: this.authHeaders(token) }
    );
  }

  eliminarCliente(id: string, token: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`,
      { headers: this.authHeaders(token) }
    );
  }
}