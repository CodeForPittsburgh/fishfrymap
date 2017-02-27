var map, featureList,  fishFrySearch = [];

var iconPath = "assets/img/";
var iconLookup = {
  "Church" : iconPath + "Church.png",
  "Community Organization" : iconPath + "Community_Organization.png",
  "Food Truck" : iconPath + "Food_Truck.png",
  "Fire Department" : iconPath + "Fire_Department.png",
  "Restaurant" : iconPath + "Restaurant.png",
  "Unsure / N/A" : iconPath + "Unsure_NA.png",
  "" : iconPath + "Unsure_NA.png"
};

$(window).resize(function() {
  sizeLayerControl();
});

$(document).on("click", ".feature-row", function(e) {
  $(document).off("mouseout", ".feature-row", clearHighlight);
  sidebarClick(parseInt($(this).attr("id"), 10));
});

if ( !("ontouchstart" in window) ) {
  $(document).on("mouseover", ".feature-row", function(e) {
    highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
  });
}

$(document).on("mouseout", ".feature-row", clearHighlight);

$("#about-btn").click(function() {
  $("#aboutModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#login-btn").click(function() {
  $("#loginModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#full-extent-btn").click(function() {
  map.fitBounds(fishfrys.getBounds());
  /*
   *map.setView(
    [40.4452, -79.9866],
    10
  );
  */
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#legend-btn").click(function() {
  $("#legendModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#filterNav-btn").click(function() {
  $("#filterModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#filterSidebar-btn").click(function() {
  $("#filterModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});



$("#list-btn").click(function() {
  animateSidebar();
  return false;
});

$("#nav-btn").click(function() {
  $(".navbar-collapse").collapse("toggle");
  return false;
});

$("#sidebar-toggle-btn").click(function() {
  animateSidebar();
  return false;
});

$("#sidebar-hide-btn").click(function() {
  animateSidebar();
  return false;
});

function animateSidebar() {
  $("#sidebar").animate({
    width: "toggle"
  }, 350, function() {
    map.invalidateSize();
  });
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
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="20" src=' + layer.feature.properties.icon + '></td><td class="feature-name">' + layer.feature.properties.venue_name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  /* Update list.js featureList */
  featureList = new List("features", {
    valueNames: ["feature-name"]
  });
  featureList.sort("feature-name", {
    order: "asc"
  });
}

/**
 * Basemap Layers
 */
var cartoLight = L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
});
		// get the Stamen Mapstack tile layer and add to map
var mapStack =L.tileLayer('http://{s}.sm.mapstack.stamen.com/((toner-lite,$000%5B@80%5D,$8ad3f4%5Bhsl-color%5D,mapbox-water%5Bdestination-in%5D),(toner,$fff%5Bdifference%5D,$fdb930%5Bhsl-color%5D,mapbox-water%5Bdestination-out%5D),(toner-hybrid,$fff%5Bdifference%5D,$fdb930%5Bhsl-color%5D),(terrain-background,$000%5B@40%5D,$ffffff%5Bhsl-color%5D,mapbox-water%5Bdestination-out%5D)%5Blighter@40%5D)/{z}/{x}/{y}.png', {
			attribution: '<pa style="font-size:0.9rem">Library from <a style="color:black" href="http://www.mapbox.com">Mapbox</a>, Map tiles from <a style="color:black" href="http://stamen.com">Stamen Design</a>, under <a style="color:black"href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> license. Basemap data by <a style="color:black"href="http://openstreetmap.org">OpenStreetMap</a>, under <a style="color:black"href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a> license.</pa>',
			maxZoom: 18,
			minZoom: 8,
		})
var usgsImagery = L.layerGroup([L.tileLayer("http://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}", {
  maxZoom: 15,
}), L.tileLayer.wms("http://raster.nationalmap.gov/arcgis/services/Orthoimagery/USGS_EROS_Ortho_SCALE/ImageServer/WMSServer?", {
  minZoom: 16,
  maxZoom: 19,
  layers: "0",
  format: 'image/jpeg',
  transparent: true,
  attribution: "Aerial Imagery courtesy USGS"
})]);

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
  disableClusteringAtZoom: 14
});

/* Empty layer placeholder to add to layer control for listening when to add/remove fishfrys to markerClusters layer */
var fishFryLayer = L.geoJson(null);
var fishfrys = L.geoJson(null, {
  pointToLayer: function(feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        // feature.properties.icon is added to fishfrys in this script
        iconUrl: feature.properties.icon,
        iconSize:     [38, 95], // size of the icon
        //iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
      }),
      title: feature.properties.venue_name,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    // create feature pop-up modal content
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Name</th><td>" + feature.properties.venue_name + "</td></tr>" + "<tr><th>Phone</th><td>" + feature.properties.phone + "</td></tr>" + "<tr><th>Address</th><td>" + feature.properties.venue_address + "</td></tr>" + "<tr><th>Website</th><td><a class='url-break' href='" + feature.properties.website + "' target='_blank'>" + feature.properties.website + "</a></td></tr>" + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.venue_name);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      // create feature-list (sidebar) content
      $("#feature-list tody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src=' + layer.feature.properties.icon + '></td><td class="feature-name">' + layer.feature.properties.venue_name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      fishFrySearch.push({
        name: layer.feature.properties.venue_name,
        address: layer.feature.properties.venue_address,
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
$.getJSON("http://fishfry.codeforpgh.com/api/fishfrys/?publish=True", function (data) {
  // add a new icon property to the geojson using the lookup.
  $(data.features).each(function(i,e){
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
  });
  // proceed with adding it to the map
  fishfrys.addData(data);
  map.addLayer(fishFryLayer);
});

/**
 * MAP SETUP
 */
map = L.map("map", {
  zoom: 8,
  center: [40.4452, -79.9866],
  layers: [cartoLight, markerClusters, highlight],
  // these are added later:
  zoomControl: false,
  attributionControl: false
});

/*
var zoomControl = L.control.zoom({
  position: "bottomright"
}).addTo(map);
*/

/**
 * custom zoomhome-control
 */
var zoomHome = L.Control.zoomHome({
  position: "topleft"
});
zoomHome.addTo(map);

/*
 * Layer control listeners that allow for a single markerClusters layer
 */
map.on("overlayadd", function(e) {
  if (e.layer === fishFryLayer) {
    markerClusters.addLayer(fishfrys);
    syncSidebar();
  }
});

map.on("overlayremove", function(e) {
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
map.on("click", function(e) {
  highlight.clearLayers();
});

/**
 * Attribution control
 */
function updateAttribution(e) {
  $.each(map._layers, function(index, layer) {
    if (layer.getAttribution) {
      $("#attribution").html((layer.getAttribution()));
    }
  });
}
map.on("layeradd", updateAttribution);
map.on("layerremove", updateAttribution);

var attributionControl = L.control({
  position: "bottomright"
});
attributionControl.onAdd = function (map) {
  var div = L.DomUtil.create("div", "leaflet-control-attribution");
  div.innerHTML = "<span class='hidden-xs'><a href='http://codeforpittsburgh.github.io'>Code for Pittsburgh</a> | <a href='https://github.com/bmcbride'>Bootleaf</a> | </span><a href='#' onclick='$(\"#attributionModal\").modal(\"show\"); return false;'>Attribution</a>";
  return div;
};
map.addControl(attributionControl);

/**
 * GPS enabled geolocation control set to follow the user's location
 */
var locateControl = L.control.locate({
  position: "topleft",
  drawCircle: true,
  follow: true,
  setView: true,
  keepCurrentZoomLevel: true,
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
    maxZoom: 18,
    watch: true,
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 10000
  }
}).addTo(map);

/**
 * Larger screens get expanded layer control and visible sidebar
 */
if (document.body.clientWidth <= 767) {
  var isCollapsed = true;
} else {
  var isCollapsed = false;
}

var baseLayers = {
  "Street Map": cartoLight,
  "Aerial Imagery": usgsImagery
};

var groupedOverlays = {
  "Fish Frys": {
    //"<img src='assets/img/favicon-76.png' width='24' height='28'>&nbsp;Fish Frys": fishFryLayer
    "&nbsp;On/Off": fishFryLayer
    //"<img src='assets/img/museum.png' width='24' height='28'>&nbsp;Museums": museumLayer
  }
  /*
  "Reference": {
    "Boroughs": boroughs,
    "Subway Lines": subwayLines
  }
  */
};

var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
  collapsed: isCollapsed,
  position: 'bottomleft'
}).addTo(map);

/**
 * FILTERING
 */

/**
 * uncheck all filter checkboxes all by default
 */
$(".filter").each(function(i,e) {
    e.checked = false;
});

/**
 * a global variable that lets us store whether filtering has happened
 */
var noFiltersApplied = true;

/**
 * click event for checkboxes, applies a filter function to every feature
 */
$("input[class='filter']").click(function(c) {
  //console.log(c.target.id + ": " + c.target.checked);
  //setFilter applies the showFeature function to every feature in runLayer
  fishfrys.setFilter(filterFeatures);
  //fishFryLayer.setFilter(filterFeatures);

  //fishFryLayer.setFilter(filterFeatures);
  syncSidebar();
  markerClusters.refreshClusters();
  markerClusters.clearLayers(fishfrys);
  markerClusters.addLayer(fishfrys);
  if (!noFiltersApplied) {
    $('#filterSidebar-btn').removeClass("btn-default");
    $('#filterSidebar-btn').addClass("btn-primary");
    $('#filterSidebar-btn').html('<i class="fa fa-filter"></i> Filtered');
  } else {
    $('#filterSidebar-btn').addClass("btn-default");
    $('#filterSidebar-btn').removeClass("btn-primary");
    $('#filterSidebar-btn').html('<i class="fa fa-filter"></i> Filter');
  }
  
});

function filterFeatures(f){
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
  // reset noFilters applied - we'll make that determination again here
  noFiltersApplied = true;
  
  // check all the checkboxes to get the combination of filters applied.
  $("input[class='filter']").each(function(i,e){
    // get the checkbox value
    var filtered = $(e).prop("checked");
    // the presence of any checked checkbox will set noFiltersApplied to false
    if (filtered) {
      noFiltersApplied = false;
      }
    // get the property value of the feature from the id of the checkbox
    // hint: the checkbox id = the feature property name, so we can use the
    // checkbox id to retreive the value of the feature property
    var prop_id = $(e).prop("id");
    var prop_boolean = f.properties[prop_id];
    var test = (filtered === prop_boolean);
    if (filtered) {
      checkboxed.push(test);
    }
    //console.log(">>> " + prop_id + ": " + test);
  });
  
  /*
  // 2016 map filter example:
  var lunch_box = $("#lunch").prop("checked");
  var lunch_prop = feature.properties.lunch === true;
  var lunch = (lunch_box === lunch_prop);
  if (lunch_box) checkboxed.push(lunch);
  //console.log("lunch ", lunch)
  */
  
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
  } else if (checkboxed.indexOf(false) != -1) {
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
  /* Fit map to boroughs bounds */
  //map.fitBounds(boroughs.getBounds());
  featureList = new List("features", {valueNames: ["feature-name"]});
  featureList.sort("feature-name", {order:"asc"});

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
    name: "GeoNames",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
      url: "http://api.geonames.org/searchJSON?username=bootleaf&featureClass=P&maxRows=5&countryCode=US&name_startsWith=%QUERY",
      filter: function (data) {
        return $.map(data.geonames, function (result) {
          return {
            name: result.name + ", " + result.adminCode1,
            lat: result.lat,
            lng: result.lng,
            source: "GeoNames"
          };
        });
      },
      ajax: {
        beforeSend: function (jqXhr, settings) {
          settings.url += "&east=" + map.getBounds().getEast() + "&west=" + map.getBounds().getWest() + "&north=" + map.getBounds().getNorth() + "&south=" + map.getBounds().getSouth();
          $("#searchicon").removeClass("fa-search").addClass("fa-refresh fa-spin");
        },
        complete: function (jqXHR, status) {
          $('#searchicon').removeClass("fa-refresh fa-spin").addClass("fa-search");
        }
      }
    },
    limit: 10
  });
  fishfrysBH.initialize();
  geonamesBH.initialize();

  /* instantiate the typeahead UI */
  $("#searchbox").typeahead({
    minLength: 3,
    highlight: true,
    hint: false
  }, {
    name: "FishFrys",
    displayKey: "name",
    source: fishfrysBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/favicon-76.png' width='24' height='28'>&nbsp;Fish Frys</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }, {
    name: "GeoNames",
    displayKey: "name",
    source: geonamesBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/globe.png' width='25' height='25'>&nbsp;GeoNames</h4>"
    }
  }).on("typeahead:selected", function (obj, datum) {
    if (datum.source === "FishFrys") {
      if (!map.hasLayer(fishFryLayer)) {
        map.addLayer(fishFryLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "GeoNames") {
      map.setView([datum.lat, datum.lng], 14);
    }
    if ($(".navbar-collapse").height() > 50) {
      $(".navbar-collapse").collapse("hide");
    }
  }).on("typeahead:opened", function () {
    $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
    $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
  }).on("typeahead:closed", function () {
    $(".navbar-collapse.in").css("max-height", "");
    $(".navbar-collapse.in").css("height", "");
  });
  $(".twitter-typeahead").css("position", "static");
  $(".twitter-typeahead").css("display", "block");
});

// Leaflet patch to make layer control scrollable on touch browsers
var container = $(".leaflet-control-layers")[0];
if (!L.Browser.touch) {
  L.DomEvent
  .disableClickPropagation(container)
  .disableScrollPropagation(container);
} else {
  L.DomEvent.disableClickPropagation(container);
}
