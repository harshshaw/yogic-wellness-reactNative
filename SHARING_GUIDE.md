# Sharing Your Expo App Remotely — Step-by-Step Guide

## Overview

Three ways to share an Expo app with someone who isn't on your network:

1. **Tunnel** — quickest, but your laptop must stay on
2. **EAS Update** — publishes the JS bundle; recipient uses Expo Go (chosen here)
3. **EAS Build** — produces a real installable APK/IPA

This guide covers **EAS Update with public Expo Go**.

---

## One-Time Setup

### 1. Install the EAS CLI

```bash
npm install -g eas-cli
```

### 2. Log in to your Expo account

```bash
eas login
```

Enter your email/username and password.

### 3. Initialize the project on EAS

```bash
eas init
```

Answer **yes** when asked to create the project. This adds a `projectId` to `app.json`.

### 4. Configure EAS Update

```bash
eas update:configure
```

This installs `expo-updates` and sets the update URL in `app.json`.

---

## Make the App Compatible with Public Expo Go

Edit `app.json`. Find the `runtimeVersion` field and change it from:

```json
"runtimeVersion": {
  "policy": "appVersion"
}
```

To:

```json
"runtimeVersion": "exposdk:54.0.0"
```

> Replace `54.0.0` with whatever Expo SDK version your project uses (check the `expo` field in `package.json`).

This pins the runtime to the SDK version, so the public Expo Go app from the App/Play Store can load your update.

---

## Fix the Project Entry (if using react-navigation directly)

If your project uses `react-navigation` (not expo-router), make sure the entry is set up correctly:

### `package.json`

```json
"main": "./index.js"
```

### `index.js`

```js
import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
```

### `App.tsx`

```tsx
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './components/AppNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
```

The `NavigationContainer` wrapper is required when you use `@react-navigation/native-stack` directly.

---

## Publish an Update

Every time you want to share new changes:

```bash
eas update --branch preview --message "what changed"
```

The terminal will print something like:

```
Branch             preview
Runtime version    exposdk:54.0.0
EAS Dashboard      https://expo.dev/accounts/<you>/projects/<app>/updates/<id>
```

The **EAS Dashboard** URL is the link to share.

---

## Send to Your Friend

Tell them:

1. Install **Expo Go** from the Play Store (Android) or App Store (iOS).
2. Open the link you sent them on their phone.
3. Tap **"Open in Expo Go"** — your app loads in a few seconds.

To send a QR code instead of a link:
- Paste the link at <https://qr.expo.dev>
- Or open the EAS Dashboard URL on a desktop — a QR appears on the page.

---

## Troubleshooting

### White blank screen after download
- Shake the phone in Expo Go → look for the red error overlay.
- Common causes: missing `NavigationContainer`, wrong `main` entry in `package.json`, mixing expo-router with react-navigation.

### "Required headers" error in browser
- The `https://u.expo.dev/...` URL is the manifest endpoint, not the share link.
- Use the **EAS Dashboard** URL from the publish output instead.

### Friend's Expo Go can't find the update
- Confirm `runtimeVersion` in `app.json` is `"exposdk:<your-sdk>"`.
- Republish with `eas update`.
- Have them force-close Expo Go and reopen the link.

### Native module added — update no longer applies
- `eas update` only ships JS. Adding a native module requires a new build:
  ```bash
  eas build --profile preview --platform android
  ```

---

## Quick Reference

| Task | Command |
| --- | --- |
| Log in | `eas login` |
| Initial project setup | `eas init` |
| Configure updates | `eas update:configure` |
| Publish an update | `eas update --branch preview --message "..."` |
| List past updates | `eas update:list` |
| Build APK | `eas build --profile preview --platform android` |

---

## Useful Links

- EAS Dashboard: <https://expo.dev>
- Generate QR from URL: <https://qr.expo.dev>
- Expo Update docs: <https://docs.expo.dev/eas-update/introduction>
