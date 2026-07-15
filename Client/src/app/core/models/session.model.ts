import { BaseEntity } from './base-entity.model';
import { Formation } from './formation.model';
import { Formateur } from './formateur.model';
import { UserSession } from './user-session.model';

// Matches CreateSessionDto / UpdateSessionDto exactly — note it's "title",
// not "name", and there is no maxParticipants field on the API DTOs even
// though the C# Session entity has one. If you need it settable from the
// client, add it to the backend DTOs first.
export interface Session extends BaseEntity {
  name: string;
  startDate: string;
  endDate: string;
  formationId: number;
  formation?: Formation;
  formateurId: number;
  formateur?: Formateur;
  maxParticipants?: number; // present on GET responses only, per the entity
  sessionJoined: string;
  avatarSessionResponse?:AvatarSessionResponse;
  userSessions:UserSession[]

}

export interface CreateSessionDto {
  name: string;
  startDate: string;
  endDate: string;
  formationId: number;
  formateurId: number;
}

export type UpdateSessionDto = CreateSessionDto;
export interface AvatarSessionResponse {
  sessionId: string;
  joinUrl: string;
  clientToken?: string | null;
  providerName: string;
  createdAtUtc: string; // ISO 8601 date string from the API
}
