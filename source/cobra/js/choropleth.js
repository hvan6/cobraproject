// =====================================================================
// global variables
var parseYear = d3.timeParse("%Y");
var margin = { left:50, right:150, top:50, bottom:50 };
var size = { width:800, height:500 };
var colorSequential = ["#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#a50f15","#67000d"];
var legendTitle = ["0", "1 to 4", "5 to 9", "10 to 49", "50 to 99"
                    , "100 to 499", "500 to 999", "1000 to 1499", "1500 and above"];
var Threshold = [1, 5, 10, 50, 100, 500, 1000, 1500];
// =====================================================================
// use promise load all files
Promise.all([
    d3.csv("state-earthquakes.csv"),
    d3.json("states-10m.json"),
]).then(function(files) {
    var EQdata = files[0];
    var geoData = files[1];

    // geo data
    var stateData = geoData.objects.states;
    var featureData = topojson.feature(geoData, stateData).features;
    //var projection = d3.geoAlbersUsa().scale(900).translate([487.5, 305]);
    var projection = d3.geoAlbersUsa().scale(1000)
        .translate([size.width/2, size.height/2]);
    var geoGenerator = d3.geoPath().projection(projection);

    // create svg
    var svg = d3.select("#choropleth").append("svg")
        .attr("width", size.width + margin.left + margin.right)
        .attr("height", size.height + margin.top + margin.bottom);

    // merge geoJson with EQ data
    EQdata.forEach(function(d){
        var dataState = d.States;
        var totalEQ = +d["Total Earthquakes"];
        var region = d.Region;

        //Find the coresponding state inside the GeoJson
        featureData.some(function(m){
            if (m.properties.name === dataState) {
                // copy total EQ and Region into the GeoJson data
                m.properties.value = totalEQ;
                m.properties.region = region;
                return true;
            }

        });
    });

    var thresholdScale = d3.scaleThreshold()
                        .domain(Threshold)
                        .range(colorSequential);

    // create group
    var g = svg.append("g")
        .attr("class","state")
        .attr("transform","translate(" + (margin.left) + "," +(margin.top) + ")");

    // Initialize tooltip
    var tip = d3.tip().attr("class","tip").direction('e').offset([0,0])
        .html(function(d) {
            var content =`
                <table style="margin-top: 2.5px;">
                    <tr><td>State: </td><td>` + d.properties.name + `</td></tr>
                    <tr><td>Region: </td><td>` + d.properties.region + `</td></tr>
                    <tr><td>Earthquakes: </td><td>` + d.properties.value + `</td></tr>
                </table>
                `;
            return content;
        });
    // Invoke the tip
    svg.call(tip);

    // draw map
    g.selectAll("path")
        .data(featureData)
        .enter().append("path")
        .attr("d", geoGenerator)
        .style("fill", function(d){ return thresholdScale(d.properties.value); })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    // add legend top title
    g.append("text").attr("class","legendTit")
        .text("Earthquake Frequency")
        .attr("transform", "translate(" + (size.width) + ",55)");

    // add legend group
    var glegend = g.selectAll(".Legend").data(legendTitle).enter().append("g")
    .attr("class","Legend")
    .attr("transform", function(d,i){
        return "translate(" + (size.width) + "," + (i*25) + ")"
    });

    // add square legend
    glegend.append("rect")
        .attr("class","rectLegend")
        .attr("fill", function (d, i) { return colorSequential[i]; })
        .attr("width", 20).attr("height", 20)
        .attr("transform", "translate(0,65)");

    // add text legend
    glegend.append("text").text(function (d,i) {return legendTitle[i];})
        .attr("transform", "translate(25,80)");

}).catch(function(err) {
    // handle error here
    console.log("Error: " + err);
})
