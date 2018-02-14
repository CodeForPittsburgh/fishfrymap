# Pittsburgh Lenten Fish Fry Map

<p>The Pittsburgh Lenten Fish Fry Map is the brainchild of <a href="https://twitter.com/hollenbarmer">Hollen Barmer</a>, who has tirelessly dedicated time the past few years to inventorying the rich array of Lenten Fish Fry events that occur every spring in Western Pennsylvania. This year, Code for Pittsburgh is helping.</p>

# Credits

The Fish Fry Map is built and maintained by members of Code for Pittsburgh. 

It uses <a href='https://github.com/bmcbride/bootleaf'>Bootleaf</a>, <a href="http://getbootstrap.com/">Bootstrap 3</a>, <a href="http://leafletjs.com/" target="_blank">Leaflet</a>, and <a href="http://twitter.github.io/typeahead.js/" target="_blank">typeahead.js</a>. Bootleaf was created by <a href="https://github.com/bmcbride">Bryan McBride</a>. We've adapted it for this project.

## Basemaps:

* **Light** and **Dark** basemaps: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CARTO</a>
* **Black n' Gold** basemap: Map tiles from <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> license. Basemap data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a> license.
* **Aerial Imagery** and **Vintage** basemaps: © Mapbox © OpenStreetMap © DigitalGlobe

## Icons

* Church and Warehouse icons: © Mapbox 


# Fish Fry data service

Right now, regular snapshots of the data from [fishfry.codeforpgh.com/api/fishfries](http://fishfry.codeforpgh.com/api/fishfries) are being dumped into the `data` folder of this repo. The map itself is pulling from that API endpoint.

# Development

This is a static web site. We're serving it up with GitHub pages, but it can run on any web server, really.

## Take it for a spin

Clone the repo and use your preferred software to spin up a web server.

Using Ruby/Jekyll:

1. `cd /path/to/fishfrymap/`
2. `jekyll serve`
3. Open [http://localhost:4000](http://localhost:4000) in your browser.

Using Python 3:

1. `cd /path/to/fishfrymap/`
2. `python -m http.server`
3. Open [http://localhost:8000](http://localhost:8000) in your browser.

## Code

Most of the work is happening in `assets/js/app.js`. The rest happens in `index.html`. Be warned: it's a bit of a mess...the result of  quick prototyping. 

## Build and Deployment

(coming soon)
