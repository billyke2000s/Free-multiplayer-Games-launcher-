# Playroom

A touchscreen multiplayer games launcher with cinematic imagery, a curated library, large touch targets and portrait/landscape layouts. No add-game interface.

## Play

Run `npm start` and open http://localhost:8080. No dependencies are required. `npm run build` copies the web app into `dist/` and bundles the same files into the Android project.

Included local games: 8 Ball Pool, Four in a Row, Reversi, Perfect Match and Noughts & Crosses. All support two players sharing one screen. Search, categories, favourites, recent games, reduced motion and fullscreen are functional. Preferences are stored locally.

8 Ball Pool is now an original, fully bundled two-player game. It runs inside the app, offline. Touch aiming, a power slider, trajectory guide, ball collisions, six pockets, cushions, group assignment, fouls, ball in hand and 8-ball win/loss handling are included. Pool has synthesized cue, ball, cushion, pocket, foul and victory effects. The other games and launcher also have sound effects, with a persistent mute switch. No Famobi code or external game links are used.

## Android APK

GitHub Actions builds a debug APK on pushes to main, pull requests and manual dispatch. Download **Playroom-APK** from the completed **Build Playroom APK** workflow run. Extract the ZIP and install the APK. Debug builds are for testing; configure your own signing key before a store release.

For a local build: install JDK 17, Android SDK 35 and Gradle 8.9, run `npm run build`, then `gradle -p android assembleDebug`.

The wrapper serves bundled assets through a fixed HTTPS origin in WebView; local games work offline. The curated catalogue contains no external game destinations. There is no Internet permission, external navigation, native JavaScript bridge or file access. All runtime code, game assets and sounds work offline. The launcher supports Android 6+ with a current Android System WebView; modern browser APIs including dialog require an up-to-date WebView.

## Artwork and catalogue

`assets/pool.jpg`: original generated billiards photograph for this project. Other cover assets are original vector illustrations of the included game pieces. Titles and online destinations are curated in `app.js`; there is no user-facing way to add games.

## Verification

`npm run check` checks JavaScript syntax and runs pool physics/rules regressions, including break simulations, scratches, groups and legal/illegal 8-ball wins. Interactive verification should cover filters, persisted favourites, navigation, each game's win/draw rules, restart/close, portrait and landscape overflow, and Android external-link/back-button behaviour. Android device testing remains necessary before release.
