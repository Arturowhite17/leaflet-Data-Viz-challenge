// API all months via link stored into Url variable
var Url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Get Request for data performed
d3.json(Url, function(data) {
  //data object passed features attributes
    createFeatures(data.features);
  });
  
  function createFeatures(eqData) {
  
    // streetmap layer
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 16,
      id: "mapbox.streets",
      accessToken: API_KEY
    });
  
    // darkmap layer
    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 16,
      id: "mapbox.dark",
      accessToken: API_KEY
    });
  
    //Array creatated to hold looped data and apply features
    var circleArray = new Array();
  
    // Loop through the cities array and create one marker for each earthquake object
    for (var i = 0; i < eqData.length; i++) {
  
      coordinates = [eqData[i].geometry.coordinates[1],eqData[i].geometry.coordinates[0]]
      properties = eqData[i].properties;
  
      var color = "#d7191c";
      if (properties.mag < 1) {
        color = "#00ccbc";
      }
      else if (properties.mag < 2) {
        color = "#90eb9d";
      }
      else if (properties.mag < 3) {
        color = "#f9d057";
      }
      else if (properties.mag < 4) {
        color = "#f29e2e";
      }
      else if (properties.mag < 5) {
        color = "#e76818";
      }
  
      // Circle features
      var Circle = L.circle(coordinates, {
        fillOpacity: 0.75,
        color: color,
        fillColor: color,
        // dimesion - radius
        radius: (properties.mag * 15000)
      }).bindPopup("<h1>" + properties.place + "</h1> <hr> <h3>Magnitud: " + properties.mag.toFixed(2) + "</h3>");
      //push circles into circle array 
      circleArray.push(Circle);
    }
  
    //layer for the circles
    var earthquakes = L.layerGroup(circleArray);
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap
    };
  
    // earthquake overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // map with earthquake added
    var myMap = L.map("map", {
      center: [37.09, -95.71],
      zoom: 5,
      layers: [streetmap,earthquakes]
    });
  
    // Create a layer control
    // basemaps added
    // pass to main map layer
    L.control.layers(baseMaps,overlayMaps, {
       collapsed: false
    }).addTo(myMap);
  
    //leagend setup
    var legend = L.control({position: 'bottomright'});
  
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        var grades = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
      var color = ["#00ccbc","#90eb9d","#f9d057","#f29e2e","#e76818","#d7191c"];
  
        // make labels by iterating 
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<p style="margin-left: 15px">' + '<i style="background:' + color[i] + ' "></i>' + '&nbsp;&nbsp;' + grades[i]+ '<\p>';
        }
  
        return div;
    };
    //add legend to map from leagend setup 
    legend.addTo(myMap)
  
    //overlay fuction to add map DOM event 
    myMap.on('overlayadd', function(a) {
      legend.addTo(myMap);
    });
  
    //overlay fuction to remove map DOM event 
    myMap.on('overlayremove', function(a) {
      myMap.removeControl(legend);
    });
  }