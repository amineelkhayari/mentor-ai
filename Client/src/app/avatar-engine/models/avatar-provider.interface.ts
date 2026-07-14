import { Formateur } from '../../core/models/formateur.model';
import { AvatarSessionResponse } from '../../core/models/session.model';

export interface AvatarSessionConfig {
  formateur: Formateur;
  containerEl: HTMLElement;
  userId: string;
  sessionId: number;
  /** Optional short-lived token/session-key issued by YOUR backend (recommended). */
  //accessToken?: string;
  avatarSessionResponse?: AvatarSessionResponse
}

export interface AvatarEvents {
  onConnected?: () => void;
  onDisconnected?: () => void;
  onUserSpeaking?: (transcript: string) => void;
  onAvatarSpeaking?: (transcript: string) => void;
  onError?: (err: unknown) => void;
}

/**
 * Every avatar vendor (Simli, Anam, HeyGen, D-ID, ...) implements this.
 * Nothing outside avatar-engine/providers/* should ever import a vendor SDK
 * directly. Components and services only ever talk to this interface.
 */
export interface IAvatarProvider {
  /** Must match the value stored in Formateur.voiceProvider (lower-case). */
  readonly key: string;

  connect(config: AvatarSessionConfig, events: AvatarEvents): Promise<void>;
  disconnect(): Promise<void>;
  sendText(text: string): void;
  isConnected(): boolean;
}
