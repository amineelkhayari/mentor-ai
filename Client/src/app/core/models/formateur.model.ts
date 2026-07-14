import { BaseEntity } from './base-entity.model';

// Matches FormateurDto. Note the backend's JSON casing: "llM_Provider",
// not "llmProvider" — this is what actually comes back from /api/Formateurs.
export interface Formateur extends BaseEntity {
  avatarId: string;
  name: string;
  lang: string;
  firstMessage: string;
  systemPrompt: string;
  voiceProvider: string;
  llM_Provider: string;
  providerNom: number; // or number if your API returns enum values
  sessions?: unknown[];
}

export interface FormateurDto {
  avatarId: string;
  name: string;
  lang: string;
  firstMessage: string;
  systemPrompt: string;
  voiceProvider: string;
  llM_Provider: string;
  providerNom: number;
}
export enum AvatarProvider {
  Anam = 1,
  Tavus = 2
}