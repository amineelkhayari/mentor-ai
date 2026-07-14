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
    <h2>All sessions</h2>
    <ul>
      <li *ngFor="let s of sessions" style="margin-bottom: 12px;">
        <strong>{{ s.title }}</strong>
        — {{ s.startDate | date: 'medium' }}
        <span *ngIf="s.formateur"> · Trainer engine: {{ s.formateur.voiceProvider }}</span>
        <br />
        <button (click)="join(s)" [disabled]="s.sessionJoined == 'Joined'">Join & launch video call</button>
      </li>
    </ul>
    <p *ngIf="!sessions.length" style="color:#8d90a6;">No sessions scheduled yet.</p>
  `,
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
