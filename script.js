// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// We create the second tile layer that will be the background of our map.
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// We create the third tile layer that will be the background of our map.
let dark = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});



// read in data
var siteMarkers = []
d3.csv("map_info.csv").then(function(data) {
console.log(data)
var lat_lng = data.map(item=>{
  var l = []
  
  l[0] = item["Latitude"]
  l[1] = item["Longitude"]

return l 
})
console.log(lat_lng)
for(var i=0; i<lat_lng.length;i++){
  var marker = L.circleMarker(lat_lng[i], { 
    opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(data[i]),
      color: "#000000",
      radius: getRadius(data[i]),
      stroke: true,
      weight: 0.5
  })
  
  marker.bindPopup(`<h4>${data[i]["Park Name"]}</h4><hr>Acres: ${data[i]["ACRES"]}<br>Native: ${data[i]["Native"]}<br>Not Native: ${data[i]["Not Native"]}`)
  siteMarkers.push(marker)
}
var siteLayer = L.layerGroup(siteMarkers)

function getRadius(acres){
  var acreData = acres["ACRES"]
  if (acreData>2000000)
  return acreData/250000
  return acreData/50000
}

  // This function determines the color of the marker based on the magnitude of the earthquake.
  function getColor(acres) {
    var acreData = acres["ACRES"]
    if (acreData > 9000000) {
      return "#ea2c2c";
    }
    if (acreData > 8000000) {
      return "#ea822c";
    }
    if (acreData > 4000000) {
      return "#ee9c00";
    }
    if (acreData > 200000) {
      return "#eecc00";
    }
    if (acreData > 100000) {
      return "#d4ee00";
    }
    return "#98ee00";
  }

  
// Create the map object with center, zoom level and default layer.
let map = L.map('mapid', {
	center: [40.7, -94.5],
	zoom: 3,
	layers: [satelliteStreets, siteLayer]
});

// Create a base layer that holds all three maps.
let baseMaps = {
  "Streets": streets,
  "Satellite": satelliteStreets,
  "Dark": dark
};


let overlays = {
  "Acres": siteLayer,
 

};

// Then we add a control to the map that will allow the user to change which
// layers are visible.
L.control.layers(baseMaps, overlays,{
  collapsed:false
}).addTo(map);





  // Here we create a legend control object.
let legend = L.control({
  position: "bottomright"
});

// Then add all the details for the legend
legend.onAdd = function() {
  let div = L.DomUtil.create("div", "info legend");

  const acres = [0, 1, 2, 3, 4, 5];
  const colors = [
    "#98ee00",
    "#d4ee00",
    "#eecc00",
    "#ee9c00",
    "#ea822c",
    "#ea2c2c"
  ];

// Looping through our intervals to generate a label with a colored square for each interval.
  for (var i = 0; i < acres.length; i++) {
    console.log(colors[i]);
    div.innerHTML +=
      "<i style='background: " + colors[i] + "'></i> " +
      acres[i] + (acres[i + 1] ? "&ndash;" + acres[i + 1] + "<br>" : "+");
    }
    return div;
  };

  // Finally, we our legend to the map.
  legend.addTo(map);


  
});