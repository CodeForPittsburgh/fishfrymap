# Pittsburgh Lenten Fish Fry Map
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FCodeForPittsburgh%2Ffishfrymap.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FCodeForPittsburgh%2Ffishfrymap?ref=badge_shield)


The Pittsburgh Lenten Fish Fry Map is the brainchild of [Hollen Barmer](https://twitter.com/hollenbarmer), who has tirelessly dedicated her time since 2012 inventorying the rich array of Lenten Fish Fry events that occur every spring in Western Pennsylvania. Code for Pittsburgh helps with website development, hosting, and data maintenance!

## Where Does the Fish Fry data shown on the map come from?

The raw data isn't here! That is by design. The map gets data from the Fish Fry API @ [fishfry.codeforpgh.com/api/fishfries](http://fishfry.codeforpgh.com/api/fishfries). Anyone can use that URL to get data to make their own fish fry map, or do things with the Fish Fry data that we haven't thought of. If you want to learn more about the database and API, head over to the [Fish Fry Form](https://github.com/CodeForPittsburgh/fishfryform) repository.

Occassional snapshots of the data from are being dumped into the `data` folder of this repo, but only for posterity.

## Development

This is a static web site. We're serving it up with GitHub pages, but it can run on any web server as-is, really.

### Prerequisites

To develop this, you have [NodeJS](https://nodejs.org/en/) installed, such that you can call `node` and `npm` from the command line.

Then, in the root of this directory, run:

`npm install`

This will use the `package.json` file to get and install NodeJS dependencies locally, in a `node_modules` folder.

You will also need these things (available on [NPM](https://www.npmjs.com)):

* [GulpJS](https://www.npmjs.com/package/gulp), with `gulp` callable from the command line. Install with `npm install gulp@4.0 -g`
* [Http-Server](https://www.npmjs.com/package/http-server), with `http-server` callable from the command line. Install with: `npm install http-server -g`

Those two things need to be available globally. the `-g` flag in those commands makes sure of that.

### Building and Watching

GulpJS is a task-runner that compiles and bundles source code from `src` folder into the `assets` folder. Since the deployment path for this is GitHub pages, we put things into the `assets` folder, which is where Jekyll, the software that runs GitHub pages, expects those things to be.

Running `gulp build` will compile and bundle the source code one time.

Running `gulp watch` will do that, plus run `http-server`, open the site in a web browser at [http://localhost:3000](http://localhost:3000), and, upon detecting changes to files in `src`, re-runs compiling/bundling and refreshes your browser. Nice!

If the site doesn't load after `gulp watch`, check [http://localhost:4000](http://localhost:4000) in your browser. This is where `http-server` lives. If you don't see anything there, make sure you can run `http-server` from the command line (see **prerequisites** above).

### Where the functionality lives / where you can hack on the code

Most of the work is happening in `src/js/app.js`. The rest happens in `index.html`. Be warned: it's a bit of a mess...the result of quick prototyping.

### Deploying this Site

Run `gulp build`, commit changes, and push to GitHub to deploy.

## Credits

The Fish Fry Map is built and maintained by members of Code for Pittsburgh.

It uses <a href='https://github.com/bmcbride/bootleaf'>Bootleaf</a> (which we've adapted it and modified it really quite heavily for this project), <a href="http://getbootstrap.com/">Bootstrap 3</a>, <a href="http://leafletjs.com/" target="_blank">Leaflet</a>, and <a href="http://twitter.github.io/typeahead.js/" target="_blank">typeahead.js</a>, among other things.

### Basemaps

Our nice basemaps come from all over!

* **Light** and **Dark** basemaps: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CARTO</a>
* **Black n' Gold** basemap: Map tiles from <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> license. Basemap data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a> license.
* **Aerial Imagery** and **Vintage** basemaps: © Mapbox © OpenStreetMap © DigitalGlobe

### Icons

Church and Warehouse icons come from © Mapbox.


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FCodeForPittsburgh%2Ffishfrymap.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FCodeForPittsburgh%2Ffishfrymap?ref=badge_large)