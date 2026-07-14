import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormateurService } from '../../core/services/formateur.service';
import { Formateur, FormateurDto } from '../../core/models/formateur.model';
import { AvatarProviderFactory } from '../../avatar-engine/avatar-provider.factory';

@Component({
  selector: 'app-formateur-manage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="admin-page">

  <div class="page-header">
    <div>
      <h1>AI Trainers</h1>
      <p>Manage avatar trainers and AI providers.</p>
    </div>

    <div class="stats-badge">
      {{ formateurs.length }} Trainers
    </div>
  </div>

  <div class="banner-error" *ngIf="error">
    {{ error }}
  </div>

  <div class="form-card">
    <h3>Add New Trainer</h3>

    <form class="create-form" [formGroup]="form" (ngSubmit)="create()">

      <div class="field">
        <label>Trainer Name</label>
        <input formControlName="name" placeholder="Networking Tutor" />
      </div>

      <div class="field">
        <label>Avatar Provider</label>
        <select formControlName="providerNom">
          <option [value]="1">Anam</option>
          <option [value]="2">Tavus</option>
        </select>
      </div>

      <div class="field">
        <label>Avatar ID</label>
        <input formControlName="avatarId" placeholder="Avatar ID" />
      </div>

      <div class="field">
        <label>Voice Provider</label>
        <input formControlName="voiceProvider" placeholder="Voice Provider ID" />
      </div>

      <div class="field">
        <label>LLM Provider</label>
        <input formControlName="llM_Provider" placeholder="Claude / GPT / Gemini..." />
      </div>

      <div class="field">
        <label>Language</label>
        <input formControlName="lang" placeholder="en" />
      </div>

      <div class="field">
        <label>First Message</label>
        <input formControlName="firstMessage" placeholder="Hi, ready to start?" />
      </div>

      <div class="field field-full">
        <label>System Prompt</label>
        <textarea
          formControlName="systemPrompt"
          rows="4"
          placeholder="You are a helpful AI trainer..."
        ></textarea>
      </div>

      <button
        class="btn-primary"
        type="submit"
        [disabled]="form.invalid || saving"
      >
        {{ saving ? 'Adding...' : 'Add Trainer' }}
      </button>

    </form>
  </div>

  <div *ngIf="formateurs.length; else empty" class="cards-grid">

    <div class="entity-card" *ngFor="let f of formateurs">

      <div class="card-header">
        <h3>{{ f.name }}</h3>

        <span class="count-badge">
          {{ f.providerNom === 1 ? 'Anam' : 'Tavus' }}
        </span>
      </div>

      <p class="description">
        {{ f.firstMessage }}
      </p>

      <div class="meta-list">
        <div><strong>Language:</strong> {{ f.lang }}</div>
        <div><strong>Avatar ID:</strong> {{ f.avatarId }}</div>
        <div><strong>Voice:</strong> {{ f.voiceProvider }}</div>
        <div><strong>LLM:</strong> {{ f.llM_Provider }}</div>
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
      <div class="empty-icon">🤖</div>
      <h3>No Trainers Found</h3>
      <p>Create your first AI trainer using the form above.</p>
    </div>
  </ng-template>

</div>
         `,
  styleUrl: './admin.css',
})
export class FormateurManageComponent implements OnInit {
  formateurs: Formateur[] = [];
  saving = false;
  error = '';
  private fb = inject(FormBuilder);


  // form = this.fb.group({
  //   voiceProvider: ['', Validators.required],
  //   llM_Provider: ['', Validators.required],
  //   lang: ['en', Validators.required],
  //   firstMessage: ['', Validators.required],
  //   systemPrompt: ['', Validators.required],
  // });
  form = this.fb.group({
    avatarId: ['', Validators.required],
    name: ['', Validators.required],
    providerNom: [1, Validators.required], // AvatarProvider.Anam
    voiceProvider: ['', Validators.required],
    llM_Provider: ['', Validators.required],
    lang: ['en', Validators.required],
    firstMessage: ['', Validators.required],
    systemPrompt: ['', Validators.required],
  });

  constructor(
    private formateurService: FormateurService,
    private avatarFactory: AvatarProviderFactory
  ) { }

  ngOnInit(): void {
    // Populated from AVATAR_PROVIDERS — add a provider once, it shows up here automatically.
    // this.availableProviders = this.avatarFactory.listAvailable();
    // this.form.patchValue({ voiceProvider: this.availableProviders[0] ?? '' });
    this.load();
  }

  load(): void {
    this.formateurService.getAll().subscribe((res) => (this.formateurs = res));
  }

  create(): void {
    if (this.form.invalid) return;
    this.saving = true;
    this.error = '';
    const dto = this.form.getRawValue() as FormateurDto;

    this.formateurService.create(dto).subscribe({
      next: () => {
        this.saving = false;
        this.form.reset();
        this.load();
      },
      error: (err) => {
        this.saving = false;
        this.error = err?.error?.message ?? 'Could not create the trainer.';
      },
    });
  }

  remove(f: Formateur): void {
    if (!confirm('Delete this trainer?')) return;
    this.formateurService.delete(f.id).subscribe(() => this.load());
  }
}
