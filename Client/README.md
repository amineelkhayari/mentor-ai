# Study Platform — Angular Client

Angular 18 (standalone components) client for the ASP.NET Core API built around
`Categorie`, `Formation`, `Formateur`, `Session`, `UserSession`, `ApplicationUser`.

## Setup

```bash
npm install
```

Set your API URL in `src/environments/environment.ts`:

```ts
export const environment = {
  production: false,
  apiBaseUrl: 'https://localhost:7000/api',
};
```

Run:

```bash
npm start
```

## Project structure

```
src/app/
├── core/
│   ├── models/        # TS interfaces mirroring the C# entities
│   ├── services/       # HttpClient services (extend ApiCrudService)
│   └── auth/          # JWT storage + HTTP interceptor
├── avatar-engine/       # <-- the important part, see below
│   ├── models/avatar-provider.interface.ts
│   ├── providers/      # simli.provider.ts, anam.provider.ts, ...
│   ├── avatar-provider.registry.ts
│   └── avatar-provider.factory.ts
└── features/
    ├── formations/
    ├── sessions/
    └── live-call/       # consumes the factory, vendor-agnostic
```

## Login / sign-up pages

`features/auth/` contains:

- `auth-layout.component.ts` — shared split-screen shell (dark signature
  panel + light form panel). Signature element is an animated waveform,
  since the product's core moment is "an AI tutor about to speak to you."
- `login.component.ts` — email/password sign-in, reactive form, calls
  `AuthService.login()`.
- `register.component.ts` — first/last name, email, password + confirm,
  reactive form with a cross-field "passwords match" validator, calls
  `AuthService.register()`.
- `auth-form.css` — shared input/button styling reused by both forms.

Design tokens: ink `#14151A` (dark panel), mist `#F1F2F6` (form panel),
violet `#6E5BFF` (primary accent, login), teal `#26C6B0` (secondary accent,
sign-up). Type: Space Grotesk (display), Inter (body), IBM Plex Mono
(small labels/eyebrows).

Routes `/login` and `/register` are public; `/formations`, `/sessions`, and
`/sessions/:id/call` are protected by `core/auth/auth.guard.ts`, which
redirects unauthenticated users to `/login?redirectTo=...`.

## How the avatar engine works

`Formateur.voiceProvider` (e.g. `"simli"`, `"anam"`) is the single source of
truth for which vendor SDK gets used for a given session. Nothing in the UI
hardcodes a vendor:

1. `IAvatarProvider` (in `avatar-engine/models`) is the contract every vendor
   integration must satisfy: `connect()`, `disconnect()`, `sendText()`,
   `isConnected()`.
2. Each vendor gets one file under `avatar-engine/providers/`
   (`simli.provider.ts`, `anam.provider.ts`) implementing that interface.
   This is the **only** place vendor SDK code should ever be imported.
3. Providers are registered against the `AVATAR_PROVIDERS` multi-injection
   token in `app.config.ts`.
4. `AvatarProviderFactory.get(formateur.voiceProvider)` resolves the right
   implementation at runtime.
5. `LiveCallComponent` only ever talks to the resolved `IAvatarProvider` —
   it has zero knowledge of Simli or Anam specifically.

### Adding a third provider (e.g. HeyGen)

1. Create `avatar-engine/providers/heygen.provider.ts` implementing
   `IAvatarProvider` with `key = 'heygen'`.
2. Register it in `app.config.ts`:
   ```ts
   { provide: AVATAR_PROVIDERS, useClass: HeygenProvider, multi: true },
   ```
3. Set `voiceProvider: "heygen"` on the relevant `Formateur` rows in the DB.

No component, route, or service changes required.

### TODOs before this talks to real vendors

- Fill in the real Simli/Anam SDK calls in the two provider stubs (see the
  `TODO` comments inside each file — vendor npm packages aren't installed
  here since they weren't specified).
- Add a backend endpoint that mints short-lived session tokens per vendor so
  API keys never reach the browser, and pass that token as
  `AvatarSessionConfig.accessToken`.
- Wire `LiveCallComponent`'s `userId` to your real authenticated user (via
  `AuthService`) instead of the placeholder string.
- Add an ASP.NET Identity `/api/auth/login` and `/register` endpoint
  returning a JWT to match `AuthService`, or adjust it to your actual auth
  flow.
