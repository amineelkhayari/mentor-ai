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
    <h2 class="panel-title">formations</h2>
    <p class="panel-sub">Schedule a live AI-tutor formation for a formation.</p>

    <div class="banner-error" *ngIf="error">{{ error }}</div>

    <form class="create-form" [formGroup]="form" (ngSubmit)="create()">
      <div class="field">
        <label for="title">formation title</label>
        <input id="title" formControlName="title" placeholder="e.g. Subnetting workshop" />
      </div>
      <div class="field">
        <label for="description">formation description</label>
        <input id="description" formControlName="description" placeholder="e.g. Learn the basics of subnetting" />
      </div>
      <div class="field">
        <label for="categoryId">Formation</label>
        <select id="categoryId" formControlName="categoryId">
          <option [ngValue]="null" disabled>Select…</option>
          <option *ngFor="let c of categories" [ngValue]="c.id">{{ c.name }}</option>
        </select>
      </div>
     
      <div class="field">
        <label for="durationHours">duration Hours</label>
        <input id="durationHours" type="number" formControlName="durationHours" placeholder="e.g. 2" />
      </div>
      
      <button class="btn" type="submit" [disabled]="form.invalid || saving">
        {{ saving ? 'Scheduling…' : 'Schedule formation' }}
      </button>
    </form>

    <table *ngIf="formations.length; else empty">
      <thead>
        <tr><th>Title</th><th>Formation</th><th>Trainer</th><th>Start</th><th></th></tr>
      </thead>
      <tbody>
        <tr *ngFor="let s of formations">
          <td>{{ s.title }}</td>
          <td>{{ s.description }}</td>
          <td>{{ s.durationHours }}</td>

          <td>{{ categorieLabel(s.categoryId) }}</td>
          <td><button class="btn danger" (click)="remove(s)">Delete</button></td>
         
        </tr>
      </tbody>
    </table>
    <ng-template #empty><p class="empty-state">No formations scheduled yet.</p></ng-template>
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
