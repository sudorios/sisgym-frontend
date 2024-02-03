import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private userRole: string = '';

  getUserRole(): string {
    return this.userRole;
  }

  updateUserRole(role: string): void {
    this.userRole = role;
  }

  isLoggedIn: boolean = false;
  private apiUrl = 'http://localhost:8080/Sis_Gym/webresources/dto.usuario';
  constructor(private http: HttpClient) {}



  cifrarSHA256(texto: string): string {
    const hash = CryptoJS.SHA256(texto).toString(CryptoJS.enc.Hex);
    return hash;
  }

  validarUsuario(
    usuario: string,
    passwordHash: string,
    fecha: string
  ): Observable<any> {
    const body = `logiUsua=${usuario}&passUsua=${passwordHash}&fechUsua=${fecha}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    return this.http.post<any>(`${this.apiUrl}/validarUsuario`, body, {
      headers,
    });
  }

  buscarUsuario(codiUsua: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/buscarUsuario/${codiUsua}`);
  }

  actualizarEstadoInicioSesion(estado: boolean): void {
    this.isLoggedIn = estado;
  }

}
