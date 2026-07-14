import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { SessionService } from '../../core/services/session.service';
import { AvatarProviderFactory } from '../../avatar-engine/avatar-provider.factory';
import { IAvatarProvider } from '../../avatar-engine/models/avatar-provider.interface';
import { Session } from '../../core/models/session.model';
import { FormsModule } from '@angular/forms';
import { AvatarProvider } from '../../core/models/formateur.model';

@Component({
  selector: 'app-live-call',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2 *ngIf="session">{{ session.title }}</h2>

    <p *ngIf="status === 'loading'">Loading session…</p>
    <p *ngIf="status === 'connecting'">Connecting to {{ session?.formateur?.voiceProvider }}…</p>
    <p *ngIf="status === 'error'" style="color:#f66;">
      Could not start the call. {{ errorMessage }}
    </p>
    <!-- <video id="persona-video" autoplay playsinline class="call-box"></video> -->
<div #callContainer autoplay playsinline  class="call-box"></div>
<ng-container *ngIf="status === 'connected'">
      <input [(ngModel)]="textInput" (keyup.enter)="sendText()" placeholder="Type a message..." />
    </ng-container>
    <button *ngIf="status === 'connected'" (click)="endCall()">End call</button>
  `,
})
export class LiveCallComponent implements OnInit, OnDestroy {
  @ViewChild('callContainer', { static: true }) containerRef!: ElementRef<HTMLElement>;

  session: Session | null = null;
  status: 'loading' | 'connecting' | 'connected' | 'error' = 'loading';
  errorMessage = '';
  textInput = '';


  private provider: IAvatarProvider | null = null;

  constructor(
    private route: ActivatedRoute,
    private sessionService: SessionService,
    private avatarFactory: AvatarProviderFactory
  ) { }

  ngOnInit(): void {
    const sessionId = Number(this.route.snapshot.paramMap.get('id'));

    this.sessionService.getWithFormateur(sessionId).subscribe({
      next: async (session) => {
        this.session = session;
        await this.startCall(session);
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
    console.log("main", session.avatarSessionResponse);

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

  async endCall(): Promise<void> {
    await this.provider?.disconnect();
  }

  ngOnDestroy(): void {
    this.provider?.disconnect();
  }
}
