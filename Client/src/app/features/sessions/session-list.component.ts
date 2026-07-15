import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SessionService } from '../../core/services/session.service';
import { UserSessionService } from '../../core/services/user-session.service';
import { Session } from '../../core/models/session.model';

@Component({
  selector: 'app-session-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sessions-page">
  <div class="page-header">
    <div>
      <h1>Training Sessions</h1>
      <p>Join live sessions and interact with your AI trainer.</p>
    </div>

    <div class="stats-badge">
      {{ sessions.length }} Session{{ sessions.length !== 1 ? 's' : '' }}
    </div>
  </div>

  <div *ngIf="sessions.length; else emptyState" class="sessions-grid">
    <div class="session-card" *ngFor="let s of sessions">

      <div class="card-header">
        <h3>{{ s.name }}</h3>

        <span
          class="status-badge"
          [class.joined]="s.sessionJoined === 'Joined'"
        >
          {{ s.sessionJoined === 'Joined' ? 'Joined' : 'Available' }}
        </span>
      </div>

      <div class="session-info">
        <div class="info-item">
          📅 {{ s.startDate | date:'medium' }}
        </div>

        <div class="info-item" *ngIf="s.formateur">
          🎙️ {{ s.formateur.voiceProvider }}
        </div>
      </div>

      <div class="card-footer">
        <button
          class="join-btn"
          [disabled]="s.sessionJoined === 'Joined'"
          (click)="join(s)"
        >
          <span *ngIf="s.sessionJoined !== 'Joined'">
            Join Video Session
          </span>

          <span *ngIf="s.sessionJoined === 'Joined'">
            Already Joined
          </span>
        </button>
      </div>

    </div>
  </div>

  <ng-template #emptyState>
    <div class="empty-state">
      <div class="empty-icon">🎥</div>
      <h3>No sessions available</h3>
      <p>Upcoming training sessions will appear here.</p>
    </div>
  </ng-template>
</div>
  `,
    styleUrl: './session.css',

})
export class SessionListComponent implements OnInit {
  sessions: Session[] = [];

  constructor(
    private sessionService: SessionService,
    private userSessionService: UserSessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sessionService.getAll().subscribe((res) => (this.sessions = res));
  }

  join(session: Session): void {
    this.userSessionService.register(session.id).subscribe({
      next: () => this.router.navigate(['/sessions', session.id, 'call']),
      error: () => this.router.navigate(['/sessions', session.id, 'call']), // e.g. already registered
    });
  }
}
