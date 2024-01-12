// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
let newData = {};
// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  newData = data;
  createFeatures(data.features);
  return newData;
  });

function createFeatures(earthquakeData) {
  
  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
  }
  function createCircle(geoJSON, latLng) {
  } 
  
  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  let earthquakes = L.geoJSON(earthquakeData, {
    //onEachFeature: onEachFeature;
    pointToLayer: createCircle
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}

function createMap(earthquakes) {
  
  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Loop through the newData array, and create one circle for each earthquake object.
  for (let i = 0; i < newData.features.length; i++) {
    // console.log(newData.features.length);
    // Conditionals for depth
    let color = "";
    // console.log(newData.features[i].geometry.coordinates[0])
    if (newData.features[i].geometry.coordinates[2] > 89) {
      color = "darkred";
    }
    else if (newData.features[i].geometry.coordinates[2] > 69) {
      color = "red";
    }
    else if (newData.features[i].geometry.coordinates[2] > 49) {
      color = "lightred";
    }
    else if (newData.features[i].geometry.coordinates[2] > 29) {
        color = "orange";
    }
    else if (newData.features[i].geometry.coordinates[2] > 9) {
        color = "yellow";
    }
    else {
      color = "lightgreen";
    }
    
    // Add circles to the map.
    L.circle([newData.features[i].geometry.coordinates[1], newData.features[i].geometry.coordinates[0]], {
      fillOpacity: 0.75,
      color: color,
      //fillColor: color,
      // Adjust the radius.
      radius: newData.features[i].properties.mag * 20000
    }).bindPopup(`<h3>Location: ${newData.features[i].properties.place}</h3><hr><p>Magnitude: ${newData.features[i].properties.mag}</p><hr><p>Depth: ${newData.features[i].geometry.coordinates[2]}</p>`).addTo(myMap);
  }
}

