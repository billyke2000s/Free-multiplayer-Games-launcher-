# Contributing to AAC Playroom

Thanks for helping improve Playroom. Bug fixes, accessibility improvements and gameplay polish are welcome.

## Report a bug

Use [GitHub Issues](https://github.com/billyke2000s/Free-multiplayer-Games-launcher-/issues/new/choose) and include:
- Game name and whether you were playing with CPUs or local players
- Android version, phone/tablet model and browser or app wrapper
- Portrait or landscape orientation
- Steps to reproduce (including rotation, touch/hold behaviour and timing where relevant)
- What you expected, what happened, and a screenshot/video if possible

Please avoid posting private data in screenshots or logs.

## Make changes

1. Create a branch from `main`.
2. Edit the unified `index.html` (game logic and UI live in this file).
3. Run `npm run check` and `npm run build`.
4. Test on a narrow phone viewport **and** a short landscape viewport.
5. Verify a real round or interaction, not merely that a game launches.
6. Open a pull request with a concise description and before/after screenshots.

For Android changes, build the debug APK with `gradle -p android assembleDebug` after `npm run build`.

## Testing priorities

- Navigating to and exiting every game, both by tapping and holding Back where applicable
- Preserving game state through portrait/landscape rotation
- Ball movement, score updates and multi-ball behaviour in Brick Breaker
- Pool pocket geometry, CPU legality and physics
- Card readability, CPU turn pacing, correct pile/hand sizes and game rules
- Touch targets, contrast, readability and avoiding time pressure for children

## Scope & security

This is intended as an **offline-first** games collection. Do not add tracking, advertisements, remote scripts or network requests without discussing the change. Bluetooth multiplayer is a future feature, not a currently available connection system. Respect the owners' rights to source code and any third-party assets; a distribution licence has not been selected.
