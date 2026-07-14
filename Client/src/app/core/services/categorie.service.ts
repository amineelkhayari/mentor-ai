import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiCrudService } from './api-crud.service';
import { Categorie } from '../models/categorie.model';

export interface CreateCategorieDto {
  name: string;
  description?: string | null;
}
export type UpdateCategorieDto = CreateCategorieDto;

@Injectable({ providedIn: 'root' })
export class CategorieService extends ApiCrudService<Categorie, CreateCategorieDto, UpdateCategorieDto> {
  constructor(http: HttpClient) {
    super(http, 'Categories');
  }
}
