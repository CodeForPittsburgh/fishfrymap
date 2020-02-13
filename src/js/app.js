/************************************************
* dependencies
*/

// jQuery + Bootstrap
var $ = require('../../node_modules/jquery/dist/jquery')
window.jQuery = $;
window.$ = $;

require("bootstrap");

// Leaflet + plugins
var L = require("leaflet");
require("leaflet.markercluster");
require("leaflet-basemaps");
require("leaflet.locatecontrol");
require("leaflet-groupedlayercontrol");
require("leafletgeojsonfilter");
require("../../node_modules/@unchartedsoftware/leaflet.zoomhome/dist/leaflet.zoomhome");

// other things
// user a local copy of typeahead
require('../js/lib/typeahead.js/dist/typeahead.bundle')

var Handlebars = require("handlebars");

const List = require('list.js');
var moment = require("moment");

/************************************************
* Application Code
* TODO: break this up!
*/

var map,
  featureList,
  fishFrySearch = [];

var iconPath = "assets/img/";
var iconLookup = {
  Church: iconPath + "Church.png",
  "Community Organization": iconPath + "Community_Organization.png",
  "Food Truck": iconPath + "Food_Truck.png",
  "Fire Department": iconPath + "Fire_Department.png",
  Restaurant: iconPath + "Restaurant.png",
  "Unsure / N/A": iconPath + "Unsure_NA.png",
  "": iconPath + "Unsure_NA.png",
  unpublished: iconPath + "yellowpoint75.png"
};

function booleanLookup(v) {
  var b;
  if (v === true || $.inArray(v, ["true", "True", 1, "Yes", "yes"]) > -1) {
    b = "Yes";
  } else if (
    v === false ||
    $.inArray(v, ["false", "False", 0, "No", "no"]) > -1
  ) {
    b = "No";
  } else if (v === null || v === "") {
    b = "Unsure";
  } else {
    b = "Unsure";
  }
  return b;
}


// Some code to help figure out Good Friday

function padout(number) {
  return (number < 10) ? '0' + number : number;
}

function Easter(Y) {
  var C = Math.floor(Y / 100);
  var N = Y - 19 * Math.floor(Y / 19);
  var K = Math.floor((C - 17) / 25);
  var I = C - Math.floor(C / 4) - Math.floor((C - K) / 3) + 19 * N + 15;
  I = I - 30 * Math.floor((I / 30));
  I = I - Math.floor(I / 28) * (1 - Math.floor(I / 28) * Math.floor(29 / (I + 1)) * Math.floor((21 - N) / 11));
  var J = Y + Math.floor(Y / 4) + I + 2 - C + Math.floor(C / 4);
  J = J - 7 * Math.floor(J / 7);
  var L = I - J;
  var M = 3 + Math.floor((L + 40) / 44);
  var D = L + 28 - 31 * Math.floor(M / 4);

  return Y + '-' + padout(M) + '-' + padout(D);
}

// thisYear = 2019;
var thisYear = moment().year();
var easterThisYear = moment(Easter(thisYear));
var goodFridayThisYear = easterThisYear.subtract(2, 'd');


$(window).resize(function () {
  sizeLayerControl();
});

$(document).on("click", ".feature-row", function (e) {
  $(document).off("mouseout", ".feature-row", clearHighlight);
  sidebarClick(parseInt($(this).attr("id"), 10));
});

if (!("ontouchstart" in window)) {
  $(document).on("mouseover", ".feature-row", function (e) {
    highlight
      .clearLayers()
      .addLayer(
        L.circleMarker(
          [$(this).attr("lat"), $(this).attr("lng")],
          highlightStyle
        )
      );
  });
}

$(document).on("mouseout", ".feature-row", clearHighlight);

/**
* screen detection (larger screens get expanded layer control and visible sidebar)
*/
if (document.body.clientWidth <= 767) {
  var isCollapsed = true;
} else {
  var isCollapsed = false;
}

