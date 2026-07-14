import { Inject, Injectable } from '@angular/core';
import { AVATAR_PROVIDERS } from './avatar-provider.registry';
import { IAvatarProvider } from './models/avatar-provider.interface';

@Injectable({ providedIn: 'root' })
export class AvatarProviderFactory {
  constructor(@Inject(AVATAR_PROVIDERS) private providers: IAvatarProvider[]) {}

  /**
   * Resolve the provider by the string stored in Formateur.voiceProvider.
   * Throws a clear error if a Formateur references a provider that was
   * never registered in app.config.ts (helps catch config drift early).
   */
  get(key: string): IAvatarProvider {
    const normalized = key?.toLowerCase()?.trim();
    const provider = this.providers.find((p) => p.key === normalized);
    if (!provider) {
      const known = this.providers.map((p) => p.key).join(', ');
      throw new Error(`No avatar provider registered for "${key}". Known providers: [${known}]`);
    }
    return provider;
  }

  listAvailable(): string[] {
    return this.providers.map((p) => p.key);
  }
}
