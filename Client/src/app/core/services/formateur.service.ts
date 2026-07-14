import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiCrudService } from './api-crud.service';
import { Formateur, FormateurDto } from '../models/formateur.model';

@Injectable({ providedIn: 'root' })
export class FormateurService extends ApiCrudService<Formateur, FormateurDto, FormateurDto> {
  constructor(http: HttpClient) {
    super(http, 'Formateurs');
  }
}