$("#about-btn").click(function () {
  $("#aboutModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#login-btn").click(function () {
  $("#loginModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#full-extent-btn").click(function () {
  map.fitBounds(fishfrys.getBounds());
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#legend-btn").click(function () {
  $("#legendModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#filterNav-btn").click(function () {
  $("#filterModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#filterSidebar-btn").click(function () {
  $("#filterModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#list-btn").click(function () {
  animateSidebar();
  return false;
});

$("#nav-btn").click(function () {
  $(".navbar-collapse").collapse("toggle");
  return false;
});

$("#sidebar-toggle-btn").click(function () {
  animateSidebar();
  return false;
});

$("#sidebar-hide-btn").click(function () {
  animateSidebar();
  return false;
});

function animateSidebar() {
  $("#sidebar").animate({
    width: "toggle"
  },
    350,
    function () {
      map.invalidateSize();
    }
  );
}

function sizeLayerControl() {
  $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
}

function clearHighlight() {
  highlight.clearLayers();
}

function sidebarClick(id) {
  var layer = markerClusters.getLayer(id);
  map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 17);
  layer.fire("click");
  /* Hide sidebar and go to the map on small screens */
  if (document.body.clientWidth <= 767) {
    $("#sidebar").hide();
    map.invalidateSize();
  }
}

function syncSidebar() {
  /* Empty sidebar features */
  $("#feature-list tbody").empty();
  /* Loop through fishfrys layer and add only features which are in the map bounds */
  fishfrys.eachLayer(function (layer) {
    if (map.hasLayer(fishFryLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append(
          '<tr class="feature-row" id="' +
          L.stamp(layer) +
          '" lat="' +
          layer.getLatLng().lat +
          '" lng="' +
          layer.getLatLng().lng +
          '"><td style="vertical-align: middle;"><img width="20" src=' +
          layer.feature.properties.icon +
          '></td><td class="feature-name">' +
          layer.feature.properties.venue_name +
          '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>'
        );
      }
    }
  });
  var count = $("#feature-list tbody tr").length;
  //console.log(count);
  /* Update list.js featureList */
  featureList = new List("features", {
    valueNames: ["feature-name"],
    page: 1000
  });
  featureList.sort("feature-name", {
    order: "asc"
  });
}

/**
* Basemap Layers
*/

var cartoDark = L.tileLayer(
  "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
}
);
// http://mapstack.stamen.com/edit.html#terrain-background[mask=mapbox-water,bright=-30,sat=20,tint=$1b334b@100];watercolor[mask=!mapbox-water,invert=1,tint=3E3F3A@100];terrain-background[mask=!mapbox-water,bright=-40,tint=DFD7CA@100,comp=screen,alpha=60];streets-and-labels[tint=$fedd9a@100,alpha=50]/10/40.4088/-79.9963
var mapStack = L.tileLayer(
  "http://{s}.sm.mapstack.stamen.com/((terrain-background,$000[@30],$fff[hsl-saturation@80],$1b334b[hsl-color],mapbox-water[destination-in]),(watercolor,$fff[difference],$000000[hsl-color],mapbox-water[destination-out]),(terrain-background,$000[@40],$000000[hsl-color],mapbox-water[destination-out])[screen@60],(streets-and-labels,$fedd9a[hsl-color])[@50])/{z}/{x}/{y}.png", {
  attribution: '<a style="color:black" href="http://stamen.com">Stamen Design</a> under <a style="color:black"href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> license + <a style="color:black"href="http://openstreetmap.org">OpenStreetMap</a> under <a style="color:black"href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a> license.',
  maxZoom: 18
}
);
var cartoLight = L.tileLayer(
  "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
}
);

var basemaps = [cartoDark, cartoLight, mapStack];

/**
* Overlay Layers
*/
var highlight = L.geoJson(null);
var highlightStyle = {
  stroke: false,
  fillColor: "#00FFFF",
  fillOpacity: 0.7,
  radius: 10
};

/* Single marker cluster layer to hold all clusters */
var markerClusters = new L.MarkerClusterGroup({
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
  disableClusteringAtZoom: 6
});

function attrClean(attr) {
  if (attr) {
    return attr;
  } else {
    return "";
  }
}

/**
* parse the events object that comes from the geojson into something
* we can use to make readable text. use moment js
* This could be moved to server-side and returned natively by the API.
*/
var now = moment();

function parseDateTimes(fishfry_events) {
  var sortList = [];
  $.each(fishfry_events, function (k, v) {
    // read each dateimte/pair into moment js objects "begin" and "end"
    var begin = moment(v.dt_start);
    var end = moment(v.dt_end);
    // push those objects to a list that we'll work with, but only if they
    // end after right now
    if (end.isAfter(now)) {
      sortList.push([begin, end]);
    }
  });
  //console.log(sortList);
  // sort the array based on the first element in each element
  sortList.sort(function (a, b) {
    if (a[0].isBefore(b[0])) {
      return -1;
    }
    if (a[0].isAfter(b[0])) {
      return 1;
    }
    return 0;
  });
  //console.log(sortList);

  var eventList_Future = [];
  var eventList_Today = [];
  var s;
  var OpenGoodFriday = false;
  var datecounter = 0;
  $.each(sortList, function (i, a) {
    // compare them - if on same day, write to content a human-friendly string
    if (moment(a[0]).isSame(goodFridayThisYear, "day")) {
      OpenGoodFriday = true;
      // s = "Open Good " + a[0].format("dddd, MMMM Do") + ", " + a[0].format("h:mm a") + " to " + a[1].format("h:mm a");
    }
    if (moment(a[0]).isSame(a[1], "day")) {
      if (moment(a[0]).isSame(now, "day")) {
        //s = "Open Today, " + a[0]eventList_Future.format("h:mm a") + " to " + a[1].format("h:mm a");
        eventList_Today.push(
          a[0].format("h:mm a") + " to " + a[1].format("h:mm a")
        );
        datecounter++;
      }
      //            else {
      //                if (moment(a[0]).isSame('2018-03-30', 'day'))
      //                {
      //                    OpenGoodFriday = true;
      //                    // s = "Open Good " + a[0].format("dddd, MMMM Do") + ", " + a[0].format("h:mm a") + " to " + a[1].format("h:mm a");
      //                }
      //            }
    }
    if (OpenGoodFriday) {
      s =
        "Open Good " +
        a[0].format("dddd, MMMM Do") +
        ", " +
        a[0].format("h:mm a") +
        " to " +
        a[1].format("h:mm a");
    } else {
      s =
        a[0].format("dddd, MMMM Do") +
        ", " +
        a[0].format("h:mm a") +
        " to " +
        a[1].format("h:mm a");
    }
    datecounter++;
    eventList_Future.push(s);
  });
  if (!OpenGoodFriday && datecounter > 0) {
    s = "Closed on Good Friday";
    eventList_Future.push(s);
  }
  //console.log(eventList);
  return {
    today: eventList_Today,
    future: eventList_Future,
    GoodFriday: OpenGoodFriday
  };
}

/* Empty layer placeholder to add to layer control for listening when to add/remove fishfrys to markerClusters layer */
var fishFryLayer = L.geoJson(null);
var fishfrys = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    if (feature.properties.publish) {
      return L.marker(latlng, {
        icon: L.icon({
          // feature.properties.icon is added to fishfrys in this script
          iconUrl: feature.properties.icon,
          iconSize: [30, 76] // size of the icon
          //iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
          //popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        }),
        title: feature.properties.venue_name,
        riseOnHover: true
      });
    } else {
      return L.circleMarker(latlng, {
        radius: 4,
        color: "#fedb96",
        fillColor: "#fff",
        fillOpacity: 1,
        weight: 6,
        opacity: 0.5
      });
    }
  },
  onEachFeature: function (feature, layer) {
    // create feature pop-up modal content
    var nl = "URL:";
    if (feature.properties) {
      // assemble the info-modal content using Handlebars
      var infoTemplate = $("#info-template").html();
      var infoTemplateCompiled = Handlebars.compile(infoTemplate);
      layer.on({
        click: function (e) {
          //parse date times into object {"today": eventList_Today, "future": eventList_Future}
          var events = parseDateTimes(feature.properties.events);
          // build Handlebars content object for the info-modal
          var infoContent = {
            // for strings, us attrClean to return empty string if value is null
            venue_name: attrClean(feature.properties.venue_name),
            venue_address: attrClean(feature.properties.venue_address),
            phone: attrClean(feature.properties.phone),
            website: attrClean(feature.properties.website),
            etc: attrClean(feature.properties.etc),
            menu_text: attrClean(feature.properties.menu.text),
            menu_url: attrClean(feature.properties.menu.url),
            //menu: attrClean(feature.properties.menu),
            venue_notes: attrClean(feature.properties.venue_notes),
            venue_type: attrClean(feature.properties.venue_type),
            // for booleans, use booleanLookup to return human friendly text
            lunch: booleanLookup(feature.properties.lunch),
            homemade_pierogies: booleanLookup(
              feature.properties.homemade_pierogies
            ),
            alcohol: booleanLookup(feature.properties.alcohol),
            take_out: booleanLookup(feature.properties.take_out),
            handicap: booleanLookup(feature.properties.handicap),
            GoodFriday: booleanLookup(events.GoodFriday),
            // event lists parsed by function above
            events_future: events.future,
            events_today: events.today
          };

          if (!feature.properties.publish) {
            infoContent.notify =
              'This Fish Fry has not yet been verified this year. If you have info about this location for ' + thisYear + ', please head over to our <a href="https://www.facebook.com/PittsburghLentenFishFryMap/"><u>Facebook page</u></a> and help us out. Thanks!';
          }
          //console.log(infoContent);

          $("#feature-info").html(infoTemplateCompiled(infoContent));
          $("#featureModal").modal("show");
          highlight
            .clearLayers()
            .addLayer(
              L.circleMarker(
                [
                  feature.geometry.coordinates[1],
                  feature.geometry.coordinates[0]
                ],
                highlightStyle
              )
            );
        }
      });
      // create feature-list (sidebar) content
      $("#feature-list tody").append(
        '<tr class="feature-row" id="' +
        L.stamp(layer) +
        '" lat="' +
        layer.getLatLng().lat +
        '" lng="' +
        layer.getLatLng().lng +
        '"><td style="vertical-align: middle;"><img width="16" height="18" src=' +
        layer.feature.properties.icon +
        '></td><td class="feature-name">' +
        layer.feature.properties.venue_name +
        '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>'
      );
      //push info to the Search array, which is used by "Search All Fish Frys"
      fishFrySearch.push({
        name: layer.feature.properties.venue_name,
        address: layer.feature.properties.venue_address,
        etc: layer.feature.properties.etc,
        source: "FishFrys",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
/**
* Request the GeoJSON, add it to the layer and add the layer to the map
*/
var geojsonSrc = "https://fishfry.codeforpgh.com/api/fishfries/";
// var geojsonSrc = "https://raw.githubusercontent.com/CodeForPittsburgh/fishfrymap/master/data/fishfrymap2018.geojson"; //?" + now.unix();
$.getJSON(geojsonSrc, function (data) {
  console.log("Fish Frys successfully loaded");
  // once we get the data, we need to do a few things to each feature:
  $(data.features).each(function (i, e) {
    // rewrite web urls to make sure they have http/s in front
    if (e.properties.website) {
      var str = e.properties.website;
      if (str.search("http://") === -1 && str.search("https://") === -1) {
        e.properties.website = "http://" + str;
      }
    }
    // add a new icon property to the geojson using iconLookup
    if (!e.properties.publish) {
      e.properties.icon = iconLookup.unpublished;
    } else {
      if (e.properties.venue_type) {
        if (iconLookup[e.properties.venue_type]) {
          // use the lookup to get the approp. icon url, make a property
          e.properties.icon = iconLookup[e.properties.venue_type];
        } else {
          e.properties.icon = iconLookup[""];
        }
      } else {
        e.properties.icon = iconLookup[""];
      }
    }
  });
  // proceed with adding it to the map
  fishfrys.addData(data);
  map.addLayer(fishFryLayer);
});

/**
* MAP SETUP
*/
map = L.map("map", {
  zoom: 10,
  center: [40.4452, -79.9866],
  layers: [cartoLight, markerClusters, highlight],
  // these are customized and added later:
  zoomControl: false,
  attributionControl: false
});

// map.addLayer(fishfrys);

/**
* custom zoomhome-control
*/
map.addControl(
  L.Control.zoomHome({
    position: "topleft"
  })
);
$(".leaflet-control-zoomhome-out").html('<i class="fa fa-minus"></i>');
$(".leaflet-control-zoomhome-in").html('<i class="fa fa-plus"></i>');
$(".leaflet-control-zoomhome-home").html('<i class="fa fa-arrows-alt"></i>');

// var baseLayers = {
//     "Street Map": cartoLight,
//     "Night Map": cartoDark,
//     "Black n' Gold": mapStack,
//     "Aerial Imagery": mapboxImagery,
//     Vintage: vintage
// };

// var groupedOverlays = {
//     "Fish Frys": {
//         "&nbsp;On/Off": fishFryLayer
//     }
// };

// var layerControl = L.control
//     .groupedLayers(baseLayers, groupedOverlays, {
//         collapsed: isCollapsed,
//         position: "topright"
//     })
//     .addTo(map);

map.addControl(
  // custom basemap control
  L.control.basemaps({
    position: "topright",
    basemaps: basemaps,
    tileX: 4550, // tile X coordinate
    tileY: 6176, // tile Y coordinate
    tileZ: 14 // tile zoom level
  })
);

map.addControl(
  L.control.layers({}, {
    "Fish Fries": fishFryLayer
  }, {
    collapsed: true
  })
);

/**
* GPS enabled geolocation control set to follow the user's location
*/
map.addControl(
  L.control.locate({
    position: "topleft",
    drawCircle: true,
    follow: true,
    setView: true,
    keepCurrentZoomLevel: false,
    markerStyle: {
      weight: 1,
      opacity: 0.8,
      fillOpacity: 0.8
    },
    circleStyle: {
      weight: 1,
      clickable: false
    },
    icon: "fa fa-location-arrow",
    metric: false,
    strings: {
      title: "My location",
      popup: "You are within {distance} {unit} from this point",
      outsideMapBoundsMsg: "You seem located outside the boundaries of the map"
    },
    locateOptions: {
      maxZoom: 17,
      watch: true,
      enableHighAccuracy: true,
      maximumAge: 10000,
      timeout: 10000
    }
  })
);


var attributionControl = L.control.attribution({
  position: "bottomright",
  prefix: "<a href='http://codeforpittsburgh.github.io'>Code for Pittsburgh</a>"

});
map.addControl(attributionControl);

/*
* Layer control listeners that allow for a single markerClusters layer
*/
map.on("overlayadd", function (e) {
  if (e.layer === fishFryLayer) {
    markerClusters.addLayer(fishfrys);
    syncSidebar();
  }
});

map.on("overlayremove", function (e) {
  if (e.layer === fishFryLayer) {
    markerClusters.removeLayer(fishfrys);
    syncSidebar();
  }
});

/**
* Filter sidebar feature list to only show features in current map bounds
*/
map.on("moveend", function (e) {
  syncSidebar();
});

/**
* Clear feature highlight when map is clicked
*/
map.on("click", function (e) {
  highlight.clearLayers();
});

/**
* FILTERING
*/

/**
* uncheck all filter checkboxes all by default
*/
$(".filter").each(function (i, e) {
  e.checked = false;
});

/**
* a global variable that lets us store whether filtering has happened
*/
var noFiltersApplied = true;

/**
* click event for checkboxes, applies a filter function to every feature
*/
$("input[class='filter']").click(function (c) {
  //console.log(c.target.id + ": " + c.target.checked);
  //setFilter applies the showFeature function to every feature in runLayer
  fishfrys.setFilter(filterFeatures);
  syncSidebar();
  markerClusters.refreshClusters();
  markerClusters.clearLayers(fishfrys);
  markerClusters.addLayer(fishfrys);
  if (!noFiltersApplied) {
    $("#filterSidebar-btn").removeClass("btn-default");
    $("#filterSidebar-btn").addClass("btn-primary");
    $("#filterSidebar-btn").html('<i class="fa fa-filter"></i> Filtered');
  } else {
    $("#filterSidebar-btn").addClass("btn-default");
    $("#filterSidebar-btn").removeClass("btn-primary");
    $("#filterSidebar-btn").html('<i class="fa fa-filter"></i> Filter');
  }
});

function filterFeatures(f) {
  /**
  * This function is applied to every feature by the setFilter function.
  *
  * It can only can pass to setFilter a boolean: true or false.
  *
  * For each feature, figure out whether the feature's properties matches
  * the checkboxes.
  *
  * If the feature properties match the corresponding checkbox fields, return true
  * if there is a mismatch between any checkbox and feature property, return false
  *
  * We're only interested in the checking properties against checked
  * checkboxes - we ignore the unchecked checkboxes in the comparison
  *
  * If no checkboxes are checked (all checkboxes return false), then all
  * features are shown - this function will just return true.
  */

  var show = true;
  var checkboxed = [];
  //var OpenGoodFriday = false;
  // reset noFilters applied - we'll make that determination again here
  noFiltersApplied = true;

  // check all the checkboxes to get the combination of filters applied.
  $("input[class='filter']").each(function (i, e) {
    // get the checkbox value
    var filtered = $(e).prop("checked");
    // the presence of any checked checkbox will set noFiltersApplied to false
    if (filtered) {
      noFiltersApplied = false;
    }
    // get the property value of the feature from the id of the checkbox
    // hint: the checkbox id = the feature property name, so we can use the
    // checkbox id to retreive the value of the feature property
    var prop_boolean = false;
    var test = false;
    var prop_id = $(e).prop("id");

    // var begin;
    //console.log(">>> " + prop_id + ": ");
    if (prop_id === "GoodFriday") {
      //console.log(">>> " + prop_id + ": ");
      var fishfry_events = f.properties.events;
      //var sortList = [];
      $.each(fishfry_events, function (k, v) {
        // read each dateimte/pair into moment js objects "begin" and "end"

        if (moment(v.dt_start).isSame(goodFridayThisYear, "day")) {
          //console.log("Found Good Friday");
          prop_boolean = true;

          //console.log(">>> ", prop_id, test);
          //counter++;
        }
      });
    } else {
      prop_boolean = f.properties[prop_id];
    }

    test = filtered === prop_boolean;
    if (filtered) {
      checkboxed.push(test);
      //console.log("Other");
    }

    //console.log(">>> " + prop_id + ": " + test);
  });

  // the business of filtering:

  // if no filters are applied, then show the feature
  if (noFiltersApplied) {
    show = true;
    /**
    * if one or more filters are applied, check to see if the attributes of
    * the feature match only those filters checked (and don't worry about the
    * unchecked filters).	Get the match results for those with checked-boxes,
    * and if there if there are any non-matches, the feature returns false
    */
  } else if (checkboxed.indexOf(false) !== -1) {
    show = false;
  } else {
    // if all true checkboxes have matching properties with true, feature is true
    show = true;
  }

  //console.log("setFilter on", f.properties.venue_name, show);
  // return the show attribute to setFilter for this feature (true or false
  // based on the logic above)
  return show;
}

/* Highlight search box text on click */
$("#searchbox").click(function () {
  $(this).select();
});

/* Prevent hitting enter from refreshing the page */
$("#searchbox").keypress(function (e) {
  if (e.which == 13) {
    e.preventDefault();
  }
});

$("#featureModal").on("hidden.bs.modal", function (e) {
  $(document).on("mouseout", ".feature-row", clearHighlight);
});

/**
* Typeahead search functionality
*/
$(document).one("ajaxStop", function () {
  $("#loading").hide();
  sizeLayerControl();
  featureList = new List("features", {
    valueNames: ["feature-name"],
    page: 1000
  });
  featureList.sort("feature-name", {
    order: "asc"
  });

  var fishfrysBH = new Bloodhound({
    name: "FishFrys",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: fishFrySearch,
    limit: 10
  });

  var geonamesBH = new Bloodhound({
    name: "Mapbox",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
      url: "https://api.mapbox.com/geocoding/v5/mapbox.places/%QUERY.json?&access_token=pk.eyJ1IjoiY2l2aWNtYXBwZXIiLCJhIjoiY2pkZGR2YnRkMDBiYTMzbmFqemRhemYzdSJ9.Cny85WNd4zd6C3WhC6v9Rw&country=us&proximity=-79.9976593%2C40.4396267&autocomplete=true&limit=5",
      filter: function (data) {
        return $.map(data.features, function (feature) {
          return {
            name: feature.place_name,
            lat: feature.geometry.coordinates[1],
            lng: feature.geometry.coordinates[0],
            source: "Mapbox"
          };
        });
      },
      ajax: {
        beforeSend: function (jqXhr, settings) {
          $("#searchicon")
            .removeClass("fa-search")
            .addClass("fa-refresh fa-spin");
        },
        complete: function (jqXHR, status) {
          $("#searchicon")
            .removeClass("fa-refresh fa-spin")
            .addClass("fa-search");
        }
      }
    },
    limit: 10
  });
  fishfrysBH.initialize();
  geonamesBH.initialize();

  /* instantiate the typeahead UI */
  $("#searchbox")
    .typeahead({
      minLength: 3,
      highlight: true,
      hint: false
    }, {
      name: "FishFrys",
      displayKey: "name",
      source: fishfrysBH.ttAdapter(),
      templates: {
        header: "<h4 class='typeahead-header'>Fish Frys</h4>",
        suggestion: Handlebars.compile(
          ["{{name}}<br>&nbsp;<small>{{address}}</small>"].join("")
        )
      }
    }, {
      name: "Mapbox",
      displayKey: "name",
      source: geonamesBH.ttAdapter(),
      templates: {
        header: "<h4 class='typeahead-header'>Places</h4>"
      }
    })
    .on("typeahead:selected", function (obj, datum) {
      if (datum.source === "FishFrys") {
        if (!map.hasLayer(fishFryLayer)) {
          map.addLayer(fishFryLayer);
        }
        map.setView([datum.lat, datum.lng], 17);
        if (map._layers[datum.id]) {
          map._layers[datum.id].fire("click");
        }
      }
      if (datum.source === "Mapbox") {
        map.setView([datum.lat, datum.lng], 17);
      }
      if ($(".navbar-collapse").height() > 50) {
        $(".navbar-collapse").collapse("hide");
      }
    })
    .on("typeahead:opened", function () {
      $(".navbar-collapse.in").css(
        "max-height",
        $(document).height() - $(".navbar-header").height()
      );
      $(".navbar-collapse.in").css(
        "height",
        $(document).height() - $(".navbar-header").height()
      );
    })
    .on("typeahead:closed", function () {
      $(".navbar-collapse.in").css("max-height", "");
      $(".navbar-collapse.in").css("height", "");
    });
  $(".twitter-typeahead").css("position", "static");
  $(".twitter-typeahead").css("display", "block");
});

// Leaflet patch to make layer control scrollable on touch browsers
var container = $(".leaflet-control-layers")[0];
if (!L.Browser.touch) {
  L.DomEvent.disableClickPropagation(container).disableScrollPropagation(
    container
  );
} else {
  L.DomEvent.disableClickPropagation(container);
}