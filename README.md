# Pittsburgh Lenten Fish Fry Map

<p>The Pittsburgh Lenten Fish Fry Map is the brainchild of <a href="https://twitter.com/hollenbarmer">Hollen Barmer</a>, who has tirelessly dedicated time the past few years to inventorying the rich array of Lenten Fish Fry events that occur every spring in Western Pennsylvania. This year, Code for Pittsburgh is helping.</p>

## Credits
<p>The Fish Fry Map is built on <a href='https://github.com/bmcbride'>Bootleaf</a>, an amazing, simple, responsive template for building web mapping applications with <a href="http://getbootstrap.com/">Bootstrap 3</a>, <a href="http://leafletjs.com/" target="_blank">Leaflet</a>, and <a href="http://twitter.github.io/typeahead.js/" target="_blank">typeahead.js</a>. Open source, MIT licensed, and available on <a href="https://github.com/bmcbride/bootleaf" target="_blank">GitHub</a>. Bootleaf was created by <a href="https://github.com/bmcbride">Bryan McBride.</a> We've adapted it for this project.</p>

### Basemaps:

* **Street Map** basemap: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>
* **Black n' Gold** basemap: Map tiles from <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> license. Basemap data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a> license.
* **Aerial Imagery** basemap: © Mapbox © OpenStreetMap © DigitalGlobe

### Icons

* Church and Warehouse icons: © Mapbox 


## Fish Fry data service

Right now, regular snapshots of the data from [fishfry.codeforpgh.com/api/fishfrys](http://fishfry.codeforpgh.com/api/fishfrys) are being dumped into the `data` folder of this repo. Ideally, the map would reference the Fish Fry API directly (after all, that's why we built the API) - we're working on that.

## Development

This is a static web site. We're serving it up with GitHub pages, but it can run on any web server, really.

If you're interested in taking it for a spin, clone the repo and use your preferred software to spin up a web server.

Using Python:

1. `cd /path/to/fishfrymap/`
2. `python -m SimpleHTTPServer`
3. Open [http://localhost:8000](http://localhost:8000) in your browser.

Most of the magic happens in `assets/js/app.js`. The rest happens in `index.html`. Note that there is some holdover code from the original Bootleaf project still cluttering things up a bit.
