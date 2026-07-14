import { Injectable } from '@angular/core';
import { SimliClient, LogLevel } from 'simli-client';

@Injectable({
  providedIn: 'root'
})
export class SimliProvider {

  private client?: SimliClient;
  private connected = false;

  async connect(
    sessionToken: string,
    videoElement: HTMLVideoElement,
    audioElement: HTMLAudioElement
  ): Promise<void> {

    this.client = new SimliClient(
      sessionToken,
      videoElement,
      audioElement,
      null,
      LogLevel.INFO,
      'livekit'
    );

    this.registerEvents();

    await this.client.start();
    await this.client.listenToAudioElement(audioElement);
    
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    if (!this.client) return;

    this.client.stop();
    this.connected = false;
  }

  isConnected(): boolean {
    return this.connected;
  }

  private registerEvents(): void {
    if (!this.client) return;

    this.client.on('start', () => {
      console.log('Simli connected');
    });

    this.client.on('stop', () => {
      console.log('Simli disconnected');
    });

    this.client.on('speaking', () => {
      console.log('Avatar speaking');
    });

    this.client.on('silent', () => {
      console.log('Avatar silent');
    });

    this.client.on('error', (err: any) => {
      console.error('Simli error', err);
    });
  }

  /**
   * Send PCM16 16Khz mono audio to Simli
   */
  sendAudio(audioBytes: Uint8Array): void {
    if (!this.client) return;

    this.client.sendAudioData(audioBytes);
  }

  /**
   * Connect browser microphone directly to Simli
   */
  async startMicrophone(): Promise<void> {

    if (!this.client) return;

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true
    });

    const track = stream.getAudioTracks()[0];

    this.client.listenToMediastreamTrack(track);

    console.log('Microphone connected');
  }
}