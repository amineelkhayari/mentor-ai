import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthLayoutComponent } from './auth-layout.component';
import { AuthService } from '../../core/auth/auth.service';
import { RegisterDto } from '../../core/models/auth-dtos.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AuthLayoutComponent],
  template: `
    <app-auth-layout
      variant="signup"
      headline="Bring your own trainer online."
      subline="Create an account and join a live AI-led session in minutes."
      quote="Simli today, Anam tomorrow — the session doesn't care which."
    >
      <h1 class="form-heading">Create your account</h1>
      <p class="form-sub">Takes less than a minute.</p>

      <div class="banner-error" *ngIf="serverError">{{ serverError }}</div>
      <div class="banner-error" *ngIf="!serverError" style="background:#1a2233;border-color:#2c3a52;color:#8fb3e0;">
        Note: this backend's register endpoint doesn't accept a password field —
        confirm with your API how the account's password gets set (e.g. an admin
        follow-up, or a change-password step) before wiring this to production.
      </div>

      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="field">
          <label for="displayName">Display name</label>
          <input
            id="displayName"
            type="text"
            formControlName="displayName"
            placeholder="Mohammed Amine"
            [class.invalid]="isInvalid('displayName')"
          />
        </div>

        <div class="field">
          <label for="userName">Username</label>
          <input
            id="userName"
            type="text"
            formControlName="userName"
            placeholder="mohammed.amine"
            [class.invalid]="isInvalid('userName')"
          />
        </div>

        <div class="field">
          <label for="email">Email</label>
          <input
            id="email"
            type="email"
            formControlName="email"
            placeholder="you@school.edu"
            [class.invalid]="isInvalid('email')"
          />
          <p class="field-error" *ngIf="isInvalid('email')">Enter a valid email address.</p>
        </div>

        <button class="submit-btn teal" type="submit" [disabled]="form.invalid || submitting">
          {{ submitting ? 'Creating account…' : 'Create account' }}
        </button>
      </form>

      <p class="form-footer">Already registered? <a routerLink="/login">Sign in</a></p>
    </app-auth-layout>
  `,
  styleUrl: './auth-form.css',
})
export class RegisterComponent {
  submitting = false;
  serverError = '';
  private fb = inject(FormBuilder);


  form = this.fb.group({
    displayName: ['', [Validators.required]],
    userName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
  });

  constructor(private auth: AuthService, private router: Router) { }

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.serverError = '';
    const dto = this.form.getRawValue() as RegisterDto;

    this.auth.register(dto).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => {
        this.submitting = false;
        this.serverError = err?.error?.message ?? 'Could not create your account. Please try again.';
      },
    });
  }
}
