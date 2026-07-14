import { Injectable } from '@angular/core';
import { IAvatarProvider, AvatarSessionConfig, AvatarEvents } from '../models/avatar-provider.interface';
import { AnamClient, createClient } from '@anam-ai/js-sdk';

/**
 * Tavus.ai integration. Replace the TODO section with the real Tavus SDK
 * calls (npm install @tavus-ai/js-sdk or their web component).
 * Docs: https://docs.tavus.ai
 */
@Injectable({ providedIn: 'root' })
export class TavusProvider implements IAvatarProvider {
  readonly key = 'tavus';

  private connected = false;
  private events: AvatarEvents = {};
  private tavusClient: AnamClient | null = null;

  async connect(config: AvatarSessionConfig, events: AvatarEvents): Promise<void> {
    this.events = events;
    try {
      // TODO: replace with real Tavus SDK initialization, e.g.:
      //  this.tavusClient = createClient(config.accessToken!); // session token from YOUR backend
      // await this.tavusClient.streamToVideoElement('persona-video'); // or config.containerEl

      const iframe = document.createElement('iframe');
      
      iframe.src = config.avatarSessionResponse?.joinUrl!;
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = '0';
      iframe.allow =
  'camera; microphone; autoplay; fullscreen; speaker-selection';

      config.containerEl.innerHTML = '';
      config.containerEl.appendChild(iframe);
      //await this.tavusClient.muteInputAudio();
      // this.tavusClient.on('MESSAGE_HISTORY_UPDATED', (msgs: any[]) => {  });
      // this.tavusClient.on('SESSION_ENDED', () => this.events.onDisconnected?.());

      this.connected = true;
      this.events.onConnected?.();
    } catch (err) {
      this.events.onError?.(err);
      throw err;
    }
  }

  async disconnect(): Promise<void> {
    // await this.tavusClient?.stopSession();
    this.connected = false;
    this.events.onDisconnected?.();
  }

  sendText(text: string): void {
    this.tavusClient?.sendUserMessage(text);
  }

  isConnected(): boolean {
    return this.connected;
  }
}
