import { BaseEntity } from './base-entity.model';
import { Categorie } from './categorie.model';

export interface Formation extends BaseEntity {
  title: string;
  description?: string | null;
  durationHours: number;
  categoryId: number;
  category?: Categorie;
  categoryName: string;

}

export interface FormationDetails extends BaseEntity {
  title: string;
  description: string;
  durationHours: number;
  categoryId: number;
  categoryName: string;
  sessions: {
    name: string;
    startDate: string;
    endDate: string;
    formationId: number;
    formateurId: number;
  }[];
}
