# Changelog

## [2.1.0](https://github.com/billyke2000s/Free-multiplayer-Games-launcher-/releases/tag/v2.1.0) — 2026-11-20

**Universal Android test APK.**

### Improved
- **Pool:** Separated tap/drag aiming from shooting; added a fine aiming wheel, a pull-down-and-release power bar, cue-ball contact-point spin, and power-side/tap-to-aim options.
- **Space Explorer:** Added a 360-degree virtual joystick and keyboard movement; asteroids now enter from all four boundaries and the ship auto-fires in the target direction.
- Added regression checks for both games and clarified universal Android CPU architecture compatibility.

### Testing notes
- Touch controls and layout still need testing on physical phones, especially in landscape.
- Release is debug-signed. Phone-to-phone Bluetooth multiplayer remains unimplemented.

This file records meaningful published changes to AAC Playroom.

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
