# [2016 Pittsburgh Lenten Fish Fry Map](http://openpgh.github.io/fishfrymap)

Facebook: https://www.facebook.com/PittsburghLentenFishFryMap/

## Dependencies

* Mapbox JS (an extension of Leaflet)
* CSS from Leaflet
* Mapbox's leaflet-ominvore for ingesting kml and returning geojson
* Leaflet Sidebar for a Leaflet-friendly sidebar.
* JQuery, for dealing with the features filters

## Data source

Data for this was collected in Google Maps. See the `_src` folder for steps used to convert geocoded-but-not-explicitly-geo-attributed `kml` exported from a Google Maps Fusion Table to useful `kml` with actual xy attributes. This standardized `kml` is converted to `geojson` in the map via Mapbox Omnivore.

## Cartographic inspiration

http://gassc.github.io/pcbwmap
