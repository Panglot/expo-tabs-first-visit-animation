# expo-router: JS Tabs skip the enter animation on first visit to a lazy tab

Minimal reproduction for an expo-router (SDK 58) bug. With a tab animation enabled, the **first** switch to a lazy tab doesn't animate the incoming screen. It appears instantly, while the outgoing screen still animates out. Later switches animate both ways.

- expo 58, expo-router 58.0.27, react-native 0.88.0
- Reproduced on: web (Expo Go on Android/iOS: see the issue)

## Run

```bash
npm install
npx expo start
```

Open it on web, or in Expo Go.

## Reproduce

The app opens on **Home** (blue). The tabs layout is [`src/app/(tabs)/_layout.tsx`](src/app/(tabs)/_layout.tsx): a plain `<Tabs>` with `animation: 'fade'` and two screens.

1. Tap **Settings** (red) for the first time.
   - Expected: Home fades out, Settings fades in.
   - Actual: Home fades out, Settings appears instantly.
2. Tap **Home**, then **Settings** again. Both fade correctly from now on.
3. Reload the app: the first visit to Settings skips its fade-in again.

Adding `lazy: false` to `screenOptions` makes step 1 animate correctly.

## Cause

Read from `node_modules/expo-router/build/react-navigation/bottom-tabs`:

1. Since [expo/expo#48618](https://github.com/expo/expo/pull/48618), an unvisited lazy tab is a placeholder route keyed by its name, e.g. `"settings"` (`standard-navigation/appendMissingPlaceholderTabRoutes.js`).
2. On first navigation, the real route is created with a new generated key.
3. `utils/useAnimatedHashMap.js` sees a new key and creates its `Animated.Value` at its target position. The route is already focused, so the value starts at `0`.
4. `views/BottomTabView.js` animates the focused route to `0`. It's already there, so there's no enter animation.

## Workaround

Set `lazy: false`, and use `screenLayout` to render each screen's content only after its first focus. That keeps data fetching from starting at launch.
