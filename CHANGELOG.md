# Changelog

## [2.2.3](https://github.com/billyke2000s/Free-multiplayer-Games-launcher-/releases/tag/v2.2.3) — 2026-11-20

**8-Ball Pool collision-freeze fix and individual sound design for all games.**

### Fixed
- Pool no longer calls an inaccessible sound function: the former `sfx()` scope error stopped requestAnimationFrame when a collision occurred.
- Corrected over-damped pool cloth physics: breaks now spread balls, direct hits transfer momentum, and shots keep rolling smoothly.
- Replaced the generic sound mapping with 16 game-specific banks, including realistic-style billiard clicks, wood checkers, paper cards, sci-fi lasers, rubber mole thumps, and arcade bounces.
- Reduced high-pitched tones and overall gain; pooled collision sounds are rate-limited for crowded rack breaks.

### Regression checks
- Direct hit must separate two pool balls; a full rack break must meaningfully spread at least eight object balls.
- Each of the 16 game palettes must generate its own sounds through the shared, correctly scoped WebAudio engine.
- Per-device sound mute preference remains intact.

### Device testing
- Android touch-and-sound checks still require a real device; synthetic effects are not externally recorded samples.


## [2.2.2](https://github.com/billyke2000s/Free-multiplayer-Games-launcher-/releases/tag/v2.2.2) — 2026-11-20

**Sound effects across all 16 games.**

### Fixed and added
- Replaced the arcade's default-muted audio with an offline shared WebAudio sound engine.
- Sound is on by default and the mute setting is remembered across sessions.
- Card Club now has its own sound toggle, synced with the main launcher and in-game controls.
- Added effects for pool shots, collisions and pockets; board-game moves, captures, wins and crowns.
- Added distinct arcade sounds for lasers, bounces, scoring, errors, hits and game over.
- Added card sounds for draws, flips, matching, actions, SNAP calls, shuffling, tricks, errors and wins.
- Android WebView permits audio for CPU and remote-player turns.
- Added automated sound-effect playback and preference tests.

### Testing
- The audio engine and game-event wiring are regression-checked. Final loudness, timing and Android hardware playback still need physical-device testing.
- If muted, tap the music-note icon in the main launcher or Card Club to enable sounds.


## [2.2.1](https://github.com/billyke2000s/Free-multiplayer-Games-launcher-/releases/tag/v2.2.1) — 2026-11-20

**Pool cue and shot power control bugfix.**

### Fixed
- Pool cue rotates smoothly with finger movement instead of jumping towards the touch point after a drag.
- Tapered wooden cue has a visible wrap, ferrule and tip and pulls backward with shot power.
- Turning off the aim guide no longer makes the cue disappear.
- Shot power now resets to 0 on every shot and turn, including CPU, practice and Bluetooth state reconciliation.
- Regression checks for cue aiming, drawing and shot reset paths.

### Testing notes
- Test touch-aiming, spin, and the pull-and-release bar on actual Android devices.
- Bluetooth play remains subject to two-device testing.


This file records meaningful published changes to AAC Playroom.

## [2.2.0](https://github.com/billyke2000s/Free-multiplayer-Games-launcher-/releases/tag/v2.2.0) — 2026-11-20

**Native Bluetooth Classic multiplayer testing release.**

### Added
- Android Bluetooth Classic RFCOMM transport: discoverability, nearby + paired device discovery, secure pairing, hosting and connecting, runtime permissions, multiple peers, ordered messages and disconnect handling.
- Bluetooth gameplay for 8-Ball Pool (strokes, ball placement and host-authoritative settled table synchronization), Tic-Tac-Toe and Checkers (remote turn-validated moves), and seven multiplayer card games.
- Card game private-hand views, a host-controlled game room and automatic CPU replacement after a friend's disconnect.
- Structural checks for the Android Java bridge, manifest and gameplay message handling.

### Device testing needed
- Test real Bluetooth connections between two or more Android devices, especially Android 6–11 discovery and Android 12+ Nearby devices permissions.
- Validate pairing, card privacy, interrupted connections and pool physics resynchronization on actual hardware.
- Offline/browser games and CPU modes remain supported; Solitaire and single-player arcade games do not have Bluetooth modes.

## [2.1.0](https://github.com/billyke2000s/Free-multiplayer-Games-launcher-/releases/tag/v2.1.0) — 2026-11-20

**Universal Android test APK.**

### Improved
- **Pool:** Separated tap/drag aiming from shooting; added a fine aiming wheel, a pull-down-and-release power bar, cue-ball contact-point spin, and power-side/tap-to-aim options.
- **Space Explorer:** Added a 360-degree virtual joystick and keyboard movement; asteroids now enter from all four boundaries and the ship auto-fires in the target direction.
- Added regression checks for both games and clarified universal Android CPU architecture compatibility.

### Testing notes
- Touch controls and layout still need testing on physical phones, especially in landscape.
- Release is debug-signed. Phone-to-phone Bluetooth multiplayer remains unimplemented.

## [2.0.0](https://github.com/billyke2000s/Free-multiplayer-Games-launcher-/releases/tag/v2.0.0) — 2026-11-20

**Testing release — debug APK.**

### Changed
- Replaced the legacy five-game launcher with the unified **16-game** HTML5 Playroom.
- Expanded the collection with seven arcade/board games, eight card games, and 8-Ball Pool.
- Added SVG card faces/backs and the four-colour Crazy Eights action deck.
- Updated the offline Android WebView bundle and full-screen presentation.
- Switched APK distribution from GitHub Actions artifacts to **GitHub Releases** due to artifact storage limits.

### Known limitations
- Direct Bluetooth multiplayer between Android devices is not yet wired up.
- This release is debug-signed and needs broader Android device testing.
- Game mechanics, layout and accessibility may still need refinement.

Older launcher history remains available in Git commits.
