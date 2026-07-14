import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthLayoutComponent } from './auth-layout.component';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AuthLayoutComponent],
  template: `
    <app-auth-layout
      variant="login"
      headline="Your tutor is warmed up."
      subline="Sign in to rejoin your next live session."
      quote="Every session, a different voice, the same trainer prompt."
    >
      <h1 class="form-heading">Sign in</h1>
      <p class="form-sub">Pick up where your last session left off.</p>

      <div class="banner-error" *ngIf="serverError">{{ serverError }}</div>

      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="field">
          <label for="userName">Username</label>
          <input
            id="userName"
            type="text"
            formControlName="userName"
            placeholder="your username"
            [class.invalid]="isInvalid('userName')"
          />
          <p class="field-error" *ngIf="isInvalid('userName')">Username is required.</p>
        </div>

        <div class="field">
          <label for="password">Password</label>
          <input
            id="password"
            type="password"
            value="Pa$$w0rd"
            formControlName="password"
            placeholder="••••••••"
            [class.invalid]="isInvalid('password')"
          />
          <p class="field-error" *ngIf="isInvalid('password')">Password is required.</p>
        </div>

        <button class="submit-btn" type="submit" [disabled]="form.invalid || submitting">
          {{ submitting ? 'Signing in…' : 'Sign in' }}
        </button>
      </form>

      <p class="form-footer">New here? <a routerLink="/register">Create an account</a></p>
    </app-auth-layout>
  `,
  styleUrl: './auth-form.css',
})
export class LoginComponent {
  submitting = false;
  serverError = '';
  private fb = inject(FormBuilder);

  form = this.fb.group({
    userName: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  constructor(private auth: AuthService, private router: Router) {}

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
    const { userName, password } = this.form.getRawValue();

    this.auth.login(userName!, password!).subscribe({
      next: () => this.router.navigate(['/sessions']),
      error: (err) => {
        this.submitting = false;
        this.serverError = err?.error?.message ?? 'Incorrect username or password. Please try again.';
      },
    });
    console.log('Login form submitted:', this.auth.getRole());
  }
}
