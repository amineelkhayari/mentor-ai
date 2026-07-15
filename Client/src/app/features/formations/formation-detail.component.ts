import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormationService } from '../../core/services/formation.service';
import { FormationDetails } from '../../core/models/formation.model';

@Component({
  selector: 'app-formation-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="formation-page" *ngIf="formation">

  <div class="top-bar">
    <button class="back-btn" (click)="goBack()">
      ← Back
    </button>
  </div>

  <div class="hero-section">

    <div class="hero-content">

      <span class="category-chip">
        {{ formation.categoryName }}
      </span>

      <h1>{{ formation.title }}</h1>

      <p>
        {{ formation.description }}
      </p>

      <div class="hero-meta">

        <div class="meta-card">
          <span class="meta-value">
            {{ formation.durationHours }}
          </span>
          <span class="meta-label">
            Hours
          </span>
        </div>

        <div class="meta-card">
          <span class="meta-value">
            {{ formation.sessions?.length || 0 }}
          </span>
          <span class="meta-label">
            Sessions
          </span>
        </div>

      </div>

    </div>

  </div>

  <div class="section-title">
    <h2>Available Sessions</h2>
    <span>{{ formation.sessions?.length || 0 }} sessions</span>
  </div>

  <div
    class="sessions-grid"
    *ngIf="formation.sessions?.length; else noSessions"
  >

    <div
      class="session-card"
      *ngFor="let session of formation.sessions"
    >

      <div class="session-header">

        <div>
          <h3>
            {{ session.name || 'Training Session' }}
          </h3>

          <span class="session-badge">
            Active
          </span>
        </div>

      </div>

      <div class="session-body">

        <div class="info-item">
          <span>Start</span>
          <strong>
            {{ session.startDate | date:'medium' }}
          </strong>
        </div>

        <div class="info-item">
          <span>End</span>
          <strong>
            {{ session.endDate | date:'medium' }}
          </strong>
        </div>

        <div class="info-item">
          <span>Trainer</span>
          <strong>
            #{{ session.formateurId }}
          </strong>
        </div>

      </div>

    </div>

  </div>

  <ng-template #noSessions>

    <div class="empty-card">
      <div class="empty-icon">📅</div>
      <h3>No Sessions Yet</h3>
      <p>This formation doesn't have any scheduled sessions.</p>
    </div>

  </ng-template>

</div>

<div *ngIf="!formation" class="loading-card">
  <div class="spinner"></div>
  <span>Loading formation...</span>
</div>
  `,
  styleUrl: './formation.css'

})
export class FormationDetailComponent implements OnInit {

  formation: FormationDetails | null = null;

  constructor(
    private route: ActivatedRoute,
    private formationService: FormationService,
      private router: Router


  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.formationService
      .getById(id)
      .subscribe({
        next: (res) => {
          this.formation = res as FormationDetails;
        },
        error: (err) => {
          console.error(err);
        }
      });
  }
goBack(): void {
  //this.location.back();
  
  this.router.navigate(['/formations']);

}
}