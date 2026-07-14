import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

/**
 * Design tokens for the auth experience (see auth.css for the full system):
 * - ink:      #14151A   dark panel background
 * - mist:     #F1F2F6   form panel background (cool neutral, not cream)
 * - violet:   #6E5BFF   primary signal / "AI is live" accent
 * - teal:     #26C6B0   secondary accent (used on the sign-up variant)
 * - display font: Space Grotesk / body: Inter / labels: IBM Plex Mono
 *
 * Signature element: an animated waveform, because the product's core
 * moment is "an AI tutor about to speak to you" — the auth screen sets
 * that expectation before you ever reach a session.
 */
@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="auth-shell">
      <aside class="auth-side" [class.side-teal]="variant === 'signup'">
        <div class="side-top">
          <span class="mark">◎ Study<span class="mark-accent">Session</span></span>
        </div>

        <div class="side-mid">
          <div class="waveform" aria-hidden="true">
            <span *ngFor="let bar of bars" [style.animation-delay.ms]="bar"></span>
          </div>
          <p class="eyebrow">LIVE // AWAITING SESSION</p>
          <h1>{{ headline }}</h1>
          <p class="sub">{{ subline }}</p>
        </div>

        <div class="side-bottom">
          <p class="quote">"{{ quote }}"</p>
        </div>
      </aside>

      <section class="auth-form-panel">
        <div class="auth-form-wrap">
          <ng-content></ng-content>
        </div>
      </section>
    </div>
  `,
  styleUrl: './auth-layout.component.css',
})
export class AuthLayoutComponent {
  @Input() variant: 'login' | 'signup' = 'login';
  @Input() headline = 'Your tutor is warmed up.';
  @Input() subline = 'Sign in to rejoin your next live session.';
  @Input() quote = 'Every session, a different voice, the same trainer prompt.';

  bars = [0, 120, 60, 200, 40, 160, 80, 220, 20, 140];
}
