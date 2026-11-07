# Expo SDK 57 migration review

## Architecture and scope

The mobile application lives in `ui/`; sibling backend, server, landing and infrastructure projects are separate. The entry remains `index.js` → `App.tsx` → a single React Navigation `NavigationContainer` → native stack → custom bottom tabs. Authentication, theme, reflection and app music remain context providers. Remote media URLs, API contracts, screen names, navigation transitions and screen layouts are retained.

The working tree already contained upgrade edits to `App.tsx`, `app.json`, `package.json` and `package-lock.json` before this work. Those changes were preserved; the full Git diff includes them. Unrelated sibling-project changes were not modified.

## Root causes and fixes

- **False Router incompatibility error:** `/Applications/YogicWellness/node_modules/expo-router` was discoverable above the app, despite Router being absent from the app's dependency graph. Expo CLI's fallback package lookup classified the app as a Router project. Enabled the documented `experiments.autolinkingModuleResolution` setting so Metro resolves against the app dependency graph. No Router-disable environment flag or dependency patch is used. Removed the unused `app/index.tsx` alias and template reset script that generated Router layouts.
- **Native stack:** `@react-navigation/native-stack@7.19.2` was already present in both the manifest and installed tree when inspected. Navigation packages resolve to one React Navigation 7 installation with compatible screens and safe-area peers. Retained these versions.
- **ExponentAV:** the app imported SDK 54-era `expo-av@16.0.8`, which is not in SDK 57's supported native package map. Removed its dependency, plugin and all imports. Playback/recording now use `expo-audio`; all five video screens use `expo-video` through `SessionVideo`.
- **Filesystem:** the app directly imported an undeclared transitive dependency. Declared `expo-file-system` explicitly. Onboarding called old methods through the modern entry point, where those methods throw; it now imports the supported `/legacy` entry point, like the other persistence services. Existing filenames and persisted data are preserved. Removed unnecessary casts hiding `documentDirectory` types. The legacy API is still supported by SDK 57; a wholesale storage rewrite is not required for this upgrade.
- **Configuration:** replaced the stale `exposdk:54.0.0` runtime with the fingerprint policy, and moved the removed top-level `splash` field into the splash-screen plugin with the same icon, color and resize mode. Microphone permission wording is retained; background audio remains disabled. Added `expo-asset`, required by audio, and `expo-dev-client`, required by the existing EAS development profile.
- **React Native / TypeScript:** replaced removed `StyleSheet.absoluteFillObject` references with equivalent `absoluteFill`; corrected the alias pointing to nonexistent `src/`; handled the new `unspecified` color scheme; fixed a duplicate spread `key`. Registered gesture-handler before app imports and added root gesture/safe-area providers.
- **Toolchain:** system Node 23.3.0 is outside React Native 0.86 / Metro's engine range. Added `.nvmrc` (22) and supported LTS engine ranges. Final production exports also passed using temporary Node 22.23.2; the system Node installation was not changed.

## Media behavior retained

- App ambience and selected tracks retain their default mute state, loop settings, volumes (0.1 / 0.7), replacement, pause/resume, and app-state handling. Track settings are reapplied after replacement because the web audio implementation recreates its media element.
- Guided narration drives remaining time using expo-audio's **seconds**, completes course modules on playback completion, and pauses when the session is paused or ended. Hook-owned players release native resources on unmount.
- Companion recording retains high-quality capture, permission requests, base64 transcription payloads and text-to-speech. A busy guard prevents overlapping recorder preparation; playback audio mode is restored after recording and on exit.
- Videos retain cover scaling, looping/muting, tutorial completion, active-reel playback, nature controls/loading indicator, and animated backdrops. Android uses `textureView` to support overlapping video layers and opacity crossfades.

## Dependency changes in this work

| Package | Change |
| --- | --- |
| expo-av | Removed ~16.0.8 |
| expo-audio | Added ~57.0.5 |
| expo-video | Added ~57.0.4 |
| expo-file-system | Declared ~57.0.7 directly |
| expo-asset | Declared ~57.0.18 directly |
| expo-dev-client | Added ~57.0.19 |

