import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { LoginResponse } from '../models/login.interface';
import { map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl =
    'https://688390b821fa24876a9e878d.mockapi.io/sisgym/usuarios';

  autenticar(usuario: string, password: string): Observable<LoginResponse> {
    const passwordHash = this.cifrarSHA256(password);
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((usuarios) => {
        const user = usuarios.find(
          (u) =>
            u.usuario === usuario &&
            this.cifrarSHA256(u.password) === passwordHash
        );
        return user
          ? {
              resultado: 'valido',
              token: 'token-mockapi-123',
              codiUsua: user.codiUsua,
              tipoUsua: user.tipoUsua,
            }
          : {
              resultado: 'invalido',
              token: '',
              codiUsua: '',
              tipoUsua: '',
            };
      })
    );
  }

  private userRole: string = '';

  getUserRole(): string {
    return this.userRole;
  }

  updateUserRole(role: string): void {
    this.userRole = role;
  }

  isLoggedIn: boolean = false;
  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.checkAuthenticationStatus();
  }

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

  private checkAuthenticationStatus(): void {
    const token = this.cookieService.get('token');
    if (token && token.trim() !== '') {
      this.isLoggedIn = true;
      const userRole = this.cookieService.get('userRole');
      if (userRole && userRole.trim() !== '') {
        this.userRole = userRole;
      }
    } else {
      this.isLoggedIn = false;
      this.userRole = '';
    }
  }
}
