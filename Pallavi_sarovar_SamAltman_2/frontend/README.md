# CareSync — Hospital Management Portal Frontend

CareSync is an enterprise healthcare and bed availability management web portal built with React 18, Vite, Lucide Icons, and Tailwind CSS. It communicates seamlessly with the Hospital Management Express API.

## Features

- **Real-Time System Metrics Dashboard**: Live monitoring of active facilities, bed capacity, available beds, and occupancy percentage.
- **Hospital Directory Management**:
  - Search facilities by name or city.
  - Filter by bed availability status (*All Facilities*, *Beds Available*, *Fully Occupied*).
  - Toggle between **Grid Cards View** and structured **Table View**.
  - Interactive `+1` / `-1` quick patient admission & discharge bed capacity controls.
- **Facility Registration & Editing**: Modals for registering new hospitals or updating existing specs with live capacity validation.
- **Authentication Portal**: Integrated user registration and login drawer.
- **Fallback Demo Mode**: Graceful fallback data handling if backend database or server is offline.

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

```bash
npm install
```

### Running Locally

```bash
npm run dev
```

The Vite dev server will launch at `http://localhost:5173`.

### Production Build

```bash
npm run build
```

The output bundle will be generated in the `dist/` directory.

## Backend Connection

This frontend is configured to communicate with the Express API running on `http://localhost:4000` (or `http://localhost:5000`) with credentials enabled (`credentials: 'include'`).
