# Pittsburgh Lenten Fish Fry Map

The Pittsburgh Lenten Fish Fry Map is the brainchild of Hollen Barmer, who has tirelessly dedicated her time since 2012 inventorying the rich array of Lenten Fish Fry events that occur every spring in Western Pennsylvania. Friends of Fish Fries help with website development, hosting, and data maintenance!

## Where Does the Fish Fry data shown on the map come from?

The raw data isn't here! That is by design. The map gets data from the Fish Fry API @ [fishfry.codeforpgh.com/api/fishfries](http://fishfry.codeforpgh.com/api/fishfries). Anyone can use that URL to get data to make their own fish fry map, or do things with the Fish Fry data that we haven't thought of. If you want to learn more about the database and API, head over to the [Fish Fry Form](https://github.com/CodeForPittsburgh/fishfryform) repository.

Occassional snapshots of the data are kept in `public/data` for local fallback and posterity.

## Development

This is a static web site. We're serving it up with GitHub pages, but it can run on any web server as-is, really.

### Prerequisites

To develop this, you have [NodeJS](https://nodejs.org/en/) installed, such that you can call `node` and `npm` from the command line.

Then, in the root of this directory, run:

`npm install`

This will use the `package.json` file to get and install NodeJS dependencies locally, in a `node_modules` folder.

### Building and Watching (React/Vite)

The primary app now runs with Vite + React.

We run those tasks with `npm` scripts.

Running `npm run dev` will start Vite at [http://localhost:5173](http://localhost:5173).

Running `npm run build` will create a production build in `dist/`.

Running `npm run preview` will serve the built app for smoke testing.

### Testing

- `npm run test:unit` runs unit tests for extracted domain logic.
- `npm run test:parity` runs Playwright parity tests.
- `npm run test` runs both unit and parity suites.

### Environment variables

Copy `.env.example` to `.env` and set:

- `VITE_FISHFRY_API_URL` for the primary data API
- `VITE_FISHFRY_FALLBACK_URL` for local fallback GeoJSON
- `VITE_MAPBOX_TOKEN` for geocoding suggestions
- `VITE_CLIENT_ERROR_DSN` for client-side error reporting endpoint
- `VITE_CLIENT_ERROR_SAMPLE_RATE` between `0` and `1` (default `1`)

### Where the functionality lives / where you can hack on the code

React app source lives in `src`.
Use `@/` import aliases for app modules (for example `@/features/map/MapView`), and central style entry is `src/styles/index.css`.

### Deploying this Site

Run `npm run build`, commit changes, and push as-is to GitHub to deploy.

## Credits

The Fish Fry Map is built and maintained by members of Code for Pittsburgh.

### Basemaps

Our nice basemaps come from all over!

* **Light** and **Dark** basemaps: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CARTO</a>
* **Black n' Gold** basemap: Map tiles from <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> license. Basemap data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a> license.

### Icons

Church and Warehouse icons come from © Mapbox.
