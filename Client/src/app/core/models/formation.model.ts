import { BaseEntity } from './base-entity.model';
import { Categorie } from './categorie.model';

export interface Formation extends BaseEntity {
  title: string;
  description?: string | null;
  durationHours: number;
  categoryId: number;
  category?: Categorie;
}
