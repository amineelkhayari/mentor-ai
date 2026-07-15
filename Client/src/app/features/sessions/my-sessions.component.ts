import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserSessionService } from '../../core/services/user-session.service';
import { UserSession } from '../../core/models/user-session.model';

@Component({
  selector: 'app-my-sessions',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="sessions-page">
  <div class="page-header">
    <div>
      <h1>My Sessions</h1>
      <p>Access the training sessions you have already joined.</p>
    </div>

    <div class="stats-badge">
      {{ joined.length }} Session{{ joined.length !== 1 ? 's' : '' }}
    </div>
  </div>

  <div *ngIf="joined.length; else emptyState" class="sessions-grid">

    <div class="session-card" *ngFor="let us of joined">

      <div class="card-header">
        <h3>
          {{ "# "+us.sessionId+" "+us.sessionName }}
        </h3>

        <span
          class="status-badge"
          [class.joined]="!us.isCompleted"
        >
          {{ us.isCompleted ? 'Completed' : 'Upcoming' }}
        </span>
      </div>

      <div class="session-info">

        <div class="info-item" *ngIf="us.session">
          📅 {{ us.session.startDate | date:'medium' }}
        </div>

        <div class="info-item">
          {{
            us.isCompleted
              ? '✅ Session completed'
              : '⏳ Waiting for session start'
          }}
        </div>

      </div>

      <div class="card-footer">
        <button
          class="join-btn"
          (click)="launch(us)"
          [disabled]="us.isCompleted"
        >
          {{ us.isCompleted ? 'Session Completed' : 'Launch Session' }}
        </button>
      </div>

    </div>

  </div>

  <ng-template #emptyState>
    <div class="empty-state">
      <div class="empty-icon">📚</div>
      <h3>No joined sessions</h3>
      <p>
        You haven't joined any sessions yet — head to
        <strong>All Sessions</strong> to find one.
      </p>
    </div>
  </ng-template>
</div>
  `,
    styleUrl: './session.css',

})
export class MySessionsComponent implements OnInit {
  joined: UserSession[] = [];

  constructor(private userSessionService: UserSessionService, private router: Router) { }

  ngOnInit(): void {
  
    // See UserSessionService.getMine() for the assumption this relies on
    // (backend scoping the list to the current user for non-admin roles).
    this.userSessionService.getMine().subscribe((res) => (this.joined = res));
  }

  launch(us: UserSession): void {
    this.router.navigate(['/sessions', us.sessionId, 'call']);
  }
}
