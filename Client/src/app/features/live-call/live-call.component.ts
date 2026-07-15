import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { SessionService } from '../../core/services/session.service';
import { AvatarProviderFactory } from '../../avatar-engine/avatar-provider.factory';
import { IAvatarProvider } from '../../avatar-engine/models/avatar-provider.interface';
import { Session } from '../../core/models/session.model';
import { FormsModule } from '@angular/forms';
import { AvatarProvider } from '../../core/models/formateur.model';
import { UserSessionService } from '../../core/services/user-session.service';

@Component({
  selector: 'app-live-call',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
   <div class="live-page">

  <div class="session-header" *ngIf="session">

    <div>
      <h1>{{ session.name || 'Live Training Session' }}</h1>

      <p class="formation-name">
        📚 {{ session.formation?.title }}
      </p>
    </div>

    <div class="status-pill" [class.connected]="status === 'connected'">
      {{ status | uppercase }}
    </div>

  </div>

  <div class="content-grid">

    <!-- LEFT SIDE -->
    <div class="video-section">

      <div *ngIf="status === 'loading'" class="state-card">
        Loading session...
      </div>
      <button
        *ngIf="(status === 'sesionloaded' || 'loaded')"
        class="start-call-btn"
        [disabled]='session?.userSessions?.[0]?.isCompleted'
        (click)="startSession()"
      >
        Start Session
      </button>

      <div *ngIf="status === 'connecting'" class="state-card">
        Connecting to {{ session?.formateur?.name }}...
      </div>

      <div *ngIf="status === 'error'" class="state-card error">
        {{ errorMessage }}
      </div>

      <div
        #callContainer
        class="call-box"
      ></div>

      <div
        class="chat-box"
        *ngIf="status === 'connected'"
      >
        <input
          [(ngModel)]="textInput"
          (keyup.enter)="sendText()"
          placeholder="Ask your trainer a question..."
        />

        <button (click)="sendText()">
          Send
        </button>
      </div>

      <button
        *ngIf="status === 'connected'"
        class="end-call-btn"
        (click)="endCall()"
      >
        End Session
      </button>

    </div>

    <!-- RIGHT SIDE -->
    <div class="info-panel" *ngIf="session">
      
<div class="info-card" *ngIf="session?.userSessions?.length">

  <h3>Your Progress</h3>

  <div class="info-row">
    <span>Registration Date</span>
    <strong>
      {{ session.userSessions[0].registrationDate | date:'medium' }}
    </strong>
  </div>

  <div class="info-row">
    <span>Status</span>

    <strong
      [style.color]="session.userSessions[0].isCompleted ? '#10b981' : '#f59e0b'"
    >
      {{ session.userSessions[0].isCompleted ? 'Completed' : 'In Progress' }}
    </strong>
  </div>

  <button
    class="complete-btn"
    *ngIf="!session.userSessions[0].isCompleted"
    (click)="markCompleted()"
  >
    Mark as Completed
  </button>

</div>

      <div class="info-card">
        <h3>Formation</h3>

        <div class="info-row">
          <span>Title</span>
          <strong>{{ session.formation?.title }}</strong>
        </div>

        <div class="info-row">
          <span>Duration</span>
          <strong>{{ session.formation?.durationHours }} hours</strong>
        </div>

        <div class="info-row">
          <span>Description</span>
          <strong>{{ session.formation?.description }}</strong>
        </div>
      </div>

      <div class="info-card">
        <h3>Trainer</h3>

        <div class="trainer-profile">

          <div class="trainer-avatar">
            {{ session.formateur?.name?.charAt(0) }}
          </div>

          <div>
            <h4>{{ session.formateur?.name }}</h4>
            <p>{{ session.formateur?.lang }}</p>
          </div>

        </div>

        <div class="info-row">
          <span>Provider</span>
          <strong>{{ session.avatarSessionResponse?.providerName }}</strong>
        </div>

        <div class="info-row">
          <span>Language</span>
          <strong>{{ session.formateur?.lang }}</strong>
        </div>

        <div class="info-row">
          <span>Welcome Message</span>
          <strong>{{ session.formateur?.firstMessage }}</strong>
        </div>

      </div>

      <div class="info-card">
        <h3>Schedule</h3>

        <div class="info-row">
          <span>Start</span>
          <strong>{{ session.startDate | date:'medium' }}</strong>
        </div>

        <div class="info-row">
          <span>End</span>
          <strong>{{ session.endDate | date:'medium' }}</strong>
        </div>

        <div class="info-row">
          <span>Participants</span>
          <strong>0</strong>
        </div>
      </div>

    </div>

  </div>

</div>
   `,
  styleUrl: './call.css',

})
export class LiveCallComponent implements OnInit, OnDestroy {
  @ViewChild('callContainer', { static: true }) containerRef!: ElementRef<HTMLElement>;

  session: Session | null = null;
  status: 'loading' | 'connecting' | 'connected' | 'error' | 'sesionloaded' = 'loading';
  errorMessage = '';
  textInput = '';

  sessionId: number | null = null;


  private provider: IAvatarProvider | null = null;

  constructor(
    private route: ActivatedRoute,
    private sessionService: SessionService,
    private userSessionService: UserSessionService,

    private avatarFactory: AvatarProviderFactory
  ) { }

  ngOnInit(): void {
    this.sessionId = Number(this.route.snapshot.paramMap.get('id'));

    this.sessionService.getWithFormateur(this.sessionId).subscribe({
      next: async (session) => {
        this.session = session;
        this.status = (this.session.avatarSessionResponse?.clientToken || this.session.avatarSessionResponse?.joinUrl) ? 'sesionloaded' : 'error'
        //await this.startCall(session);
      },
      error: (err) => {
        this.status = 'error';
        this.errorMessage = 'Session not found.';
        console.error(err);
      },
    });
  }
  sendText() {
    if (!this.textInput.trim()) return;
    this.provider?.sendText(this.textInput);
    this.textInput = '';
  }
  private async startCall(session: Session): Promise<void> {
    if (!session.formateur) {
      this.status = 'error';
      this.errorMessage = 'This session has no trainer configured.';
      return;
    }

    this.status = 'connecting';

    // The ONLY line that varies by vendor — driven entirely by backend data.
    // Adding a 3rd provider never requires touching this component.
    try {

      this.provider = this.avatarFactory.get(AvatarProvider[session.formateur.providerNom]);
    } catch (err) {
      this.status = 'error';
      this.errorMessage = (err as Error).message;
      return;
    }

    await this.provider.connect(
      {
        formateur: session.formateur,
        containerEl: this.containerRef.nativeElement,
        userId: 'current-user-id', // TODO: pull from AuthService/current user claims
        sessionId: session.id,
        //accessToken: session.avatarSessionResponse?.joinUrl!,
        avatarSessionResponse: session.avatarSessionResponse
        // accessToken: fetched from your backend endpoint that mints a
        // short-lived Simli/Anam session token — keep vendor API keys server-side.
      },
      {
        onConnected: () => (this.status = 'connected'),
        onDisconnected: () => (this.status = 'loading'),
        onError: (err) => {
          this.status = 'error';
          this.errorMessage = 'The video call connection failed.';
          console.error(err);
        },
      }
    );
  }
  async startSession(): Promise<void> {
    await this.startCall(this.session!);
  }
  async endCall(): Promise<void> {

    if (
      this.session?.userSessions?.length &&
      !this.session.userSessions[0].isCompleted
    ) {
      this.markCompleted();
    }

    await this.provider?.disconnect();
  }

  ngOnDestroy(): void {
    this.provider?.disconnect();
  }
  markCompleted(): void {

    if (!this.session) return;
    if (this.sessionId == null) return;

    this.userSessionService
      .markCompleted(this.sessionId, { isCompleted: true, sessionId: this.sessionId })
      .subscribe({
        next: () => {
          // if (this.session?.userSessions?.length) {
          //   this.session.userSessions[0].isCompleted = true;
          // }
        },
        error: (err) => {
          console.error(err);
        }
      });
  }
}
