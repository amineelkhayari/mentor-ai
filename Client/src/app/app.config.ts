import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core/auth/auth.interceptor';

import { AVATAR_PROVIDERS } from './avatar-engine/avatar-provider.registry';
import { AnamProvider } from './avatar-engine/providers/anam.provider';
import { TavusProvider } from './avatar-engine/providers/tavus.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),

    // --- Avatar engine registration -----------------------------------
    // To add a new provider (e.g. HeyGen), create a class implementing
    // IAvatarProvider under avatar-engine/providers/ and add ONE line here.
    // No component or service anywhere else needs to change.
    { provide: AVATAR_PROVIDERS, useClass: AnamProvider, multi: true },
    { provide: AVATAR_PROVIDERS, useClass: TavusProvider, multi: true },

  ],
};
