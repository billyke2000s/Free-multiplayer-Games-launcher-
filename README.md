<h1 align="center">🎮 AAC Playroom</h1>
<p align="center"><strong>One launcher. Sixteen games. No internet required.</strong></p>
<p align="center">A touchscreen-first collection of arcade, board and card games for Android and the browser. All 16 games have distinct offline sound palettes, enabled by default. Tap the music-note button to mute or unmute; your choice is remembered.<br/>Made for quick games, family play and accessible, straightforward controls.</p>

<p align="center">
  <a href="https://github.com/billyke2000s/Free-multiplayer-Games-launcher-/releases/tag/v2.2.3"><img alt="Version 2.2.3" src="https://img.shields.io/badge/version-2.2.3-6C63FF?style=for-the-badge"></a>
  <a href="#the-game-library"><img alt="16 games" src="https://img.shields.io/badge/games-16-28B99A?style=for-the-badge"></a>
  <a href="#android-installation"><img alt="Android 6+" src="https://img.shields.io/badge/Android-6%2B-3DDC84?style=for-the-badge&logo=android&logoColor=black"></a>
  <a href="#at-a-glance"><img alt="Offline-first" src="https://img.shields.io/badge/play-offline-1F2937?style=for-the-badge"></a>
</p>
<p align="center">
  <a href="https://github.com/billyke2000s/Free-multiplayer-Games-launcher-/actions/workflows/android.yml"><img alt="Android build" src="https://github.com/billyke2000s/Free-multiplayer-Games-launcher-/actions/workflows/android.yml/badge.svg?branch=main"></a>
  <a href="https://github.com/billyke2000s/Free-multiplayer-Games-launcher-/releases/tag/v2.2.3"><img alt="Testing release" src="https://img.shields.io/badge/release-testing%20APK-E0A449"></a>
  <a href="index.html"><img alt="HTML5 and JavaScript" src="https://img.shields.io/badge/engine-HTML5%20%2B%20JavaScript-F7DF1E?logo=javascript&logoColor=black"></a>
</p>
<p align="center">
  <strong><a href="https://github.com/billyke2000s/Free-multiplayer-Games-launcher-/releases/download/v2.2.3/AAC-Playroom-v2.2.3-universal-debug.apk">⬇ Download Android APK</a></strong>
  &nbsp;·&nbsp;
  <strong><a href="https://github.com/billyke2000s/Free-multiplayer-Games-launcher-/releases/tag/v2.2.3">📦 Release page</a></strong>
  &nbsp;·&nbsp;
  <strong><a href="index.html">🌐 Web-app source</a></strong>
  &nbsp;·&nbsp;
  <strong><a href="https://github.com/billyke2000s/Free-multiplayer-Games-launcher-/actions/workflows/android.yml">🔧 Builds</a></strong>
</p>
<p align="center"><sub>“Web-app source” opens the HTML file on GitHub, not a hosted playable website. GitHub Pages is not enabled for this private repository.</sub></p>
---

## ✨ At a glance

<table>
  <tr>
    <td align="center" width="33%"><strong>🕹️ 16 games</strong><br/><sub>1 pool · 7 arcade/board · 8 card games</sub></td>
    <td align="center" width="33%"><strong>📱 Android 6+</strong><br/><sub>Portrait and landscape support</sub></td>
    <td align="center" width="33%"><strong>📶 Offline-first</strong><br/><sub>Bundled game code and assets</sub></td>
  </tr>
  <tr>
    <td align="center"><strong>👥 Local + Bluetooth</strong><br/><sub>Same-device modes and Android Bluetooth Classic multiplayer</sub></td>
    <td align="center"><strong>🃏 SVG cards</strong><br/><sub>Vector card faces and backs</sub></td>
    <td align="center"><strong>🔖 v2.2.3</strong><br/><sub>Debug-signed testing release</sub></td>
  </tr>
</table>

## 🎲 The game library

<table>
  <tr>
    <td width="50%" valign="top">
      <h3>🎱 Pool</h3>
      <strong>8-Ball Pool</strong><br/>
      Practice, CPU opponents, shot power, spin, pockets, local multiplayer/team modes and two-phone Bluetooth.
    </td>
    <td width="50%" valign="top">
      <h3>🧱 Arcade &amp; board</h3>
      Space Explorer · Brick Breaker · Target Tap · Colour Lanes · Whack-a-Mole · Tic-Tac-Toe · Checkers
    </td>
  </tr>
  <tr>
    <td colspan="2" valign="top">
      <h3>🃏 Card games</h3>
      Crazy Eights · Go Fish · Memory Match · Snap · Solitaire · Rummy · Spades · Card Battle<br/>
      <sub>Crazy Eights uses a dedicated four-colour action deck. Traditional card games use SVG playing-card artwork. No poker, betting or casino features.</sub>
    </td>
  </tr>
