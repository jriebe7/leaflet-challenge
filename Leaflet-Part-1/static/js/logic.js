// set variable for api endpoint
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL.
d3.json(queryUrl).then(function(data) {
   createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  // set the getColor function to assign color based earthquake on depth.
  function getColor(depth) {
    if (depth < 10) {
      return "#abebc6";
    } else if (depth < 30) {
      return "#f7dc6f";
    } else if (depth < 50) {
      return "#f5b041";
    } else if (depth < 70) {
      return "#af601a";
    } else if (depth < 90) {
      return "#cd6155";
    } else {
      return "#fc3005";
    }
  }

  // create onEachFeature function and add popup
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><h3>Magnitude: ${feature.properties.mag}</h3><hr><h3>Depth: ${feature.geometry.coordinates[2]}km</h3><hr><p>${new Date(feature.properties.time)}</p>`);
  }


 let earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, {
        radius: feature.properties.mag/5 * 25,
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
    },
    onEachFeature: onEachFeature
  });

  // Apply earthquakes layer to the createMap function.
  createMap(earthquakes);
}

function createMap(earthquakes) {
  // Create the base layers.
  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

  // Create a baseMaps object.
  let baseMaps = {
    "Topographic Map": topo
  };

  // Create an overlay object
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create map
  let myMap = L.map("map", {
    center: [39.736168, -96.134205],
    zoom: 3,
    layers: [topo, earthquakes]
  });

  // Create a layer control.

  L.control.layers(baseMaps, overlayMaps,{
    collapsed: false
  }).addTo(myMap);


// Create legend
let legend = L.control({position: 'bottomright'});

legend.onAdd = function () {

    let div = L.DomUtil.create('div', 'info legend')
        grades = [0, 10, 30, 50, 70, 90]
        labels = ["#abebc6", "#f7dc6f", "#f5b041", "#af601a", "#cd6155", "#fc3005"];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + labels[i] + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);
}
