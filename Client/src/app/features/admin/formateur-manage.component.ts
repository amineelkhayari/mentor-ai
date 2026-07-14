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
    <h2 class="panel-title">AI trainers</h2>
    <p class="panel-sub">
      Each trainer pairs a system prompt with an avatar engine. New engines only need to be
      registered once in <code>app.config.ts</code> — they'll show up in the dropdown below.
    </p>

    <div class="banner-error" *ngIf="error">{{ error }}</div>

    <form class="create-form" [formGroup]="form" (ngSubmit)="create()">
      <div class="field">
        <label for="voiceProvider">Avatar engine</label>
          <input formControlName="voiceProvider" placeholder="Avatar ID from provider" />

        <!-- <select id="voiceProvider" formControlName="voiceProvider">
          <option *ngFor="let key of availableProviders" [value]="key">{{ key }}</option>
        </select> -->
      </div>
      <div class="field">
  <label>Trainer name</label>
  <input formControlName="name" placeholder="Networking Tutor" />
</div>

<div class="field">
  <label>Avatar ID</label>
  <input formControlName="avatarId" placeholder="Avatar ID from provider" />
</div>

<div class="field">
  <label>Avatar Provider</label>
  <select formControlName="providerNom">
    <option [value]="1">Anam</option>
    <option [value]="2">Tavus</option>
  </select>
</div>
      <div class="field">
        <label for="llM_Provider">LLM provider</label>
        <input id="llM_Provider" formControlName="llM_Provider" placeholder="e.g. claude-sonnet-5" />
      </div>
      <div class="field">
        <label for="lang">Language</label>
        <input id="lang" formControlName="lang" placeholder="en" style="min-width: 70px;" />
      </div>
      <div class="field">
        <label for="firstMessage">First message</label>
        <input id="firstMessage" formControlName="firstMessage" placeholder="Hi, ready to start?" />
      </div>
      <div class="field" style="flex-basis: 100%;">
        <label for="systemPrompt">System prompt</label>
        <textarea id="systemPrompt" formControlName="systemPrompt" rows="2" placeholder="You are a patient networking tutor…"></textarea>
      </div>
      <button class="btn" type="submit" [disabled]="form.invalid || saving">
        {{ saving ? 'Adding…' : 'Add trainer' }}
      </button>
    </form>

    <table *ngIf="formateurs.length; else empty">
      <thead>
 <th>Name</th>
    <th>Provider</th>
    <th>Avatar ID</th>
    <th>Voice Provider</th>
    <th>LLM Provider</th>
    <th>Language</th>
    <th>First Message</th>
    <th>Sessions</th>
    <th>Actions</th>      </thead>
      <tbody>
        <tr *ngFor="let f of formateurs">
          <td>{{ f.name }}</td>
<td>{{ f.providerNom === 1 ? 'Anam' : 'Tavus' }}</td>
<td>{{ f.avatarId }}</td>
<td>{{ f.voiceProvider }}</td>
<td>{{ f.llM_Provider }}</td>
<td>{{ f.lang }}</td>
<td>{{ f.firstMessage }}</td>
          <td><button class="btn danger" (click)="remove(f)">Delete</button></td>
        </tr>
      </tbody>
    </table>
    <ng-template #empty><p class="empty-state">No trainers yet — add the first one above.</p></ng-template>
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
