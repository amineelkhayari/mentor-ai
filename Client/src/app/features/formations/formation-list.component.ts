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
<div class="formations-page">
  <div class="page-header">
    <div>
      <h1>Formations</h1>
      <p>Browse available training programs and courses.</p>
    </div>

    <div class="stats-badge">
      {{ formations.length }} Formation{{ formations.length !== 1 ? 's' : '' }}
    </div>
  </div>

  <div *ngIf="formations.length; else emptyState" class="formations-grid">
    <div class="formation-card" *ngFor="let f of formations">
      <div class="card-header">
        <h3>{{ f.title }}</h3>

        <span class="duration-badge">
          {{ f.durationHours }}h
        </span>
      </div>

      <div class="category" *ngIf="f.category">
        {{ f.category.name }}
      </div>

      <p class="description" *ngIf="f.description">
        {{ f.description }}
      </p>

      <div class="card-footer">
        <button class="details-btn">
          View Details
        </button>
      </div>
    </div>
  </div>

  <ng-template #emptyState>
    <div class="empty-state">
      <div class="empty-icon">📚</div>
      <h3>No formations available</h3>
      <p>New formations will appear here when they are created.</p>
    </div>
  </ng-template>
</div>  `,
  styleUrl: './formation.css',

})
export class FormationListComponent implements OnInit {
  formations: Formation[] = [];

  constructor(private formationService: FormationService) { }

  ngOnInit(): void {
    this.formationService.getAll().subscribe((data) => (this.formations = data));

  }
}
