import { Injectable } from '@angular/core';
import { IAvatarProvider, AvatarSessionConfig, AvatarEvents } from '../models/avatar-provider.interface';
import { AnamClient, createClient } from '@anam-ai/js-sdk';

/**
 * Anam.ai integration. Replace the TODO section with the real Anam SDK
 * calls (npm install @anam-ai/js-sdk or their web component).
 * Docs: https://docs.anam.ai
 */
@Injectable({ providedIn: 'root' })
export class AnamProvider implements IAvatarProvider {
  readonly key = 'anam';

  private connected = false;
  private events: AvatarEvents = {};
  private anamClient: AnamClient | null = null;

  async connect(config: AvatarSessionConfig, events: AvatarEvents): Promise<void> {
    this.events = events;
    try {
      // TODO: replace with real Anam SDK initialization, e.g.:


      const video = document.createElement('video');
      video.id = 'anam-video';
      video.autoplay = true;
      video.playsInline = true;
      video.style.width = '100%';
      video.style.height = '100%';

      config.containerEl.appendChild(video);
      this.anamClient = createClient(config.avatarSessionResponse?.clientToken!); // session token from YOUR backend
      await this.anamClient.streamToVideoElement('anam-video'); // or config.containerEl


      //await this.anamClient.muteInputAudio();
      // this.anamClient.on('MESSAGE_HISTORY_UPDATED', (msgs: any[]) => {  });
      // this.anamClient.on('SESSION_ENDED', () => this.events.onDisconnected?.());

      this.connected = true;
      this.events.onConnected?.();
    } catch (err) {
      this.events.onError?.(err);
      throw err;
    }
  }

  async disconnect(): Promise<void> {
     await this.anamClient?.stopStreaming();
    this.connected = false;
    this.events.onDisconnected?.();
  }

  sendText(text: string): void {
    this.anamClient?.sendUserMessage(text);
  }

  isConnected(): boolean {
    return this.connected;
  }
}
