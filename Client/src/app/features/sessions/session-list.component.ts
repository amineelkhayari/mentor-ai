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

<div class="categories-bar" *ngIf="filteredSessions.length">

  <button
    
    class="category-chip"
    
           [class.active]="selectFilter === 'All'"
       (click)="filterBySession('All')"

  >
    All
  </button>
   <button
    class="category-chip"
    [class.active]="selectFilter === 'Upcoming'"
    (click)="filterBySession('Upcoming')"
  >
    Upcoming
  </button>
  <button
    
    class="category-chip"
        [class.active]="selectFilter === 'Passed'"

       (click)="filterBySession('Passed')"

  >
    Passed
  </button>

  <button
    class="category-chip"
    [class.active]="selectFilter === 'Available'"
       (click)="filterBySession('Available')"

  >
    Available
  </button>
 <button
    class="category-chip"
    [class.active]="selectFilter === 'Joined'"
       (click)="filterBySession('Joined')"

  >
    Joined
  </button>
</div>
    <div class="stats-badge">
      {{ filteredSessions.length }} Session{{ filteredSessions.length !== 1 ? 's' : '' }}
    </div>
  </div>

  <div *ngIf="filteredSessions.length; else emptyState" class="sessions-grid">
    <div class="session-card" *ngFor="let s of filteredSessions">

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
  filteredSessions: Session[] = [];

  selectFilter: 'All' | 'Passed' | 'Upcoming' | 'Joined' | 'Available' = 'All';

  constructor(
    private sessionService: SessionService,
    private userSessionService: UserSessionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.sessionService.getAll().subscribe((res) => { this.sessions = res; this.filteredSessions = res });
  }

  join(session: Session): void {
    this.userSessionService.register(session.id).subscribe({
      next: () => this.router.navigate(['/sessions', session.id, 'call']),
      error: () => this.router.navigate(['/sessions', session.id, 'call']), // e.g. already registered
    });
  }


  filterBySession(statusSession: 'All' | 'Passed' | 'Upcoming' | 'Joined' | 'Available'): void {
    const today = new Date();
    this.selectFilter = statusSession;
    console.log(this.selectFilter);

    this.filteredSessions = this.sessions.filter(f => {
      switch (this.selectFilter) {
        case 'Passed':
          return new Date(f.endDate) < today;

        case 'Upcoming':
          return new Date(f.endDate) >= today;
        case 'Joined':
          return f.sessionJoined == 'Joined';
        case 'Available':
          return f.sessionJoined == 'Join';
        default: // All
          return true;
      }
    });
  }
}
