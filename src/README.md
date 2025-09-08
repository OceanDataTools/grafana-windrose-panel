# Windrose Panel

![Dynamic JSON Badge](https://img.shields.io/badge/dynamic/json?logo=grafana&query=$.version&url=https://grafana.com/api/plugins/grafana-windrose-panel&label=Marketplace&prefix=v&color=F47A20)
[![License](https://img.shields.io/github/license/OceanDataTools/grafana-windrose-panel)](LICENSE)

## Overview / Introduction

**Windrose** is a Grafana visualization plugin for displaying heading or orientation data on a windrose dial.  
It is especially useful for ship navigation, robotics, UAVs, or any time-series data representing direction in degrees (0–360).

![Windrose Example](https://raw.githubusercontent.com/OceanDataTools/grafana-windrose-panel/main/src/screenshots/windrose-with-needle.png)

---

## Features

- Smoothly animated windrose dial that displays ship heading, true wind direction and apparent wind direction.
- Multiple **needle types**:
  - **Ship Outline**: minimal ship silhouette pointing forward.
  - **Custom SVG**: load your own vector as a needle.
  - **Custom PNG**: load your own bitmap as a needle.
- Optional numeric heading and direction readouts (e.g. `273°`).
- Cardinal direction labels (N/E/S/W).
- Configurable colors for bezel, dial, text, needle, truewind indicator, apparent wind indicator.
- Minor and major tick marks for easy orientation.

---

## Getting Started

1. Install the plugin by copying it into Grafana’s plugin directory or installing from the Grafana Marketplace.
2. Restart Grafana.
3. Add a new panel and select **Windrose** as the visualization.
4. Configure the data source and select the field representing **heading** (0–360 degrees).

---

## Options

### Data Options

- **Heading Field**: Select the numeric field in your series that represents heading in degrees.
- **Truewind Field**: Select the numeric field in your series that represents truewind direction in degrees.
- **Apparent wind Field**: Select the numeric field in your series that represents apparent wind direction in degrees.

### Display Options

- **Show Labels**: Toggle cardinal direction labels (N/E/S/W).
- **Show Numeric Heading**: Display a numeric degree readout below the windrose.

### Needle Options

- **Needle Type**

  - `Ship Outine` – simplified ship silhouette (points to heading)
  - `SVG` – load a custom vector (provide URL or relative path)
  - `PNG` – load a custom image (provide URL or relative path)

- **Ship Color**: Color of the ship silhouette.
- **Custom SVG**: Path/URL to your own SVG asset.
- **Custom PNG**: Path/URL to your own PNG asset.

### Orientation Mode

- **North Up**: Dial retains a North up orientation with the needle and wind indicators rotating
- **Bow Up**: Needle fixed in a vertical orientation with the dial and wind indicators rotating

### Colors

- **Dial Color** – background of windrose dial.
- **Bezel Color** – outer rim.
- **Text Color** – labels, ticks, numeric heading.
- **True Wind Color** – true wind direction indicator.
- **Apparent Wind Color** – apparent wind direction indicator.

---

## Screenshots

![North Up Orientation](https://raw.githubusercontent.com/OceanDataTools/grafana-windrose-panel/main/src/screenshots/windrose-north-up.png)

_North up orientation for windrose visualization_

![Custom Styling](https://raw.githubusercontent.com/OceanDataTools/grafana-windrose-panel/main/src/screenshots/windrose-bow-up.png)

_Bow up orientation for windrose visualization_
