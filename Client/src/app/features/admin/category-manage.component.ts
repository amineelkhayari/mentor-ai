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
    <h2 class="panel-title">Categories</h2>
    <p class="panel-sub">Group formations by subject area.</p>

    <div class="banner-error" *ngIf="error">{{ error }}</div>

    <form class="create-form" [formGroup]="form" (ngSubmit)="create()">
      <div class="field">
        <label for="name">Name</label>
        <input id="name" formControlName="name" placeholder="e.g. Networking" />
      </div>
      <div class="field">
        <label for="description">Description</label>
        <input id="description" formControlName="description" placeholder="Optional" />
      </div>
      <button class="btn" type="submit" [disabled]="form.invalid || saving">
        {{ saving ? 'Adding…' : 'Add category' }}
      </button>
    </form>

    <table *ngIf="categories.length; else empty">
      <thead>
        <tr><th>Name</th><th>Description</th><th>Formations</th><th></th></tr>
      </thead>
      <tbody>
        <tr *ngFor="let c of categories">
          <td>{{ c.name }}</td>
          <td>{{ c.description || '—' }}</td>
          <td>{{ c.formations?.length ?? 0 }}</td>
          <td><button class="btn danger" (click)="remove(c)">Delete</button></td>
        </tr>
      </tbody>
    </table>
    <ng-template #empty><p class="empty-state">No categories yet — add the first one above.</p></ng-template>
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
