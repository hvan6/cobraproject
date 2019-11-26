var map;
Number.prototype.format = function(n, x) {
  var re = '(\\d)(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
  return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$1,');
};

BUYCOLOR = '#1a1aff'; // blue
RENTCOLOR = '#1ec952'; // green
EXCLUDECOLOR = '#41454d'; // grey
BUDGETCOLOR = '#d66711'; // orange

var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
var iconBase2 = 'https://maps.google.com/mapfiles/kml/paddle/';

var lalatlon = {lat:$('#criteriadata').data("lat"),lon:$('#criteriadata').data("lon")};

function round2(num) {
  return Math.round(num * 100) / 100
}

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

var ajaxdata = {
  zipcode: $('#criteriadata').data("zipcode"),
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
  initbudget: $('#criteriadata').data("initbudget"),
  downpayment: $('#criteriadata').data("downpayment"),
  yearlyraise: $('#criteriadata').data("yearlyraise"),
  numyears: $('#criteriadata').data("numyears"),
  queryHouseByCounty: $('#queryHouseByCounty').val()
}

function getmedian() {
  $.ajax({
    url: "/getmedianbyzip",
    // url: "http://ec2-54-183-131-70.us-west-1.compute.amazonaws.com/getmedianbyzip",
    type: 'POST',
    data: ajaxdata,
    beforeSend: function(){
      // Show image container
      showPageLoading();
    },
    success: function(res){
      hidePageLoading();
      drawMedian(res.result);
    },
    error: function(error) {
      hidePageLoading();
      alert("Failed");
      console.error(error);
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
rvb_arr = [];

function drawMedian(result) {
  var arrayD = JSON.parse(result.toString());
  arrayD.map(function(d,i) {
    position = {lat: d.ziplat, lng: d.ziplon};
    // median circle
    var cir = new google.maps.Circle({
      strokeColor: '#4daf4a', // green
      strokeOpacity: 0.6,
      strokeWeight: 1,
      fillColor: '#4daf4a',
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
    // Create an mouseover event to open an infowindow at each marker.
    cir.addListener('mouseover', function() {
      cir_popup(this, largeInfowindow);
    });

    // mean circle
    var cir_mean = new google.maps.Circle({
      strokeColor: '#377eb8', // blue
      strokeOpacity: 0.6,
      strokeWeight: 1,
      fillColor: '#377eb8',
      fillOpacity: 0.35,
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
    // Create an mouseover event to open an infowindow at each marker.
    cir_mean.addListener('mouseover', function() {
      cir_popup(this, largeInfowindow);
    });

    // tax amount average
    var tax_mean = new google.maps.Circle({
      strokeColor: '#fdbf6f', // orange
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#fdbf6f',
      fillOpacity: 0.35,
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
    // Create an mouseover event to open an infowindow at each marker.
    tax_mean.addListener('mouseover', function() {
      cir_popup(this, largeInfowindow);
    });

    // recommendation circle
    if (d.label === 1) {
      fcolor = BUYCOLOR; // blue : buy
    } else if (d.label === 2) {
      fcolor = RENTCOLOR; // green : rent
    } else {
      fcolor = EXCLUDECOLOR; // grey: exclude
    }
    var rvb = new google.maps.Marker({
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        strokeWeight: 3,
        strokeColor: 'white',
        fillColor: fcolor,
        fillOpacity: 1
      },
      position: position,
      radius: d.taxmean/10,
      zip: d.zipcode,
      median: d.median,
      mean: d.mean,
      taxmean: d.taxmean,
      city: d.city,
      rent_net: d.rent_net,
      buy_net: d.buy_net,
      rent_cost: d.rent_cost,
      buy_cost: d.buy_cost,
      budget: d.budget
    })
    rvb_arr.push(rvb);
    rvb.addListener('click', function() {
      rvb_popup(this, largeInfowindow);
    });
    rvb.addListener('mouseover',function() {
      rvb.icon.scale = 8
      var content = `
        <div class=tip>
        <table style="margin-top: 2.5px;">
            <tr><td>City: </td><td>&nbsp;` + this.city + `</td></tr>
            <tr><td>Zip Code: </td><td>&nbsp;` + this.zip + `</td></tr>
            <tr><td>Median Price: </td><td>&nbsp;$` + round2(this.median).format(2) + `</td></tr>
            <tr><td>Mean Price: </td><td>&nbsp;$` + round2(this.mean).format(2) + `</td></tr>
            <tr><td>Tax Average: </td><td>&nbsp;$` + round2(this.taxmean).format(2) + `</td></tr>
        </table>
        </div>`;
      largeInfowindow.setContent(content);
      largeInfowindow.rvb = null;
      largeInfowindow.open(map, rvb); // open at marker's location
    });
  });
  recommendation();
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
      </div>`;
    infowindow.setContent(content);
    infowindow.open(map, cir);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.cir = null;
    });
  }
}

function rvb_popup(rvb, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.rvb != rvb) {
    infowindow.rvb = rvb;
    var r = rvb.rent_net;
    var b = rvb.buy_net;
    var r_cost = rvb.rent_cost;
    var b_cost = rvb.buy_cost;
    var budget = rvb.budget;
    var maxYear = r.length;

    // Set data
    var netvalue = []; // Net value curve
    var cost = []; // Cost and Budget
    for (var i=0; i<maxYear; i++) {
      netvalue.push({ year:i+1, 'rent': round2(r[i]), 'buy': round2(b[i]) });
      cost.push({ year:i+1, 'rent': round2(r_cost[i]), 'buy': round2(b_cost[i]), 'budget': round2(budget[i]) })
    }

    //code for D3 graph
    var margin = {
      top: 30,
      right: 70,
      bottom: 40,
      left: 70
    };
    var width = 450 - margin.left - margin.right;
    var height = 300 - margin.top - margin.bottom;

    // Graph Net Value
    var extendR = d3.extent(r);
    var extendB = d3.extent(b);
    var minY = Math.min(round2(extendR[0]),round2(extendB[0]));
    var maxY = Math.max(round2(extendR[1]),round2(extendB[1]));
    var xScale = d3.scaleLinear().domain([1, maxYear]).range([0,width]);
    var yScale = d3.scaleLinear().domain([0, maxY]).range([height, 0]);
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale).ticks(5);
    // create line generator
    var lineRent = d3.line()
      .x(function(d,i){ return xScale(d.year); })
      .y(function(d,i){ return yScale(d.rent); })
      .curve(d3.curveMonotoneX);
    var lineBuy = d3.line()
      .x(function(d,i){ return xScale(d.year); })
      .y(function(d,i){ return yScale(d.buy); })
      .curve(d3.curveMonotoneX);

    var div1 = document.createElement("div");
    div1.setAttribute("class", "netvalue");
    div1.setAttribute("id", "netvalue");

    var container = d3.select(div1)
      .attr("width", 500)
      .attr("height", 300);

    var svg = container.append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g") // Add the X Axis
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.append("g") // Add the Y Axis
      .attr("class", "y axis")
      .call(yAxis);

    // add graph
    svg.append("path")
      .datum(netvalue)
      .attr("class", "linerent")
      .attr("d", lineRent);
    svg.append("path")
      .datum(netvalue)
      .attr("class", "linebuy")
      .attr("d", lineBuy);

    // add dots
    svg.selectAll(".dotRent")
      .data(netvalue)
    .enter().append("circle") // Uses the enter().append() method
      .attr("class", "dotRent") // Assign a class for styling
      .attr("cx", function(d) { return xScale(d.year) })
      .attr("cy", function(d) { return yScale(d.rent) })
      .attr("r", 3)
    svg.selectAll(".dotBuy")
      .data(netvalue)
    .enter().append("circle") // Uses the enter().append() method
      .attr("class", "dotBuy") // Assign a class for styling
      .attr("cx", function(d) { return xScale(d.year) })
      .attr("cy", function(d) { return yScale(d.buy) })
      .attr("r", 3)

    // text label for the x axis
    svg.append("text")
      .attr("class", "axisTitle")
      .attr("transform", "translate(" + (width/2) + " ," + (height + margin.bottom/2 + 10) + ")")
      .style("text-anchor", "middle")
      .text("Occupied Year");

    // text label for the y axis
    svg.append("text")
      .attr("class", "axisTitle")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left/2 - 18)
      .attr("x", 0 - height/2)
      .style("text-anchor", "middle")
      .text("Net Value ($)");

    // add title of graph
    svg.append("text").attr("x", width/2)
      .attr("class", "g1-title")
      .attr("y", 0-margin.top/2)
      .style("text-anchor", "middle")
      .text('Rent vs Buy Net Value');

    // line Data for legend
    var lineData = [
      { name: 'Rent', color : RENTCOLOR},
      { name: 'Buy', color: BUYCOLOR}
    ];

    // add legend group
    var g1legend = svg.selectAll(".lineLegend").data(lineData).enter().append("g")
      .attr("class","lineLegend")
      .attr("transform", function(d,i) {
        return "translate(" + (width) + "," + (i*20) + ")"
      });
    // add square legend
    g1legend.append("circle")
      .attr("fill", function (d) { return d.color; })
      .attr("cx", 10).attr("cy", 10).attr("r", 4)
      .attr("transform", "translate(6,-4)");
    // add text legend
    g1legend.append("text").text(function (d) {return d.name;})
      .attr("transform", "translate(28,10)");

    // Graph Monthly Budget
    var extendR2 = d3.extent(r_cost);
    var extendB2 = d3.extent(b_cost);
    var extendBG = d3.extent(budget);
    var minY2 = Math.min(round2(extendR2[0]),round2(extendB2[0]),round2(extendBG[0]));
    var maxY2 = Math.max(round2(extendR2[1]),round2(extendB2[1]),round2(extendBG[1]));
    var xScale2 = d3.scaleLinear().domain([1, maxYear]).range([0,width]);
    var yScale2 = d3.scaleLinear().domain([0, maxY2]).range([height, 0]);
    var xAxis2 = d3.axisBottom(xScale2);
    var yAxis2 = d3.axisLeft(yScale2).ticks(5);
    // create line generator
    var lineRent = d3.line()
      .x(function(d,i){ return xScale2(d.year); })
      .y(function(d,i){ return yScale2(d.rent); })
      .curve(d3.curveMonotoneX);
    var lineBuy = d3.line()
      .x(function(d,i){ return xScale2(d.year); })
      .y(function(d,i){ return yScale2(d.buy); })
      .curve(d3.curveMonotoneX);
    var linebudget  = d3.line()
      .x(function(d,i){ return xScale2(d.year); })
      .y(function(d,i){ return yScale2(d.budget); })
      .curve(d3.curveMonotoneX);

    var div2 = document.createElement("div");
    div2.setAttribute("class", "budget");
    div2.setAttribute("id", "budget");
    var container2 = d3.select(div2)
      .attr("width", 500)
      .attr("height", 300);

    var svg2 = container2.append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg2.append("g") // Add the X Axis
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis2);

    svg2.append("g") // Add the Y Axis
      .attr("class", "y axis")
      .call(yAxis2);

    // add graph
    svg2.append("path")
      .datum(cost)
      .attr("class", "linerent")
      .attr("d", lineRent);
    svg2.append("path")
      .datum(cost)
      .attr("class", "linebuy")
      .attr("d", lineBuy);
    svg2.append("path")
      .datum(cost)
      .attr("class", "linebudget")
      .attr("d", linebudget);

    // add dots
    svg2.selectAll(".dotRent")
      .data(cost)
    .enter().append("circle") // Uses the enter().append() method
      .attr("class", "dotRent") // Assign a class for styling
      .attr("cx", function(d) { return xScale2(d.year) })
      .attr("cy", function(d) { return yScale2(d.rent) })
      .attr("r", 3)
    svg2.selectAll(".dotBuy")
      .data(cost)
    .enter().append("circle") // Uses the enter().append() method
      .attr("class", "dotBuy") // Assign a class for styling
      .attr("cx", function(d) { return xScale2(d.year) })
      .attr("cy", function(d) { return yScale2(d.buy) })
      .attr("r", 3)
    svg2.selectAll(".dotBudget")
      .data(cost)
    .enter().append("circle") // Uses the enter().append() method
      .attr("class", "dotBudget") // Assign a class for styling
      .attr("cx", function(d) { return xScale2(d.year) })
      .attr("cy", function(d) { return yScale2(d.budget) })
      .attr("r", 3)
    // text label for the x axis
    svg2.append("text")
      .attr("class", "axisTitle")
      .attr("transform", "translate(" + (width/2) + " ," + (height + margin.bottom/2 + 10) + ")")
      .style("text-anchor", "middle")
      .text("Occupied Year");

    // text label for the y axis
    svg2.append("text")
      .attr("class", "axisTitle")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left/2 - 18)
      .attr("x", 0 - height/2)
      .style("text-anchor", "middle")
      .text("Budget ($)");

    // add title of graph
    svg2.append("text").attr("x", width/2)
      .attr("class", "g1-title")
      .attr("y", 0-margin.top/2)
      .style("text-anchor", "middle")
      .text('Budget');

    // line Data for legend
    var lineData2 = [
      { name: 'Rent', color : RENTCOLOR},
      { name: 'Buy', color: BUYCOLOR},
      { name: 'Budget', color: BUDGETCOLOR}
    ];

    // add legend group
    var g1legend2 = svg2.selectAll(".lineLegend").data(lineData2).enter().append("g")
      .attr("class","lineLegend")
      .attr("transform", function(d,i){
        return "translate(" + (width) + "," + (i*20) + ")"
      });
    // add square legend
    g1legend2.append("circle")
      .attr("fill", function (d) { return d.color; })
      .attr("cx", 10).attr("cy", 10).attr("r", 4)
      .attr("transform", "translate(6,-4)");
    // add text legend
    g1legend2.append("text").text(function (d) {return d.name;})
      .attr("transform", "translate(28,10)");

    // Add to pop up
    var graphHtml = container.node().outerHTML;
    var graphHtml2 = container2.node().outerHTML;
    infowindow.setContent(graphHtml+graphHtml2);

    infowindow.open(map, rvb);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.rvb = null;
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
}

function circle_taxmean_hide() {
  for (var i = 0; i < taxmean_arr.length; i++) {
    taxmean_arr[i].setMap(null);
  }
}

// draw recommendation
function recommendation() {
  var bounds = new google.maps.LatLngBounds();
  // Extend the boundaries of the map for each marker and display the marker
  for (var i = 0; i < rvb_arr.length; i++) {
    rvb_arr[i].setMap(map);
    bounds.extend(rvb_arr[i].position);
  }
}
function recommendation_hide() {
  for (var i = 0; i < rvb_arr.length; i++) {
    rvb_arr[i].setMap(null);
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

$("#recommendation").change(function(){
  if (this.checked) {
    recommendation();
  } else {
    recommendation_hide();
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
    },
    {
      featureType: 'administrative',
      elementType: 'labels.text.stroke',
      stylers: [
        { color: '#ffffff' },
        { weight: 6 }
      ]
    },
    {
      featureType: 'administrative',
      elementType: 'labels.text.fill',
      stylers: [
        { color: '#e85113' }
      ]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [
        { color: '#efe9e4' },
        { lightness: -40 }
      ]
    },
    {
      featureType: 'transit.station',
      stylers: [
        { weight: 9 },
        { hue: '#e85113' }
      ]
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.icon',
      stylers: [
        { visibility: 'off' }
      ]
    },
    {
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [
        { lightness: 100 }
      ]
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [
        { lightness: -100 }
      ]
    },
    {
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [
        { visibility: 'on' },
        { color: '#f0e4d3' }
      ]
    },
    {
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

  largeInfowindow = new google.maps.InfoWindow();

  // draw user zip marker
  var marker = new google.maps.Marker({
    position: {lat: lalatlon.lat, lng: lalatlon.lon},
    map: map,
    // animation: google.maps.Animation.DROP,
    title: ajaxdata.zipcode.toString(),
    icon: iconBase2 + 'ylw-blank.png'
  });
}