Versions were selected using the installed `expo@57.0.24` bundled-native-module map and `expo install`, rather than a blanket upgrade. React 19.2.3, React Native 0.86.3 and the existing compatible SDK packages were retained. Lockfile updated with normal npm resolution, without `--force` or `--legacy-peer-deps`.

## Changed files

- Configuration/bootstrap: `package.json`, `package-lock.json`, `app.json`, `tsconfig.json`, `.nvmrc`, `index.js`, `App.tsx`.
- Media: `hooks/useAppMusic.tsx`; `components/SessionVideo.tsx` (new); `AICompanionScreen.tsx`, `BreathingSessionScreen.tsx`, `MeditationSessionScreen.tsx`, `NatureVideoScreen.tsx`, `NowPlayingScreen.tsx`, `ReelsScreen.tsx`; media comments in `lib/media.ts` and `lib/aiCompanion.ts`.
- Storage typing/entry point: `utils/onboardingStorage.ts`, `hooks/useAuth.tsx`, `lib/apiClient.ts`, `lib/companionMemory.ts`, `lib/foundationsProgress.ts`.
- Mechanical style/type fixes: `components/AICompanionHomeScreen.tsx`, `BreatheScreen.tsx`, `HomeScreen.tsx`, `MorningReflectionScreen.tsx`, `MusicScreen.tsx`, `PranayamaScreen.tsx`, `SleepScreen.tsx`, `FeedbackCelebration.tsx`; `styles/HomeScreen.styles.ts`; `hooks/use-theme-color.ts`.
- Removed unused Router template artifacts: `app/index.tsx`, `scripts/reset-project.js`, and its npm script.
- Added this report.

## Verification and remaining limits

- Expo Doctor: **18/18 checks pass**.
- `expo install --check`: **dependencies up to date**; online verification completed.
- `npm ls --depth=0`: **passes**, no missing/invalid direct dependencies.
- `tsc --noEmit`: **passes**.
- `expo config --type introspect`: **passes** for Android and iOS plugin configuration.
- `expo export --platform all`: **passes** for web and iOS/Android Hermes bundles, including under Node 22.
- Metro starts on localhost; `/status` returns `packager-status:running`.
- Headless Chrome renders the splash-to-login flow and the expected Auth screen (Welcome back, email/password fields and Sign in).
- Repository ESLint baseline was **97 errors / 31 warnings**; after migration **93 errors / 30 warnings** remain. These concern existing animation refs, render purity, effect-driven state, unescaped JSX text, script globals and unused declarations. Rules were not disabled. New media abstractions pass ESLint. Full lint cleanup remains separate from SDK compatibility.
- npm audit reports **17 vulnerabilities** (1 low, 11 moderate, 4 high, 1 critical), including transitive `@xmldom/xmldom`, `brace-expansion`, `js-yaml`, `shell-quote` and `ws`. No blind audit fix or major upgrade was applied.
- Full native compilation/device execution is **not verified**: `xcodebuild` fails because only Command Line Tools are installed; Android tooling is unavailable. Exports are not signed native binaries. Native microphone access, audio routing, video transitions, notification delivery and visual parity still need device checks. Headless Chrome emitted host display/network diagnostics; rendering succeeded.
- Existing `/legacy` filesystem calls and React Native `SafeAreaView` in the subscription screen remain supported but deprecated. Browser persistence/voice transcription using the native filesystem path was not expanded in this migration.

## Running the updated application

Use Node 22.13+ (for example `nvm use`), then `npm ci` and `npm start -- --clear`. Build a **new** development/production native binary before testing native media; an old SDK 54/old-module binary cannot acquire new native modules through Metro or an OTA update. The fingerprint policy prevents these updates from targeting the old native runtime. The existing EAS profiles remain available; no remote build, OTA update or deployment was submitted.

References: [SDK 57 audio](https://docs.expo.dev/versions/v57.0.0/sdk/audio/), [SDK 57 video](https://docs.expo.dev/versions/v57.0.0/sdk/video/), [Expo autolinking](https://docs.expo.dev/modules/autolinking/), [React Navigation setup](https://reactnavigation.org/docs/getting-started/).
