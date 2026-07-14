/**
 * Matches the backend's paged-list response shape used across
 * Categories, Formateurs, Formations, Sessions, UserSessions.
 * (Assumed common "pageIndex/pageSize/count/data" wrapper — adjust the
 * property names here in one place if your backend's actual JSON differs.)
 */
export interface PagedResult<T> {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: T[];
}

export interface PagedQuery {
  pageIndex?: number;
  pageSize?: number;
  sort?: string;
  name?: string;
}
