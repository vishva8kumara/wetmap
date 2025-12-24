# Rain Map — Interactive Weather Visualization

A lightweight, browser‑based weather visualization that overlays forecast data on a relief map. This project focuses on **perceptual data encoding**—using size, color, opacity, brightness, and motion to communicate multiple weather dimensions at once.

Designed as a weekend exploration into data‑driven UI, mobile layout behavior, and visual clarity rather than a production weather app.

---

## ✨ Features

- **Interactive time slider**
  - 5‑day forecast, 3‑hour steps
  - Play / pause animation

- **Visual encodings**
  - **Rain risk** → circle diameter (log‑scaled)
  - **Rain probability** → circle opacity
  - **Temperature** → color hue (cool → warm)
  - **Cloudiness** → brightness / darkness
  - **Wind direction** → arrow rotation
  - **Wind speed** → arrow scale

- **Responsive layout**
  - Scales correctly across desktop and mobile
  - Maintains aspect ratio of the underlying relief map

- **Minimal dependencies**
  - Pure HTML, CSS, and vanilla JavaScript
  - No frameworks

---

## 🗺 Legend

| Visual Element | Meaning |
|--------------|---------|
| Circle size | Rain risk (log scale) |
| Circle opacity | Rain probability |
| Circle color | Temperature |
| Circle brightness | Cloudiness |
| Arrow direction | Wind direction |
| Arrow size | Wind speed (m/s) |

---

## 📂 Project Structure

```text
.
├── index.html        # Application shell
├── script.js         # Rendering, animation, and data logic
├── style.css         # Layout and visual styling
├── arc.js            # Small DOM helper utilities
├── relief_map.svg    # Background relief map
```

---

## 🔌 Data Source

Weather data is fetched dynamically from:

```
https://wet.info.lk/data/ow/jsx/api.php
```

The API returns:
- City metadata (lat/lon)
- Time‑indexed forecast slices
- Rain risk & probability
- Wind speed (m/s) & direction
- Temperature (°C)
- Cloud cover

> **Note:** HTTPS is required when opening locally due to modern browser CORS and mixed‑content rules.

---

## 🚀 Running Locally

Because this project uses `fetch()`, it must be served over HTTP/HTTPS.

### Quick local server (recommended)

```bash
python3 -m http.server 8000
```
or

```bash
php -S localhost:8000
```

Then open:

```
http://localhost:8000
```

Opening the file directly via `file://` may cause CORS or fetch failures in some browsers.

---

## 📱 Mobile Notes

- Tested in mobile browsers and Android WebView
- Layout dynamically recalculates map scale on resize/orientation change
- Legend can be toggled to save screen space

---

## 🎯 Design Goals

- Explore **how much information can be conveyed without labels**
- Favor **visual intuition over raw numbers**
- Keep the code small, readable, and hackable

This is intentionally not a framework‑heavy or production‑oriented app.

---

## 🧠 Implementation Notes

- Rain size uses logarithmic scaling to prevent large values from dominating
- Opacity includes a baseline to keep low‑probability events visible
- Wind arrows use CSS transforms for cheap animation
- Old DOM nodes are reused to avoid unnecessary churn

---

## 📄 License

MIT — use, fork, and modify freely.

---

## 👋 Author

Built as a personal exploration into data visualization and UI clarity.

Feedback and discussion are welcome.

