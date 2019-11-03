var map;
// var lalatlon = {lat:34.052235,lon:-118.243683};
var lalatlon = {lat:$('#criteriadata').data("lat"),lon:$('#criteriadata').data("lon")};

function showPageLoading() {
    $("#loader").show();
    $("#popupBackground").css({ "opacity": "0.3", "background": "#000000" });
    $("#popupBackground").show();
}

function hidePageLoading() {
    $("#loader").hide();
    $("#popupBackground").hide();
    $("#popupBackground").css({ "opacity": "0.3", "background": "#000000" });
}

var ajaxdata = { zipcode: $('#criteriadata').data("zipcode"),
                  minbed: $('#criteriadata').data("minbed"),
                  maxbed: $('#criteriadata').data("maxbed"),
                  minbath: $('#criteriadata').data("minbath"),
                  maxbath: $('#criteriadata').data("maxbath"),
                  minbuilt: $('#criteriadata').data("minbuilt"),
                  maxbuilt: $('#criteriadata').data("maxbuilt"),
                  minlotsize: $('#criteriadata').data("minlotsize"),
                  maxlotsize: $('#criteriadata').data("maxlotsize"),
                  lat: $('#criteriadata').data("lat"),
                  lon: $('#criteriadata').data("lon"),
                  queryHouseByCounty: $('#queryHouseByCounty').val()
                }
console.log(ajaxdata);

function getmedian() {
  $.ajax({
    url: "http://localhost:6543/getmedianbyzip",
    type: 'POST',
    data: ajaxdata,
    beforeSend: function(){
    // Show image container
      showPageLoading();
    },
    success: function(res){
      hidePageLoading();
      console.log(res.result);
      drawMedian(res.result);
    },
    error: function(error) {
      hidePageLoading();
      alert("Failed");
      console.log(error);
    },
    complete:function(data){
    // Hide image container
      hidePageLoading();
    }
  });
}

median_arr = [];

function drawMedian(result) {

  var arrayD = JSON.parse(result.toString());
  // console.log(arrayD);

  arrayD.map(function(d,i){
    position = {lat: d.ziplat, lng: d.ziplon};

    var cir = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      //map: map,
      position: position,
      center: position,
      radius: Math.sqrt(d.median),
      zip: d.zipcode,
      median: d.median,
      mean: d.mean,
      city: d.city
    });

    median_arr.push(cir);
    // Create an onclick event to open an infowindow at each marker.
    cir.addListener('click', function() {
      cir_popup(this, largeInfowindow);
    });
  });

  circlemedian();
}

function cir_popup(cir, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.cir != cir) {
    infowindow.cir = cir;
    var content = `
      <div class=tip>
      <table style="margin-top: 2.5px;">
          <tr><td>City: </td><td>` + cir.city + `</td></tr>
          <tr><td>Zip Code: </td><td>` + cir.zip + `</td></tr>
          <tr><td>Median Price: </td><td>$` + cir.median + `</td></tr>
      </table>
      </div>
      `;
    infowindow.setContent(content);
    infowindow.open(map, cir);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.cir = null;
    });
  }
}

// draw median circle
function circlemedian() {
  var bounds = new google.maps.LatLngBounds();
  // Extend the boundaries of the map for each marker and display the marker
  for (var i = 0; i < median_arr.length; i++) {
    median_arr[i].setMap(map);
    bounds.extend(median_arr[i].position);
  }
  map.fitBounds(bounds);
  map.setZoom(12);
}

function initMap() {
  // call ajax to get median
  getmedian();
  // Create a styles array to use with the map.
  var styles = [
    {
      featureType: 'water',
      stylers: [
        { color: '#19a0d8' }
      ]
    },{
      featureType: 'administrative',
      elementType: 'labels.text.stroke',
      stylers: [
        { color: '#ffffff' },
        { weight: 6 }
      ]
    },{
      featureType: 'administrative',
      elementType: 'labels.text.fill',
      stylers: [
        { color: '#e85113' }
      ]
    },{
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [
        { color: '#efe9e4' },
        { lightness: -40 }
      ]
    },{
      featureType: 'transit.station',
      stylers: [
        { weight: 9 },
        { hue: '#e85113' }
      ]
    },{
      featureType: 'road.highway',
      elementType: 'labels.icon',
      stylers: [
        { visibility: 'off' }
      ]
    },{
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [
        { lightness: 100 }
      ]
    },{
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [
        { lightness: -100 }
      ]
    },{
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [
        { visibility: 'on' },
        { color: '#f0e4d3' }
      ]
    },{
      featureType: 'road.highway',
      elementType: 'geometry.fill',
      stylers: [
        { color: '#efe9e4' },
        { lightness: -25 }
      ]
    }
  ];

  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: lalatlon.lat, lng: lalatlon.lon},
    zoom: 13,
    styles: styles,
    mapTypeControl: false
  });

  // var largeInfowindow = new google.maps.InfoWindow();
  largeInfowindow = new google.maps.InfoWindow();

} // end of initMap()
