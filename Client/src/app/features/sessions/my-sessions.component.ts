import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserSessionService } from '../../core/services/user-session.service';
import { UserSession } from '../../core/models/user-session.model';
import { AvatarProvider } from '../../core/models/formateur.model';

@Component({
  selector: 'app-my-sessions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>My sessions</h2>
    <p *ngIf="!joined.length" style="color:#8d90a6;">
      You haven't joined any sessions yet — head to "All sessions" to find one.
    </p>
    <ul>
      <li *ngFor="let us of joined" style="margin-bottom: 12px;">
        <strong>{{ us.session?.title ?? ('Session #' + us.sessionId) }}</strong>
        <span *ngIf="us.session"> — {{ us.session.startDate | date: 'medium' }}</span>
        <span [style.color]="us.isCompleted ? '#5fe0cc' : '#a79bff'">
          {{ us.isCompleted ? ' · Completed' : ' · Upcoming' }}
        </span>
        <br />
        <button (click)="launch(us)" [disabled]="us.isCompleted">Launch session</button>
      </li>
    </ul>
  `,
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
