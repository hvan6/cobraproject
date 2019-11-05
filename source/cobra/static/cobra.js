var map;
Number.prototype.format = function(n, x) {
    var re = '(\\d)(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$1,');
};
var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';

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
    url: "/getmedianbyzip",
    //url: "http://ec2-54-183-131-70.us-west-1.compute.amazonaws.com/getmedianbyzip",
    type: 'POST',
    data: ajaxdata,
    beforeSend: function(){
    // Show image container
      showPageLoading();
    },
    success: function(res){
      hidePageLoading();
      // console.log(res.result);
      // console.log("success");
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
mean_arr = [];
taxmean_arr = [];

function drawMedian(result) {

  var arrayD = JSON.parse(result.toString());
  // console.log(arrayD);

  arrayD.map(function(d,i){
    position = {lat: d.ziplat, lng: d.ziplon};

    // median circle
    var cir = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.6,
      strokeWeight: 1,
      fillColor: '#FF0000',
      fillOpacity: 0.3,
      //map: map,
      position: position,
      center: position,
      radius: Math.sqrt(d.median)*1.5,
      zip: d.zipcode,
      median: d.median,
      mean: d.mean,
      taxmean: d.taxmean,
      city: d.city
    });
    median_arr.push(cir);
    // Create an onclick event to open an infowindow at each marker.
    cir.addListener('click', function() {
      cir_popup(this, largeInfowindow);
    });

    // mean circle
    var cir_mean = new google.maps.Circle({
      strokeColor: '#0000FF',
      strokeOpacity: 0.6,
      strokeWeight: 1,
      fillColor: '#0000FF',
      fillOpacity: 0.35,
      //map: map,
      position: position,
      center: position,
      radius: Math.sqrt(d.mean)*1.5,
      zip: d.zipcode,
      median: d.median,
      mean: d.mean,
      taxmean: d.taxmean,
      city: d.city
    });
    mean_arr.push(cir_mean);
    // Create an onclick event to open an infowindow at each marker.
    cir_mean.addListener('click', function() {
      cir_popup(this, largeInfowindow);
    });

    // tax amount average
    var tax_mean = new google.maps.Circle({
      strokeColor: '#00FF00',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#00FF00',
      fillOpacity: 0.35,
      //map: map,
      position: position,
      center: position,
      radius: d.taxmean/10,
      zip: d.zipcode,
      median: d.median,
      mean: d.mean,
      taxmean: d.taxmean,
      city: d.city
    });
    taxmean_arr.push(tax_mean);
    // Create an onclick event to open an infowindow at each marker.
    tax_mean.addListener('click', function() {
      cir_popup(this, largeInfowindow);
    });

  });

  circlemedian();
}

function cir_popup(cir, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.cir != cir) {
    infowindow.cir = cir;
    var valmedian = parseFloat(cir.median);
    var valmean = parseFloat(cir.mean);
    var valtaxmean = parseFloat(cir.taxmean);

    var content = `
      <div class=tip>
      <table style="margin-top: 2.5px;">
          <tr><td>City: </td><td>&nbsp;` + cir.city + `</td></tr>
          <tr><td>Zip Code: </td><td>&nbsp;` + cir.zip + `</td></tr>
          <tr><td>Median Price: </td><td>&nbsp;$` + valmedian.format(2) + `</td></tr>
          <tr><td>Mean Price: </td><td>&nbsp;$` + valmean.format(2) + `</td></tr>
          <tr><td>Tax Average: </td><td>&nbsp;$` + valtaxmean.format(2) + `</td></tr>
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
  // map.fitBounds(bounds);
  // map.setZoom(12);
}

function circlemedian_hide() {
  for (var i = 0; i < median_arr.length; i++) {
    median_arr[i].setMap(null);
  }
}

// draw mean circle
function circle_mean() {
  var bounds = new google.maps.LatLngBounds();
  // Extend the boundaries of the map for each marker and display the marker
  for (var i = 0; i < mean_arr.length; i++) {
    mean_arr[i].setMap(map);
    bounds.extend(mean_arr[i].position);
  }
  // map.fitBounds(bounds);
  // map.setZoom(12);
}

function circle_mean_hide() {
  for (var i = 0; i < mean_arr.length; i++) {
    mean_arr[i].setMap(null);
  }
}

// draw tax average
function circle_taxmean() {
  var bounds = new google.maps.LatLngBounds();
  // Extend the boundaries of the map for each marker and display the marker
  for (var i = 0; i < taxmean_arr.length; i++) {
    taxmean_arr[i].setMap(map);
    bounds.extend(taxmean_arr[i].position);
  }
  // map.fitBounds(bounds);
  // map.setZoom(12);
}

function circle_taxmean_hide() {
  for (var i = 0; i < taxmean_arr.length; i++) {
    taxmean_arr[i].setMap(null);
  }
}

$("#medianPrice").change(function(){
  if (this.checked) {
    circlemedian();
  } else {
    circlemedian_hide();
  }
});

$("#meanPrice").change(function(){
  if (this.checked) {
    circle_mean();
  } else {
    circle_mean_hide();
  }
});

$("#meanTax").change(function(){
  if (this.checked) {
    circle_taxmean();
  } else {
    circle_taxmean_hide();
  }
});

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
    zoom: 12,
    styles: styles,
    mapTypeControl: false
  });

  // var largeInfowindow = new google.maps.InfoWindow();
  largeInfowindow = new google.maps.InfoWindow();

  // draw user zip marker
  console.log(lalatlon);
  var marker = new google.maps.Marker({
    position: {lat: lalatlon.lat, lng: lalatlon.lon},
    map: map,
    animation: google.maps.Animation.DROP,
    title: ajaxdata.zipcode,
    icon: iconBase + 'homegardenbusiness.png'
  });

} // end of initMap()
