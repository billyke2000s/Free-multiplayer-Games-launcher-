<div align="center">

# 🎮 AAC Playroom

### One launcher. Sixteen games. No internet required.

**A touchscreen-first collection of arcade, board and card games for Android and the browser.**  
Made for quick games, family play and accessible, straightforward controls.

[![Version](https://img.shields.io/badge/version-2.0.0-6C63FF?style=for-the-badge)](https://github.com/billyke2000s/Free-multiplayer-Games-launcher-/releases/tag/v2.0.0)
[![Games](https://img.shields.io/badge/games-16-28B99A?style=for-the-badge)](#the-game-library)
[![Android](https://img.shields.io/badge/Android-6%2B-3DDC84?style=for-the-badge&logo=android&logoColor=black)](#android-installation)
[![Offline](https://img.shields.io/badge/play-offline-1F2937?style=for-the-badge)](#what-it-does)

[![Android build](https://github.com/billyke2000s/Free-multiplayer-Games-launcher-/actions/workflows/android.yml/badge.svg?branch=main)](https://github.com/billyke2000s/Free-multiplayer-Games-launcher-/actions/workflows/android.yml)
[![Release](https://img.shields.io/badge/release-testing%20APK-E0A449)](https://github.com/billyke2000s/Free-multiplayer-Games-launcher-/releases/tag/v2.0.0)
[![JavaScript](https://img.shields.io/badge/engine-HTML5%20%2B%20JavaScript-F7DF1E?logo=javascript&logoColor=black)](index.html)

**[⬇ Download Android APK](https://github.com/billyke2000s/Free-multiplayer-Games-launcher-/releases/download/v2.0.0/AAC-Playroom-v2.0.0-debug.apk)**
&nbsp;·&nbsp;
**[📦 Release page](https://github.com/billyke2000s/Free-multiplayer-Games-launcher-/releases/tag/v2.0.0)**
&nbsp;·&nbsp;
**[🌐 Web-app source](index.html)**
&nbsp;·&nbsp;
**[🔧 Builds](https://github.com/billyke2000s/Free-multiplayer-Games-launcher-/actions/workflows/android.yml)**

<sub>Note: “Web-app source” opens the HTML file on GitHub, not a hosted playable website. GitHub Pages is not enabled for this private repository.</sub>

</div>

---

## ✨ At a glance

<table>
  <tr>
    <td align="center" width="33%"><strong>🕹️ 16 games</strong><br/><sub>1 pool · 7 arcade/board · 8 card games</sub></td>
    <td align="center" width="33%"><strong>📱 Android 6+</strong><br/><sub>Portrait and landscape support</sub></td>
    <td align="center" width="33%"><strong>📶 Offline-first</strong><br/><sub>Bundled game code and assets</sub></td>
  </tr>
  <tr>
    <td align="center"><strong>👥 Local play</strong><br/><sub>Same-device modes and CPU opponents</sub></td>
    <td align="center"><strong>🃏 SVG cards</strong><br/><sub>Vector card faces and backs</sub></td>
    <td align="center"><strong>🔖 v2.0.0</strong><br/><sub>Debug-signed testing release</sub></td>
  </tr>
</table>

## 🎲 The game library

<table>
  <tr>
    <td width="50%" valign="top">
      <h3>🎱 Pool</h3>
      <strong>8-Ball Pool</strong><br/>
      Practice, CPU opponents, shot power, spin, pockets and local multiplayer/team modes.
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

## 🚀 Android installation

> **Current release:** [AAC Playroom v2.0.0](https://github.com/billyke2000s/Free-multiplayer-Games-launcher-/releases/tag/v2.0.0) — **testing / pre-release**.

1. Open the **[APK download](https://github.com/billyke2000s/Free-multiplayer-Games-launcher-/releases/download/v2.0.0/AAC-Playroom-v2.0.0-debug.apk)** on your Android device.
2. Download the `AAC-Playroom-v2.0.0-debug.apk` file.
3. Allow your browser or file manager to install apps from that source when Android prompts you.
4. Install and launch **Playroom**.

The APK is **debug-signed** for testing, not a production-signed Play Store release. Existing installations signed with another key may need to be uninstalled first (which can remove locally saved game data). This is a **private repository**, so GitHub links may require a signed-in account with access.

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
├── android/                            # Native WebView Android wrapper
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
| Real phone-to-phone Bluetooth multiplayer | 🚧 **Not implemented in the Android wrapper** |
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
  <a href="https://github.com/billyke2000s/Free-multiplayer-Games-launcher-/releases/tag/v2.0.0">Download v2.0.0</a>
  ·
  <a href="https://github.com/billyke2000s/Free-multiplayer-Games-launcher-/issues">Report an issue</a>
</div>
