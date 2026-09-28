# IRLOS Cloud // Subscriber Dashboard

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-00d4ff.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![IRLOS](https://img.shields.io/badge/IRLOS-Ecosystem-08080a?logo=linux&logoColor=white)](https://irlos.live)

A standalone, mobile-first frontend control dashboard designed for subscribers of **IRLOS Cloud** ($30/mo managed IRL streaming server).

This dashboard strictly inverts the visual design tokens of [irlos.live](https://irlos.live)—swapping the obsidian black canvas for a high-contrast warm bone/white paper palette with crisp 1px borders (`#2e2e31`), electric cyan (`#00d4ff`) accents, phosphor green (`#4ade80`) live LEDs, and `JetBrains Mono` typography.

---

## Quick Start (Run & Test Locally)

Anyone can clone and run this dashboard locally in under a minute:

```bash
# 1. Clone the repository
git clone https://github.com/Joystickxs/irlos-cloud-dashboard.git

# 2. Enter directory
cd irlos-cloud-dashboard

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

Open **`http://localhost:3000`** in your browser.

> [!TIP]
> **Mobile Testing**: Over 85% of IRL streamers operate their cloud server from a secondary phone while walking outside. Open Chrome/Safari DevTools, toggle Device Toolbar (`Ctrl+Shift+M` or `Cmd+Shift+M`), and test on an **iPhone 14 Pro** or **Pixel 7** viewport.

---

## Core Subscriber Modules

### 1. "Go Live" Ingest Details (`IngestDetailsCard.tsx`)
* **Dedicated SRT Endpoint**: Displays `srt://ingest.irlos.live:9000` with 1-click tactile copy button.
* **Stream ID / Key**: Masked/unmasked toggle with single-tap copy.
* **Instant QR Code Modal**: Click **"SCAN QR CODE"** to render a camera-scannable QR code formatted for 1-second auto-import in **Larix Broadcaster** and **IRL Pro**.
* **Quick Connection Guides**: Collapsible accordions with step-by-step setup guides for Larix, IRL Pro, OBS Studio, and the IRLOS Backpack.

### 2. Live Telemetry & Ingest Health (`TelemetryCard.tsx`)
* **Real-time Live Ticker**:
  - Input Bitrate (kbps) with dynamic color thresholds (Green > 4000, Amber 2000-4000, Red < 2000).
  - Round Trip Time (RTT in ms).
  - Dropped frames & loss percentage.
  - Live session uptime timer (`HH:MM:SS`).
* **60-Second Rolling Sparkline Chart**: Live SVG telemetry graph showing signal stability and indicating the NOALBS automatic cutoff line.
* **Split Diagnostics**: Distinct health metrics for **Ingest Uplink** (carrier modem -> cloud SLS) vs. **Egress Broadcast** (cloud OBS -> Kick/Twitch/YouTube/TikTok).

### 3. Studio Scene Switcher & Emergency Controls (`SceneSwitcherCard.tsx`)
* **Tactile Scene Triggers**:
  - `[ LIVE CAM ]` (Main camera feed)
  - `[ STANDBY / BRB ]` (Low bitrate fallback)
  - `[ GPS MAP ]` (Geotracker overlay)
  - `[ OFFLINE ]` (Standby card)
* **Program Canvas Preview**: 1 FPS low-bandwidth canvas preview monitor simulating what viewers see on stream.
* **Emergency Panic Cut Button**: High-visibility safety button that instantly cuts video and mutes audio with 1 click.
* **Stream Power Toggle**: Safe double-tap `START STREAM` / `STOP STREAM` control.

### 4. Restream Destinations (`RestreamCard.tsx`)
* **Multi-Target RTMP Relay**: Independent toggles and key management for:
  - **Kick.com**
  - **Twitch**
  - **YouTube Live**
  - **Custom RTMP** (TikTok, X, etc.)
* **Live Synchronized Egress**: Active restream targets dynamically synchronize to the Overview card in real time.
* **Masked Security**: Platform keys are masked with reveal/hide controls and inline editing.

### 5. NOALBS Bitrate Recovery Settings (`NoalbsSettingsCard.tsx`)
* **Live Signal Gauge**: Visual multi-tier meter showing current live bitrate relative to cutoff points.
* **Custom Cutoff Sliders**:
  - Low-Bitrate Cutoff Threshold (Default: 2000 kbps).
  - Stream Offline Threshold (Default: 500 kbps).
  - Recovery Delay / Hysteresis Buffer (Default: 4 seconds).
* **Target Scene Mapping**: Dropdown mapping for Normal, Low, and Offline scenes.
* **Test Signal Drop**: Click **"TEST CELL DROP"** in the top ribbon to simulate a sudden signal drop and watch NOALBS auto-switch to BRB!

### 6. Integrated Kick Chat Reader (`ChatReaderCard.tsx`)
* **Web Audio Player**: Embedded HTML5 audio monitor streaming your Kick TTS reader directly into your Bluetooth earbud.
* **Controls**: Volume slider, instant Mute/Unmute, and live audio VU spectrum bars.
* **Moderator Commands Cheatsheet**: Copyable chat commands (`!brb`, `!live`, `!bitrate`, `!fixaudio`, `!stats`).

### 7. Subscription & Server Management (`ServerManagementCard.tsx`)
* **Cloud Instance Specs**: GPU (GTX 1650 NVENC), Host IP, Region (US-East), Uptime.
* **Stream Stack Actions**:
  - "Restart Stream Stack" (`systemctl restart irlos-session`).
  - "Reboot VM" with safety confirmation.
* **Browser Studio (noVNC)**: Secure popup to open your cloud OBS GUI in the browser.
* **Stripe Customer Portal**: Direct deep link to Stripe for managing billing, downloading VAT invoices, and updating cards.

---

## Production Build & Deployment

To compile the application into a static distribution bundle for hosting on Cloudflare Pages, Vercel, Netlify, or self-hosted Nginx:

```bash
npm run build
```

This compiles optimized HTML, JS, and CSS files into the `dist/` folder.

---

## Design System & Color Tokens

| Token | Exact Hex | Role in Dashboard |
| :--- | :--- | :--- |
| Canvas Background | `#e8e4da` | Warm bone/cream canvas (from `irlos.live` text) |
| Elevated Cards | `#ffffff` | Crisp white card surface |
| Primary Text & Ink | `#08080a` | Pitch black headers & borders (from `irlos.live` bg) |
| Electric Cyan | `#00d4ff` | Primary highlight, buttons, active scene rings |
| Phosphor Green | `#4ade80` | Live pulsing LEDs, optimal telemetry |
| Border Rules | `#2e2e31` | 1px precision hardware boundary lines |

---

## License & Philosophy

This project is licensed under the **GNU General Public License v3.0 (GPL-3.0)** in accordance with the open core philosophy of [IRLOS](https://irlos.live) created by Ethan Manners. 

You are free to run, copy, modify, distribute, and build commercial services on top of this software.
# irlos-cloud-dashboard
