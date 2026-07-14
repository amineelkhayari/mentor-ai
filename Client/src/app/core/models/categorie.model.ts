import { BaseEntity } from './base-entity.model';

export interface Categorie extends BaseEntity {
  name: string;
  description?: string | null;
  formations?: unknown[];
}
