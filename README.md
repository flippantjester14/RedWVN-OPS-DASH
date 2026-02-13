# REDWING OPERATIONS DASHBOARD (RedWVN-OPS-DASH)

The Redwing Operations Dashboard is an advanced flight operations platform tailored for the Redwing Labs network in the Andhra Pradesh (Paderu-Araku Corridor). This application provides real-time monitoring, analytics, and fleet management for drone-based logistics.

---

## Features

### 1. Overview Dashboard

* **High-level KPIs**: Total Flights, Distance Flown, Flight Time, and Payload Moved.
* **Activity Tracking**: Daily Flight Activity charts and Top Routes analysis.
* **Personnel**: Pilot Leaderboard tracking flight counts and airtime.
* **Node Operations**: Statistics for Takeoffs, Landings, and Deliveries.
* **Live Feed**: Recent Flights table for immediate situational awareness.

### 2. Medical Operations

* **Payload Tracking**: Dedicated monitoring for medical-specific deliveries.
* **Volume Metrics**: Statistics on Medical Deliveries and total Payload Delivered.
* **Logistics**: Daily Medical Volume charts and Delivery Route breakdowns.
* **Audit Trail**: Detailed Medical Delivery Log.

### 3. System Analytics

* **Landing Accuracy**: Precision Landing performance metrics (On Marker vs. Off Marker).
* **Script Performance**: LFAO (Low Flight Altitude Operations) script performance stats.
* **Operational Trends**: Distance Covered Per Day and Detection Altitude Records.
* **Categorization**: Comparative analysis of Test vs. Live Flights.

### 4. Fleet Management

* **Visual Tracking**: Integrated Fleet Map for real-time UAV positioning.
* **Status Monitoring**: Individual UAV Status Cards (Active/Standby).
* **Individual Metrics**: Per-UAV tracking for Flights, Distance, Airtime, and Payload.
* **Maintenance History**: Detailed flight history for every aircraft in the fleet.

### 5. Data & Filters

* **Temporal Filtering**: View data by Daily, Weekly, or All Time intervals.
* **Live Sync**: Real-time data synchronization via polling.
* **Searchable Archive**: Complete, searchable Flight Log for historical review.

### 6. Technical & UI

* **Performance**: Built with React and Vite.
* **Responsive**: Mobile-friendly navigation and adaptive layouts.
* **UX**: Smooth UI transitions powered by Framer Motion.
* **Geospatial**: Map visualizations using Leaflet and React-Leaflet.

---

## Installation & Setup

### Prerequisites

* Node.js (v18 or higher recommended)
* npm (Node Package Manager)

### Step-by-Step Guide

1. **Clone the repository** to your local machine.
2. **Navigate to the project directory**:
```bash
cd d:\RedWVN-OPS-DASH

```


3. **Install dependencies**:
```bash
npm install

```


4. **Run the development server**:
```bash
npm run dev

```


The application will be accessible at `http://localhost:5173` (or the port specified in your terminal).

---

## Production & Quality Control

### Building for Production

To create a production-ready build:

```bash
npm run build

```

### Preview Production Build

To preview the production build locally:

```bash
npm run preview

```

### Linting

To run code quality checks (ESLint):

```bash
npm run lint

```

---

## Project Structure

| Directory/File | Description |
| --- | --- |
| `src/assets/` | Images and static assets |
| `src/components/` | UI components (FleetMap, UI widgets, etc.) |
| `src/data/` | Data fetching and simulation logic (flights.js) |
| `src/App.jsx` | Main application logic and layout |
| `src/App.css` | Global styles and theming |
| `src/main.jsx` | Entry point |

---

## Dependencies

* **Core**: React, React DOM, Vite
* **Animation**: Framer Motion
* **Mapping**: Leaflet, React-Leaflet
* **Data Parsing**: Papaparse (for CSV integration)

Would you like me to generate a `package.json` file based on these requirements?
