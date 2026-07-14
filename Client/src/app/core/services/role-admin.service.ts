import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RoleUpdateDto } from '../models/auth-dtos.model';

@Injectable({ providedIn: 'root' })
export class RoleAdminService {
  private readonly baseUrl = `${environment.apiBaseUrl}/Account/roles`;

  constructor(private http: HttpClient) {}

  /** POST /api/Account/roles/create — body is a plain string (the role name). */
  createRole(roleName: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/create`, JSON.stringify(roleName), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /** POST /api/Account/roles/assign — RoleUpdateDto { email, role }. */
  assignRole(dto: RoleUpdateDto): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/assign`, dto);
  }

  /** POST /api/Account/roles/remove-from-user — RoleUpdateDto { email, role }. */
  removeRoleFromUser(dto: RoleUpdateDto): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/remove-from-user`, dto);
  }

  /** DELETE /api/Account/roles/delete — body is a plain string (the role name). */
  deleteRole(roleName: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete`, {
      body: JSON.stringify(roleName),
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
