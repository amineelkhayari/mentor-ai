// Matches LoginDto exactly.
export interface LoginDto {
  userName: string;
  password: string;
}

// Matches RegisterDto exactly. Note: the backend's RegisterDto has no
// password field at all — only displayName, email, userName. Confirm with
// your backend how the account gets a usable password (e.g. a follow-up
// call to /api/Account/change-password, or a default/temp password flow)
// before wiring this up to production.
export interface RegisterDto {
  displayName: string;
  email: string;
  userName: string;
}

// Matches ChangePasswordDto exactly.
export interface ChangePasswordDto {
  email: string;
  currentPassword: string;
  newPassword: string;
}

// Matches RoleUpdateDto exactly (used for both assign and remove-from-user).
export interface RoleUpdateDto {
  email: string;
  role: string;
}

// The login/register response schema isn't documented in the OpenAPI spec
// (responses just say "200 OK" with no body schema). This assumes a
// typical JWT-issuing shape — adjust field names once you confirm the
// actual response from your backend.
export interface AuthResponse {
  token: string;
  userId?: string;
  email?: string;
  displayName?: string;
  roles?: string[];
}
