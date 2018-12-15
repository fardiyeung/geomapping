

// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
// Once we get a response, send the data.features object to the createFeatures function
createFeatures(data.features);

});




function getColor(d) {
  return d < 1 ? 'rgb(255,245,245)' :
  d < 2 ? 'rgb(255,205,205)' :
  d < 3 ? 'rgb(255,166,166)' :
  d < 4 ? 'rgb(255,127,127)' :
  d < 5 ? 'rgb(255,88,88)' :
  d <= 6 ? 'rgb(255,58,58)' :
  'rgb(255,5,5)';
  }

function createFeatures(earthquakeData) {

// Define a function we want to run once for each feature in the features array
// Give each feature a popup describing the place and time of the earthquake
function onEachFeature(feature, layer) {
layer.bindPopup("<h3>" + feature.properties.place +
"</h3><hr>" + "<h3>Magnitude: " + feature.properties.mag + "</h3><hr>" +
"<p>" + new Date(feature.properties.time) + "</p >");

}


// Create a GeoJSON layer containing the features array on the earthquakeData object
// Run the onEachFeature function once for each piece of data in the array
var earthquakes = L.geoJSON(earthquakeData, {
onEachFeature: onEachFeature,
pointToLayer: function (feature, latlng) {

return L.circleMarker(latlng, {
radius: feature.properties.mag*5,
fillColor: getColor(feature.properties.mag),
color: "#000",
weight: 1,
opacity: 1,
fillOpacity: 0.8
});
}

});




// Sending our earthquakes layer to the createMap function
createMap(earthquakes);
}


function createMap(earthquakes) {

 
  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  var sateliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id:"mapbox.streets-satellite",
    accessToken: API_KEY
}); 



var boundariesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"


// Grabbing our GeoJSON data for tectonic plates..
var boundary = d3.json(boundariesUrl, function(boundarydata) {
  // Creating a GeoJSON layer with the retrieved data
  
  L.geoJson(boundarydata).addTo(myMap)

});
var boundaryGroup = L.layerGroup(boundary);

// add orogen layer
var orogenUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_orogens.json"

// Grabbing our GeoJSON data..
var orogen = d3.json(orogenUrl, function(orogendata) {
  // Creating a GeoJSON layer with the retrieved data
  
  L.geoJson(orogendata).addTo(myMap)
});

// var orogenGroup = L.layerGroup(orogen);




// add plate layer
var plateUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json"

// Grabbing our GeoJSON data..
var plate = d3.json(plateUrl, function(platedata) {
  // Creating a GeoJSON layer with the retrieved data
  
  L.geoJson(platedata).addTo(myMap)
});

// var plateGroup = L.layerGroup(plate);

// add step layer
// var stepUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_steps.json"

// // Grabbing our GeoJSON data..
// var step = d3.json(stepUrl, function(stepdata) {
//   // Creating a GeoJSON layer with the retrieved data
  
//   L.geoJson(stepdata).addTo(myMap)
// });

// var stepGroup = L.layerGroup(step);




  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap,
    "Satelite Map": sateliteMap
    
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes,
    Boundary: boundaryGroup
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });




  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);



// Set up the legend
var legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
var div = L.DomUtil.create("div", "info legend");
var grade=[0, 1, 2, 3, 4, 5, 6]; 
// var colorlegend=['rgb(102, 255, 51)','rgb(255, 255, 102)','rgb(255, 204, 0)',
// 'rgb(255, 102, 0)','rgb(153, 51, 0)','rgb(255,105,105)'];
var grades = ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '>6'];


// var legendInfo ="<div class=\"labels\">" +
var legendInfo = "<div class='min' style= 'text-align:center; color:green;'><b>" + "Magnitude"+ "</b></div>" +
"<div class='min' style= 'background-color:" + getColor(grade[0]) + ";text-align:center'>" + grades[0] + "</div>" +
"<div class='min' style= 'background-color:" + getColor(grade[1]) + ";text-align:center'>" +  grades[1] + "</div>" +
"<div class='min' style= 'background-color:" + getColor(grade[2]) + ";text-align:center'>" +  grades[2] + "</div>" +
"<div class='min' style= 'background-color:" + getColor(grade[3]) + ";text-align:center'>" +  grades[3] + "</div>" +
"<div class='min' style= 'background-color:" + getColor(grade[4]) + ";text-align:center'>" +  grades[4] + "</div>" +
"<div class='min' style= 'background-color:" + getColor(grade[5]) + ";text-align:center'>" +  grades[5] + "</div>" +
"<div class='min' style= 'background-color:" + getColor(grade[6]) + ";text-align:center'>" +  grades[6] + "</div>" +
"</div>";
div.innerHTML = legendInfo;

return div;
};
// Adding legend to the map
legend.addTo(myMap);

};





