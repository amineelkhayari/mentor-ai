import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormationService } from '../../core/services/formation.service';
import { Formation } from '../../core/models/formation.model';

@Component({
  selector: 'app-formation-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <h2>Formations</h2>
    <ul>
      <li *ngFor="let f of formations">
        <strong>{{ f.title }}</strong>
        <span *ngIf="f.category"> — {{ f.category.name }}</span>
        ({{ f.durationHours }}h)
        <p *ngIf="f.description">{{ f.description }}</p>
      </li>
    </ul>
    <p *ngIf="!formations.length">No formations yet.</p>
  `,
})
export class FormationListComponent implements OnInit {
  formations: Formation[] = [];

  constructor(private formationService: FormationService) { }

  ngOnInit(): void {
    this.formationService.getAll().subscribe((data) => (this.formations = data));

  }
}
