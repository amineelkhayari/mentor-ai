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
    <h2 class="panel-title">Sessions</h2>
    <p class="panel-sub">Schedule a live AI-tutor session for a formation.</p>

    <div class="banner-error" *ngIf="error">{{ error }}</div>

    <form class="create-form" [formGroup]="form" (ngSubmit)="create()">
      <div class="field">
        <label for="title">Session title</label>
        <input id="title" formControlName="title" placeholder="e.g. Subnetting workshop" />
      </div>
      <div class="field">
        <label for="formationId">Formation</label>
        <select id="formationId" formControlName="formationId">
          <option [ngValue]="null" disabled>Select…</option>
          <option *ngFor="let f of formations" [ngValue]="f.id">{{ f.title }}</option>
        </select>
      </div>
      <div class="field">
        <label for="formateurId">Trainer</label>
        <select id="formateurId" formControlName="formateurId">
          <option [ngValue]="null" disabled>Select…</option>
          <option *ngFor="let t of formateurs" [ngValue]="t.id">{{ t.voiceProvider }} · {{ t.lang }}</option>
        </select>
      </div>
      <div class="field">
        <label for="startDate">Start</label>
        <input id="startDate" type="datetime-local" formControlName="startDate" />
      </div>
      <div class="field">
        <label for="endDate">End</label>
        <input id="endDate" type="datetime-local" formControlName="endDate" />
      </div>
      <button class="btn" type="submit" [disabled]="form.invalid || saving">
        {{ saving ? 'Scheduling…' : 'Schedule session' }}
      </button>
    </form>

    <table *ngIf="sessions.length; else empty">
      <thead>
        <tr><th>Title</th><th>Formation</th><th>Trainer</th><th>Start</th><th></th></tr>
      </thead>
      <tbody>
        <tr *ngFor="let s of sessions">
          <td>{{ s.title }}</td>
          <td>{{ s.formation?.title ?? formationTitle(s.formationId) }}</td>
          <td>{{ s.formateur?.voiceProvider ?? formateurLabel(s.formateurId) }}</td>
          <td>{{ s.startDate | date: 'medium' }}</td>
          <td><button class="btn danger" (click)="remove(s)">Delete</button></td>
        </tr>
      </tbody>
    </table>
    <ng-template #empty><p class="empty-state">No sessions scheduled yet.</p></ng-template>
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
    title: ['', Validators.required],
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
    if (!confirm(`Delete session "${s.title}"?`)) return;
    this.sessionService.delete(s.id).subscribe(() => this.load());
  }
}
