# Pittsburgh Lenten Fish Fry Map

The Pittsburgh Lenten Fish Fry Map is the brainchild of Hollen Barmer, who has tirelessly dedicated her time since 2012 inventorying the rich array of Lenten Fish Fry events that occur every spring in Western Pennsylvania. Friends of Fish Fries help with website development, hosting, and data maintenance!

## Where Does the Fish Fry data shown on the map come from?

The raw data isn't here! That is by design. The map gets data from the Fish Fry API @ [fishfry.codeforpgh.com/api/fishfries](http://fishfry.codeforpgh.com/api/fishfries). Anyone can use that URL to get data to make their own fish fry map, or do things with the Fish Fry data that we haven't thought of. If you want to learn more about the database and API, head over to the [Fish Fry Form](https://github.com/CodeForPittsburgh/fishfryform) repository.

Occassional snapshots of the data are kept in `public/data` for local fallback and posterity.

## Developer Quickstart

### Prerequisites

- Node.js `22.x` (matches CI)
- npm `10+`

### 1) Install dependencies

```bash
npm ci
```

### 2) Configure environment

Create a local env file:

```bash
cp .env.example .env
```

Current variables:

- `VITE_FISHFRY_API_URL=https://data.pghfishfry.org/api/fishfries/`
- `VITE_FISHFRY_FALLBACK_URL=/data/fishfrymap.geojson`
- `VITE_MAPBOX_TOKEN=` (optional, enables Mapbox geocoding suggestions)
- `VITE_CLIENT_ERROR_DSN=` (optional, client-side error reporting target)
- `VITE_CLIENT_ERROR_SAMPLE_RATE=1` (`0..1`)

### 3) Start local development server

```bash
npm run dev
```

App runs at `http://localhost:5173`.

### 4) Run tests

Unit tests:

```bash
npm run test:unit
```

Playwright parity tests (first-time setup):

```bash
npx playwright install --with-deps chromium
npm run test:parity
```

Run all tests:

```bash
npm test
```

### 5) Build and preview production bundle

```bash
npm run build
npm run preview
```

`npm run build` outputs to `dist/`.

## Scripts

- `npm run dev` starts Vite dev server
- `npm run build` builds production bundle
- `npm run preview` serves the production bundle
- `npm run test:unit` runs Vitest unit tests
- `npm run test:parity` runs Playwright parity tests
- `npm test` runs both suites

## Project Layout

- `src/` app source code
- `src/features/` UI and map features
- `src/store/` Redux Toolkit slices and APIs
- `src/domain/` shared business logic (filters, date logic, normalization)
- `src/styles/` app styles and theme overrides
- `public/data/fishfrymap.geojson` fallback dataset used when API is unavailable

## Theming

- Base theme: `bootswatch/dist/darkly/bootstrap.min.css` (imported in `src/main.jsx`)
- Brand overrides: `src/styles/theme-overrides.css`
- App-level custom styles: `src/styles/app.css`

Primary brand color is set to `#fcb82e` in `src/styles/theme-overrides.css`.

## Data Source

Map data is fetched from:

- `https://data.pghfishfry.org/api/fishfries/`

If the primary API is unavailable, the app falls back to:

- `/data/fishfrymap.geojson`

If you want to learn more about the API and curation tooling, see:

- [CodeForPittsburgh/fishfryform](https://github.com/CodeForPittsburgh/fishfryform)

## Deployment

`npm run deploy` will run the build script and deploy the compiled site to GitHub pages.

## Credits

The Fish Fry Map is built and maintained by members of Code for Pittsburgh.

### Basemaps

- **Light** and **Dark** basemaps: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CARTO</a>, &copy; <a href="https://www.mapbox.com">Mapbox</a>

### Icons

Church and Warehouse icons come from &copy; Mapbox.
