import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SessionService } from '../../core/services/session.service';
import { FormationService } from '../../core/services/formation.service';
import { FormateurService } from '../../core/services/formateur.service';
import { Session } from '../../core/models/session.model';
import { Formation } from '../../core/models/formation.model';
import { Formateur } from '../../core/models/formateur.model';

@Component({
  selector: 'app-session-manage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="admin-page">

  <div class="page-header">
    <div>
      <h1>Sessions</h1>
      <p>Schedule and manage live AI tutor sessions.</p>
    </div>

    <div class="stats-badge">
      {{ sessions.length }} Sessions
    </div>
  </div>

  <div class="banner-error" *ngIf="error">
    {{ error }}
  </div>

  <div class="form-card">

    <h3>Create Session</h3>

    <form class="create-form" [formGroup]="form" (ngSubmit)="create()">

      <div class="field">
        <label>Session Title</label>
        <input
          formControlName="name"
          placeholder="e.g. Subnetting Workshop"
        />
      </div>

      <div class="field">
        <label>Formation</label>
        <select formControlName="formationId">
          <option [ngValue]="null" disabled>Select formation</option>
          <option *ngFor="let f of formations" [ngValue]="f.id">
            {{ f.title }}
          </option>
        </select>
      </div>

      <div class="field">
        <label>Trainer</label>
        <select formControlName="formateurId">
          <option [ngValue]="null" disabled>Select trainer</option>
          <option *ngFor="let t of formateurs" [ngValue]="t.id">
            {{ t.name }}
          </option>
        </select>
      </div>

      <div class="field">
        <label>Start Date</label>
        <input
          type="datetime-local"
          formControlName="startDate"
        />
      </div>

      <div class="field">
        <label>End Date</label>
        <input
          type="datetime-local"
          formControlName="endDate"
        />
      </div>

      <button
        class="btn-primary"
        type="submit"
        [disabled]="form.invalid || saving"
      >
        {{ saving ? 'Creating...' : 'Create Session' }}
      </button>

    </form>

  </div>

  <div *ngIf="sessions.length; else empty" class="cards-grid">

    <div class="entity-card" *ngFor="let s of sessions">

      <div class="card-header">

        <h3>{{ s.name }}</h3>

        <span class="count-badge">
          Live
        </span>

      </div>

      <p class="description">
        Scheduled training session.
      </p>

      <div class="meta-list">

        <div>
          <strong>Formation:</strong>
          {{ s.formation?.title ?? formationTitle(s.formationId) }}
        </div>

        <div>
          <strong>Trainer:</strong>
          {{ s.formateur?.name ?? formateurLabel(s.formateurId) }}
        </div>

        <div>
          <strong>Start:</strong>
          {{ s.startDate | date:'medium' }}
        </div>

        <div>
          <strong>End:</strong>
          {{ s.endDate | date:'medium' }}
        </div>

      </div>

      <div class="card-footer">
        <button
          class="btn-danger"
          (click)="remove(s)"
        >
          Delete
        </button>
      </div>

    </div>

  </div>

  <ng-template #empty>

    <div class="empty-state">
      <div class="empty-icon">🎥</div>
      <h3>No Sessions Found</h3>
      <p>Create your first session using the form above.</p>
    </div>

  </ng-template>

</div>
    `,
  styleUrl: './admin.css',
})
export class SessionManageComponent implements OnInit {
  sessions: Session[] = [];
  formations: Formation[] = [];
  formateurs: Formateur[] = [];
  saving = false;
  error = '';
    private readonly fb = inject(FormBuilder);


  form = this.fb.group({
    name: ['', Validators.required],
    formationId: [null as number | null, Validators.required],
    formateurId: [null as number | null, Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
  });

  constructor(
    private sessionService: SessionService,
    private formationService: FormationService,
    private formateurService: FormateurService
  ) {}

  ngOnInit(): void {
    this.load();
    this.formationService.getAll().subscribe((res) => (this.formations = res));
    this.formateurService.getAll().subscribe((res) => (this.formateurs = res));
  }

  load(): void {
    this.sessionService.getAll().subscribe((res) => (this.sessions = res));
  }

  formationTitle(id: number): string {
    return this.formations.find((f) => f.id === id)?.title ?? `#${id}`;
  }

  formateurLabel(id: number): string {
    const f = this.formateurs.find((x) => x.id === id);
    return f ? `${f.voiceProvider} · ${f.lang}` : `#${id}`;
  }

  create(): void {
    if (this.form.invalid) return;
    this.saving = true;
    this.error = '';
    this.sessionService.create(this.form.getRawValue() as any).subscribe({
      next: () => {
        this.saving = false;
        this.form.reset();
        this.load();
      },
      error: (err) => {
        this.saving = false;
        this.error = err?.error?.message ?? 'Could not schedule the session.';
      },
    });
  }

  remove(s: Session): void {
    if (!confirm(`Delete session "${s.name}"?`)) return;
    this.sessionService.delete(s.id).subscribe(() => this.load());
  }
}
