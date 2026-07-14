export interface ApplicationUser {
  id: string;
  userName: string;
  email: string;
  displayName?: string;
  // GET /api/Admin/users shape isn't documented in the spec; assuming Identity's
  // usual "roles" array since a user can hold more than one role.
  roles: string[];
}
