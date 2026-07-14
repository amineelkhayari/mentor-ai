import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Thin generic wrapper over HttpClient for the paged REST resources
 * (Categories, Formateurs, Formations, Sessions, UserSessions all share
 * the same PageIndex/PageSize/Sort/Name query + paged response shape).
 */
export abstract class ApiCrudService<T, TCreate = Partial<T>, TUpdate = Partial<T>> {
  protected readonly baseUrl: string;

  constructor(protected http: HttpClient, resourcePath: string) {
    this.baseUrl = `${environment.apiBaseUrl}/${resourcePath}`;
  }

  // getAll(query?: PagedQuery): Observable<PagedResult<T>> {
  //   let params = new HttpParams();
  //   if (query?.pageIndex != null) params = params.set('PageIndex', query.pageIndex);
  //   if (query?.pageSize != null) params = params.set('PageSize', query.pageSize);
  //   if (query?.sort) params = params.set('Sort', query.sort);
  //   if (query?.name) params = params.set('Name', query.name);

  //   return this.http.get<PagedResult<T>>(this.baseUrl, { params });
  // }
   getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.baseUrl);
  }

  getById(id: number | string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${id}`);
  }

  create(payload: TCreate): Observable<T> {
    return this.http.post<T>(this.baseUrl, payload);
  }

  update(id: number | string, payload: TUpdate): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
