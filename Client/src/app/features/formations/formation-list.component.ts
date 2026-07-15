import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
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
    <div class="categories-bar" *ngIf="categories.length">

  <button
    *ngFor="let category of categories"
    class="category-chip"
    [class.active]="selectedCategory === category"
    (click)="filterByCategory(category)"
  >
    {{ category }}
  </button>

</div>

    <div class="stats-badge">
      {{ formations.length }} Formation{{ formations.length !== 1 ? 's' : '' }}
    </div>
  </div>

  <div *ngIf="filteredFormations.length; else emptyState" class="formations-grid">
    <div class="formation-card" *ngFor="let f of filteredFormations">
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
        <button class="details-btn" (click)="launch(f.id)">
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
  filteredFormations: Formation[] = [];

  categories: string[] = [];
  selectedCategory = 'All';

  constructor(private formationService: FormationService, private router: Router) { }

  ngOnInit(): void {
    this.formationService.getAll().subscribe((data) => {
      this.formations = data;
      this.filteredFormations = data;

      this.categories = [
        'All',
        ...new Set(
          data
            .map(x => x.categoryName)
            .filter(Boolean)
        )
      ];
    });
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;

    if (category === 'All') {
      this.filteredFormations = this.formations;
      return;
    }

    this.filteredFormations = this.formations.filter(
      x => (x.categoryName) === category
    );
  }

  launch(id: number): void {
    this.router.navigate(['/formations', id, 'detail']);
  }
}
