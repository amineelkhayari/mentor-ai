import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiCrudService } from './api-crud.service';
import { UserSession, CreateUserSessionDto, UpdateUserSessionDto } from '../models/user-session.model';
import { PagedQuery } from '../models/paged-result.model';

@Injectable({ providedIn: 'root' })
export class UserSessionService extends ApiCrudService<UserSession, CreateUserSessionDto, UpdateUserSessionDto> {
  constructor(http: HttpClient) {
    super(http, 'UserSessions');
  }

  /** Register the current user for a session (join). POST /api/UserSessions. */
  register(sessionId: number): Observable<UserSession> {
    return this.create({ sessionId });
  }

  /**
   * "My sessions": there's no dedicated /mine endpoint in the API. This
   * calls the same GET /api/UserSessions the admin screens use — it only
   * returns the current user's registrations if your backend scopes the
   * UserSessions controller by the caller's identity for non-admin roles.
   * If it returns everyone's registrations instead, filter by userId here
   * once you can read the current user's id (e.g. decode it in AuthService).
   */
  getMine(query?: PagedQuery) {
    return this.getAll();
  }

  markCompleted(id:number, userSession: UpdateUserSessionDto): Observable<UpdateUserSessionDto> {
    return this.update(id, userSession);
  }
}
