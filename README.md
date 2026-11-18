# Playroom

A touchscreen multiplayer games launcher with cinematic imagery, a curated library, large touch targets and portrait/landscape layouts. No add-game interface.

## Play

Run `npm start` and open http://localhost:8080. No dependencies are required. `npm run build` copies the web app into `dist/` and bundles the same files into the Android project.

Included local games: Four in a Row, Reversi, Perfect Match and Noughts & Crosses. All support two players sharing one screen. Search, categories, favourites, recent games, reduced motion and fullscreen are functional. Preferences are stored locally.

8 Ball Classic links to the official Famobi website selected during development. It requires internet and opens externally; Famobi game code and artwork are not bundled. Its cover is original generated artwork, not a screenshot of the game.

## Android APK

GitHub Actions builds a debug APK on pushes to main, pull requests and manual dispatch. Download **Playroom-APK** from the completed **Build Playroom APK** workflow run. Extract the ZIP and install the APK. Debug builds are for testing; configure your own signing key before a store release.

For a local build: install JDK 17, Android SDK 35 and Gradle 8.9, run `npm run build`, then `gradle -p android assembleDebug`.

The wrapper serves bundled assets through a fixed HTTPS origin in WebView; local games work offline. External HTTPS game links open in the browser. There is no native JavaScript bridge or file access. Google Fonts is optional and falls back to system fonts offline. The launcher supports Android 6+ with a current Android System WebView; modern browser APIs including dialog require an up-to-date WebView.

## Artwork and catalogue

`assets/pool.jpg`: original generated billiards photograph for this project. Other cover assets are original vector illustrations of the included game pieces. Titles and online destinations are curated in `app.js`; there is no user-facing way to add games.

## Verification

`npm run check` checks JavaScript syntax. Interactive verification should cover filters, persisted favourites, navigation, each game's win/draw rules, restart/close, portrait and landscape overflow, and Android external-link/back-button behaviour. Android device testing remains necessary before release.
