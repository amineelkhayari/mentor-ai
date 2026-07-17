import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppRole } from '../models/role.model';
import { LoginDto, RegisterDto, AuthResponse, ChangePasswordDto } from '../models/auth-dtos.model';

export interface DecodedToken {
  sub?: string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'?: string;
  role?: AppRole | AppRole[];
  // ASP.NET Identity commonly emits the role under this full claim URI
  // instead of a short "role" claim — checked as a fallback below.
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name':string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: AppRole | AppRole[];
  exp?: number;
}

const TOKEN_KEY = 'sp_auth_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  /** POST /api/Account/login — LoginDto is { userName, password }, not email. */
  login(userName: string, password: string): Observable<AuthResponse> {
    const payload: LoginDto = { userName, password };
    return this.http
      .post<AuthResponse>(`${environment.apiBaseUrl}/Account/login`, payload)
      .pipe(tap((res) => res?.token && localStorage.setItem(TOKEN_KEY, res.token)));
  }

getAllUsers(): Observable<any> {
    return this.http
      .get<any>(`${environment.apiBaseUrl}/Admin/users`)
      
  }
  
  /**
   * POST /api/Account/register — RegisterDto only has displayName, email,
   * userName (no password field in the spec). See auth-dtos.model.ts for
   * the caveat about how the account's password actually gets set.
   */
  register(payload: RegisterDto): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiBaseUrl}/Account/register`, payload)
      .pipe(tap((res) => res?.token && localStorage.setItem(TOKEN_KEY, res.token)));
  }

  changePassword(payload: ChangePasswordDto): Observable<void> {
    return this.http.post<void>(`${environment.apiBaseUrl}/Account/change-password`, payload);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /** Reads the role claim out of the JWT payload (no server round-trip). */
  getRole(): AppRole | null {
    const decoded = this.decodeToken();
    const raw =
      decoded?.role ??
      decoded?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ??
      null;
    if (!raw) return null;
    return Array.isArray(raw) ? raw[0] ?? null : raw;
  }

  hasRole(...allowed: AppRole[]): boolean {
    const role = this.getRole();
    console.log('Checking role:', role, 'against allowed roles:', allowed);
    return !!role && allowed.includes(role);
  }

  isAdmin(): boolean {
    return this.hasRole("admin");
  }

  public decodeToken(): DecodedToken | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      console.log(json);
      
      return JSON.parse(json);
    } catch {
      return null;
    }
  }
}
