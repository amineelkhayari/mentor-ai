import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiCrudService } from './api-crud.service';
import { Session, CreateSessionDto, UpdateSessionDto } from '../models/session.model';
import { UpdateUserSessionDto } from '../models/user-session.model';

@Injectable({ providedIn: 'root' })
export class SessionService extends ApiCrudService<Session, CreateSessionDto, UpdateSessionDto> {
  constructor(http: HttpClient) {
    super(http, 'Sessions');
  }

  /** Convenience alias for the live-call screen: session incl. formateur populated server-side. */
  getWithFormateur(id: number): Observable<Session> {
    return this.getById(id);
  }
}
