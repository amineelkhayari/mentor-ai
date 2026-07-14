import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApplicationUser } from '../models/application-user.model';

@Injectable({ providedIn: 'root' })
export class UserAdminService {
  // GET /api/Admin/users — response schema isn't documented beyond "200 OK",
  // assumed to be a plain array of users (not the paged wrapper the other
  // resources use, since no PageIndex/PageSize params are listed for it).
  private readonly baseUrl = `${environment.apiBaseUrl}/Admin/users`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApplicationUser[]> {
    return this.http.get<ApplicationUser[]>(this.baseUrl);
  }
}
