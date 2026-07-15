import { BaseEntity } from './base-entity.model';
import { Session } from './session.model';

export interface UserSession extends BaseEntity {
  userId: string;
  sessionId: number;
  session?: Session;
  sessionName: string;
  registrationDate: string;
  isCompleted: boolean;
}

// Matches CreateUserSessionDto exactly.
export interface CreateUserSessionDto {
  sessionId: number;
}

// Matches UpdateUserSessionDto exactly.
export interface UpdateUserSessionDto {
  sessionId: number;
  isCompleted: boolean;
}
