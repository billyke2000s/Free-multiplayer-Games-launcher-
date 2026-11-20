# AAC Playroom — Unified Games

One offline-first, touchscreen-friendly games launcher with **16 games in a single HTML page**. This repository replaces the previous five-game Playroom launcher.

## Games
- **8-Ball Pool:** practice, CPU difficulty levels, local multiplayer/2v2, spin and shot planning.
- **Arcade (7):** Space Explorer, Brick Breaker, Target Tap, Colour Lanes, Whack-a-Mole, Tic-Tac-Toe and Checkers.
- **Cards (8):** Crazy Eights, Go Fish, Memory Match, Snap, Solitaire, Rummy, Spades and Card Battle.

Crazy Eights has its own four-colour action deck. The traditional card games use SVG playing cards. No poker or wagering is included. Star Catcher has been removed.

## Run locally
```sh
npm run check
npm start
```
Open http://localhost:8080. The root `index.html` includes all game logic and images so it can also be opened directly offline.

## Build the Android APK
The GitHub Actions **Build Playroom APK** workflow runs on pushes to `main`. After a successful run, download the **Playroom-APK** artifact. It is a debug APK for testing, not a Play Store release.

For a local build, install JDK 17, Android SDK 35 and Gradle 8.9, then:
```sh
npm run build
gradle -p android assembleDebug
```
The build copies `index.html` into `dist/` for static hosting and into the Android WebView's bundled assets. The Android app uses a local HTTPS asset host with no network permission. The Android Back action offers an in-game exit confirmation; the on-screen arrow supports hold-to-exit.

## Important limitations
- Bluetooth multiplayer requires a **native Android Bluetooth transport**. The V9 HTML contains UI integration points, but this repository's Android wrapper does **not yet implement** that transport. Nearby-phone games are not verified and should not be advertised as working.
- CPU and local/same-device modes are implemented, but physical-device testing of the Android APK is still needed.
- Tests in `npm run check` validate packaging, syntax and some structural invariants. They are **not** complete gameplay or device tests.
- In a regular Android browser, Chrome's address bar cannot be hidden by a local HTML file; use the Android APK for immersive play.

## Repository layout
- `index.html`: canonical unified arcade.
- `scripts/build.mjs`: copies the HTML into static hosting and Android assets.
- `scripts/check.mjs`: static/syntax regression checks.
- `android/`: offline WebView app and Gradle project.
- `.github/workflows/android.yml`: debug APK build.

The previous launcher code remains available in Git history; it is not used by this version.
