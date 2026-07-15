import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiCrudService } from './api-crud.service';
import { Formation, FormationDetails } from '../models/formation.model';

export interface FormationDto {
  id?: number;
  title: string;
  description?: string | null;
  durationHours: number;
  categoryId: number;
}

@Injectable({ providedIn: 'root' })
export class FormationService extends ApiCrudService<Formation | FormationDetails, FormationDto, FormationDto> {
  constructor(http: HttpClient) {
    super(http, 'Formations');
  }
}
