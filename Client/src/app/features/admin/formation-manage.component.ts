import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormationService } from '../../core/services/formation.service';
import { Formation } from '../../core/models/formation.model';
import { CategorieService } from '../../core/services/categorie.service';
import { Categorie } from '../../core/models/categorie.model';

@Component({
  selector: 'app-formation-manage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
   <div class="admin-page">

  <div class="page-header">
    <div>
      <h1>Formations</h1>
      <p>Manage training programs available on the platform.</p>
    </div>

    <div class="stats-badge">
      {{ formations.length }} Formations
    </div>
  </div>

  <div class="banner-error" *ngIf="error">
    {{ error }}
  </div>

  <div class="form-card">

    <h3>Add New Formation</h3>

    <form class="create-form" [formGroup]="form" (ngSubmit)="create()">

      <div class="field">
        <label>Title</label>
        <input
          formControlName="title"
          placeholder="e.g. Subnetting Workshop"
        />
      </div>

      <div class="field">
        <label>Category</label>
        <select formControlName="categoryId">
          <option [ngValue]="null" disabled>Select category</option>
          <option *ngFor="let c of categories" [ngValue]="c.id">
            {{ c.name }}
          </option>
        </select>
      </div>

      <div class="field field-full">
        <label>Description</label>
        <textarea
          formControlName="description"
          rows="3"
          placeholder="Formation description..."
        ></textarea>
      </div>

      <div class="field">
        <label>Duration (Hours)</label>
        <input
          type="number"
          formControlName="durationHours"
          placeholder="2"
        />
      </div>

      <button
        class="btn-primary"
        type="submit"
        [disabled]="form.invalid || saving"
      >
        {{ saving ? 'Adding...' : 'Add Formation' }}
      </button>

    </form>

  </div>

  <div *ngIf="formations.length; else empty" class="cards-grid">

    <div class="entity-card" *ngFor="let f of formations">

      <div class="card-header">

        <h3>{{ f.title }}</h3>

        <span class="count-badge">
          {{ f.durationHours }}h
        </span>

      </div>

      <p class="description">
        {{ f.description }}
      </p>

      <div class="meta-list">
        <div>
          <strong>Category:</strong>
          {{ categorieLabel(f.categoryId) }}
        </div>

        <div>
          <strong>Duration:</strong>
          {{ f.durationHours }} Hours
        </div>
      </div>

      <div class="card-footer">
        <button
          class="btn-danger"
          (click)="remove(f)"
        >
          Delete
        </button>
      </div>

    </div>

  </div>

  <ng-template #empty>

    <div class="empty-state">
      <div class="empty-icon">📚</div>
      <h3>No Formations Found</h3>
      <p>Create your first formation using the form above.</p>
    </div>

  </ng-template>

</div>
   `,
  styleUrl: './admin.css',
})
export class formationManageComponent implements OnInit {
  formations: Formation[] = [];
  categories: Categorie[] = [];

  saving = false;
  error = '';
  private readonly fb = inject(FormBuilder);


  form = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    categoryId: [null as number | null, Validators.required],
    durationHours: [null as number | null, Validators.required],

  });

  constructor(
    private formationService: FormationService,
    private categorieService: CategorieService,
  ) { }

  ngOnInit(): void {
    this.load();
    this.formationService.getAll().subscribe((res) => (this.formations = res));
    this.categorieService.getAll().subscribe((res) => (this.categories = res));
  }

  load(): void {
    this.formationService.getAll().subscribe((res) => (this.formations = res));
  }

  formationTitle(id: number): string {
    return this.formations.find((f) => f.id === id)?.title ?? `#${id}`;
  }

  categorieLabel(id: number): string {
    const c = this.categories.find((x) => x.id === id);
    return c ? c.name : `#${id}`;
  }

  create(): void {
    if (this.form.invalid) return;
    this.saving = true;
    this.error = '';
    this.formationService.create(this.form.getRawValue() as any).subscribe({
      next: () => {
        this.saving = false;
        this.form.reset();
        this.load();
      },
      error: (err) => {
        this.saving = false;
        this.error = err?.error?.message ?? 'Could not schedule the formation.';
      },
    });
  }

  remove(s: Formation): void {
    if (!confirm(`Delete formation "${s.title}"?`)) return;
    this.formationService.delete(s.id).subscribe(() => this.load());
  }
}
