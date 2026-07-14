import { InjectionToken } from '@angular/core';
import { IAvatarProvider } from './models/avatar-provider.interface';

/**
 * Every IAvatarProvider implementation registers itself against this
 * multi-token in app.config.ts. AvatarProviderFactory then resolves
 * the right one at runtime using Formateur.voiceProvider as the key.
 */
export const AVATAR_PROVIDERS = new InjectionToken<IAvatarProvider[]>('AVATAR_PROVIDERS');