</table>

## 🎮 Controls

### 🎱 8-Ball Pool
- **Aim:** Tap or drag across the felt to position the cue. Table movement never takes a shot.
- **Fine aim:** Drag the small aiming wheel to make precise adjustments, or use its left/right keyboard arrows.
- **Shoot:** Pull the vertical **power bar down** and release. A longer pull delivers a harder shot; release without pulling to cancel.
- **Spin:** Drag the red contact-point marker on the cue ball to set topspin, backspin or side spin; **Reset** recentres it.
- **Options:** Move the power bar between left and right, show/hide the aiming wheel, and toggle tap-to-aim from the pool menu.

### 🚀 Space Explorer
- **Move:** Use the on-screen, 360-degree **joystick** to fly both horizontally and vertically. Keyboard **WASD** and arrow keys also work.
- **Survive:** Asteroids enter from all **four edges**, not just above. Your ship automatically turns and shoots at the nearest asteroid.
- **Damage:** A short grace period after a hit prevents losing multiple lives from a single cluster.

## 📶 Bluetooth multiplayer (Android)

**New in v2.2.3:** The Android application has a native **Bluetooth Classic RFCOMM** transport. This is **real phone-to-phone communication**; the browser version intentionally does not support Bluetooth Classic.

**Supported across phones:**
- **8-Ball Pool:** Two players. Moves, cue-ball placement and match state are exchanged, with the host correcting the settled table state after each shot.
- **Tic-Tac-Toe and Checkers:** Two players. The app sends validated turns/moves and synchronises new rounds.
- **Card games:** Crazy Eights, Go Fish, Memory Match, Snap, Rummy, Spades and Card Battle. One host and up to **three guest phones** (depending on each game's player limit). The host owns the game state and shares only each player's own private hand. Unfilled seats can be handled by CPUs.
- **Solitaire and arcade reaction games:** Remain single-player. These games do not have remote multiplayer modes.

### Connect two Android phones

1. Install **the same v2.2.3 testing APK** on both Android phones. Enable Bluetooth on both.
2. On the first phone, open a supported game → **Nearby Bluetooth** → **Host a game**. Accept Android's *Nearby devices* permission and the **discoverable** prompt.
3. On the second phone, open the same game → **Nearby Bluetooth** → **Join a game**. Give Android Nearby devices or Location permission if prompted. The host should appear in the device list; tap it.
4. Accept any Android **Bluetooth pairing request / matching code** on both phones. Card games let the host choose when to start. Pool and board games begin when the connection succeeds.
5. Play normally. The game uses the local Bluetooth connection, not the internet. If a device disconnects, the games provide an error/exit state; the card host can replace a disconnected player with a CPU.

For Android 6–11, discovery requires the **Location permission** and sometimes Location enabled at system level. On Android 12+, use the **Nearby devices** permission. If the friend is absent from search, confirm that the host is still discoverable, the devices are within Bluetooth range, and both can see each other in Android's Bluetooth settings.

**Limits:** Two-device pool and board games, and up to four phones for eligible card modes. Bluetooth Classic requires Android devices and supported hardware. No online matchmaking, Wi-Fi relay, iOS connectivity, voice chat or Bluetooth mode for single-player arcade games. This is a **testing build**: cross-device behaviour still requires validation on real phones, despite successful compilation.

## 📦 Android CPU architectures

**One universal APK supports ARM32 (`armeabi-v7a`), ARM64 (`arm64-v8a`), x86 and x86-64.** These are not separate downloads because the app currently contains HTML, JavaScript and Android framework code without architecture-specific native `.so` files.

| Architecture | APK |
|:--|:--|
| ARM32 / `armeabi-v7a` | Universal APK |
| ARM64 / `arm64-v8a` | Universal APK |
| Intel / `x86` | Universal APK |
| Intel / `x86_64` | Universal APK |

Requires **Android 6.0 (API 23) or later**, and a functional Android System WebView. Support for an instruction set does not guarantee every device's WebView runs the games identically. If native libraries are added in future, this packaging will need reviewing.

## 🚀 Android installation

> **Current release:** [AAC Playroom v2.2.3](https://github.com/billyke2000s/Free-multiplayer-Games-launcher-/releases/tag/v2.2.3) — **testing / pre-release**.

1. Open the **[APK download](https://github.com/billyke2000s/Free-multiplayer-Games-launcher-/releases/download/v2.2.3/AAC-Playroom-v2.2.3-universal-debug.apk)** on your Android device.
2. Download the `AAC-Playroom-v2.2.3-universal-debug.apk` file.
3. Allow your browser or file manager to install apps from that source when Android prompts you.
4. Install and launch **Playroom**.

The universal APK is **debug-signed** for testing, not a production-signed Play Store release. Existing installations signed with another key may need to be uninstalled first (which can remove locally saved game data). This is a **private repository**, so GitHub links may require a signed-in account with access.

## 💻 Run the browser version

The web game is contained in **[index.html](index.html)**. To play locally, download the repository and run a small local server.

**Requirements:** Node.js for the check/build scripts, and Python 3 for the included development server.

```bash
git clone https://github.com/billyke2000s/Free-multiplayer-Games-launcher-.git
cd Free-multiplayer-Games-launcher-
npm run check
npm start
```

Then open **http://localhost:8080**. The single HTML file can also be opened directly in many browsers. A browser's address bar and system navigation remain controlled by the browser/OS.

## 🧰 Develop & build

| Command | Purpose |
|:--|:--|
| `npm start` | Serve the games on `localhost:8080` |
| `npm run check` | Check embedded JavaScript syntax and basic structural invariants |
| `npm run build` | Copy the web page into `dist/` and Android bundled assets |
| `gradle -p android assembleDebug` | Build a debug Android APK after `npm run build` |

Android builds require **JDK 17**, **Android SDK 35** and a compatible Gradle installation. GitHub Actions performs those steps automatically on code pushes and workflow dispatches.

```text
.
├── index.html                         # Single-file, offline-friendly game launcher
├── package.json                       # Development commands and version
├── scripts/
│   ├── check.mjs                      # Lightweight checks
│   └── build.mjs                      # Web + Android asset packaging
├── android/                            # WebView wrapper + native Bluetooth Classic RFCOMM bridge
├── .github/workflows/android.yml      # APK build and GitHub Release publishing
├── CHANGELOG.md                        # Release history
└── CONTRIBUTING.md                     # Development guidance
```

## ✅ What works / 🚧 what's next

| Feature | Status |
|:--|:--|
| 16 bundled, offline game screens | ✅ Included |
| CPU and supported same-device play modes | ✅ Implemented |
| Portrait / landscape presentation | ✅ Implemented; device validation ongoing |
| Android debug APK on GitHub Releases | ✅ Available |
| Bluetooth Classic native host, discovery and pairing | ✅ Implemented; real-device connection testing required |
| Bluetooth multiplayer for pool, two board games and seven card games | ✅ Implemented in source; two-phone validation pending |
| Fully verified game rules and physics on physical devices | 🧪 Further testing needed |
| Public hosted browser game / GitHub Pages | ⏳ Not configured |

> **Important:** This is a playable test build, not a claim that every game is bug-free. If you find a gameplay, layout or back-button issue, please [open an issue](https://github.com/billyke2000s/Free-multiplayer-Games-launcher-/issues/new/choose) with the game, device, orientation and reproduction steps.

## 📚 Project information

- **[Releases & APKs](https://github.com/billyke2000s/Free-multiplayer-Games-launcher-/releases)** — versioned downloads and notes.
- **[Build history](https://github.com/billyke2000s/Free-multiplayer-Games-launcher-/actions/workflows/android.yml)** — APK compilation and release publishing.
- **[Changelog](CHANGELOG.md)** — what changed between versions.
- **[Contributing](CONTRIBUTING.md)** — how to test, report issues and contribute.
- **[Issues](https://github.com/billyke2000s/Free-multiplayer-Games-launcher-/issues)** — bugs, ideas and feature requests.

## 📄 Licence & attribution

A public software licence has **not** been added to this repository. Do not assume code or artwork is available for unrestricted redistribution. If the project is made public, choose a licence and review the third-party asset attributions first.

---

<div align="center">
  <strong>🎮 PLAYROOM</strong><br/>
  <sub>Pick a game. Share the screen. Have fun.</sub><br/><br/>
  <a href="https://github.com/billyke2000s/Free-multiplayer-Games-launcher-/releases/tag/v2.2.3">Download v2.2.3</a>
  ·
  <a href="https://github.com/billyke2000s/Free-multiplayer-Games-launcher-/issues">Report an issue</a>
</div>
