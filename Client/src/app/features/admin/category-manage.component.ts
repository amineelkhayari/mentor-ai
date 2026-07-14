import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategorieService, CreateCategorieDto } from '../../core/services/categorie.service';
import { Categorie } from '../../core/models/categorie.model';

@Component({
  selector: 'app-category-manage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `

<div class="admin-page">

  <div class="page-header">
    <div>
      <h1>Categories</h1>
      <p>Group formations by subject area.</p>
    </div>

    <div class="stats-badge">
      {{ categories.length }} Categories
    </div>
  </div>

  <div class="banner-error" *ngIf="error">
    {{ error }}
  </div>

  <div class="form-card">
    <h3>Add New Category</h3>

    <form [formGroup]="form" (ngSubmit)="create()" class="create-form">

      <div class="field">
        <label>Name</label>
        <input
          formControlName="name"
          placeholder="e.g. Networking"
        />
      </div>

      <div class="field">
        <label>Description</label>
        <input
          formControlName="description"
          placeholder="Optional description"
        />
      </div>

      <button
        class="btn-primary"
        type="submit"
        [disabled]="form.invalid || saving"
      >
        {{ saving ? 'Adding...' : 'Add Category' }}
      </button>

    </form>
  </div>

  <div *ngIf="categories.length; else empty" class="cards-grid">

    <div class="entity-card" *ngFor="let c of categories">

      <div class="card-header">
        <h3>{{ c.name }}</h3>

        <span class="count-badge">
          {{ c.formations?.length ?? 0 }}
        </span>
      </div>

      <p class="description">
        {{ c.description || 'No description available.' }}
      </p>

      <div class="card-footer">
        <button
          class="btn-danger"
          (click)="remove(c)"
        >
          Delete
        </button>
      </div>

    </div>

  </div>

  <ng-template #empty>
    <div class="empty-state">
      <div class="empty-icon">📂</div>
      <h3>No Categories Found</h3>
      <p>Create your first category using the form above.</p>
    </div>
  </ng-template>

</div>
`,
  styleUrl: './admin.css',
})
export class CategoryManageComponent implements OnInit {
  categories: Categorie[] = [];
  saving = false;
  error = '';
    private fb = inject(FormBuilder);


  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
  });

  constructor( private categorieService: CategorieService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.categorieService.getAll().subscribe((res) => (this.categories = res));
  }

  create(): void {
    if (this.form.invalid) return;
    this.saving = true;
    this.error = '';
    const payload = this.form.getRawValue() as CreateCategorieDto;
    
    this.categorieService.create(payload).subscribe({
      next: () => {
        this.saving = false;
        this.form.reset();
        this.load();
      },
      error: (err) => {
        this.saving = false;
        this.error = err?.error?.message ?? 'Could not create the category.';
      },
    });
  }

  remove(c: Categorie): void {
    if (!confirm(`Delete category "${c.name}"?`)) return;
    this.categorieService.delete(c.id).subscribe(() => this.load());
  }
}
