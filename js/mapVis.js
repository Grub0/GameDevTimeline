var svg,
    map, 
    dataset,
    yearShown,
    animating;

var width = 800,
    height = 450;

var centered;
var gPaths, gBubbles;
var radius = 2;

// Set the map's projection type
var projection = d3.geo.mercator()
    .translate([width/2 + 100, height/2 + 220]);

var path = d3.geo.path()
    .projection(projection);

var mapLegend = [
    {id:"developer", key:"Developer", color:"#BEF600"},
    {id:"onlineDeveloper", key:"Online Developer", color:"#9639AD"},
    {id:"publisher", key:"Publisher", color:"#FFDE12"},
    {id:"mobileHandheld", key:"Mobile/Handheld", color:"#FF2F7C"},
    {id:"organization", key:"Organization", color:"#00ADBC"},
    {id:"multipleCategories", key:"Multiple Categories", color:"#FFF"}
];


d3.json("data/video_game_developers.json", function(error, data) {

    // Check if the file loaded correctly
    if(error) {
        console.log(error);
    }else {
        // console.log(data);

        dataset = data;
        // Loop through each category
        for (var key in dataset) {
            var cat = dataset[key];
            for(var i = 0; i < cat.length; i++) {
                // radius
                cat[i].radius = radius;
            }
        }
         // Create the map legend
        createLegend();
        createMap();

        // Insert rectangle into svg 
        // (need this for zooming effect)
        svg = d3.select("svg");
        gPaths = svg.select(".datamaps-subunits");
        gBubbles = svg.select(".bubbles");
        svg.insert("rect", "g")
            .attr("class", "background")
            .attr("width", width-1)
            .attr("height", height-1)
            .on("click", zoom);

        // Default points
        update(1960, "allCategory");
    }
});


function zoom(d) {
    var x, y, zoomLevel;
    
    if(d && centered !== d) {
        var centroid = path.centroid(d);
        x = centroid[0];
        y = centroid[1];
        zoomLevel = 4;
        centered = d;
        radius = 1;
        d3.select(".datamaps-hoverover")
        .style("visibility","visible");
    }
    else {
        x = width / 2;
        y = height / 2;
        zoomLevel = 1;
        centered = null;
        radius = 2;
        d3.select(".datamaps-hoverover")
        .style("visibility","hidden");
      }

    // Countires paths
    gPaths.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });
    gPaths.transition()
      .duration(500)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + zoomLevel + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / zoomLevel + "px");

    // Bubbles
    gBubbles.selectAll("circle")
    .transition()
        .duration(500)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + zoomLevel + ")translate(" + -x + "," + -y + ")")
        .attr("r", radius);
}

function createMap() {
    // Create a new world map 
    map = new Datamap({
        element: document.getElementById("map"),
        setProjection: function(){
            return {path: path, projection: projection};
        },
        geographyConfig: {
            //popupOnHover: false,
            //highlightOnHover: tfalse,
            //highlightBorderColor: 'rgba(250, 15, 160, 0.2)',
            //highlightBorderWidth: 2,
            highlightFillColor: "#00ADBC",
            borderColor: "#00ADBC"
        },
        fills: {
            defaultFill: "rgb(34,34,34)",    // Map color
            pub: "#FFDE12",
            dev: "#BEF600", 
            onlineDev: "#9639AD",
            mob: "#FF2F7C",
            org: "#00ADBC",
            mult: "#FFF"
        }
    });

   animating = true;
   startAnimation();
}



// Draws the coordinate points
function createPoints(data) {
    //console.log("length: "  + data);
    // Create the points 
    map.bubbles(data, {
        borderWidth: 0,
        fillOpacity: 1,
        popupTemplate: function(data) {
            // Info box 
            var string =  '<div class="popover top>';
            string += '<div class="arrow"></div><h3 class="popover-title">' + data.company + '</h3>';
            string += '<div class="popover-content"><p>Located: ' + data.city + ", " + data.country;
            string += "<br/>Founded: " + data.yearEST;
            if(data.yearClosed != '0') {
                string += "<br/>Closed: " + data.yearClosed; 
            }
            string += "<br/>Category: " + data.category;
            string += '</p></div></div>';

            return string;
        }
    });
}
    
function clearBox(elementID) {
    document.getElementById(elementID).innerHTML = "";
}

// when the input range changes update the circle 
d3.select("#year").on("input", function() {
    update(+this.value, "allCategory");
});


function startAnimation() {
    d3.select(".datamaps-hoverover")
        .style("visibility","hidden");
    if(animating == true) {
        yearShown = yearShown + 1;
        d3.select("#titleHeader").text("Game Companies in " + yearShown);
        if(yearShown > 2013) 
        {
            animating = false;
        }
        update(yearShown,"allCategory");
        //console.log(year);
        var t = setTimeout(function(){
            startAnimation()
        },300);
    }else {
        // When the animation ends 
        activateComponents();
    }
}

// update the elements
function update(year, type, data) {
    // adjust the text on the range slider
    d3.select("#year-value").text(year);
    d3.select("#year").property("value", year);
    yearShown = year;

    d3.select("#titleHeader").text("Game Companies in " + yearShown);

    // Temporary array to hold specific points based on the year
    var yearDataset = [];

    // Filter out the points based on the year
    if(type == "allCategory"){
        for(var key in dataset){
            for(var i = 0; i < dataset[key].length; i++){
                if(parseInt(dataset[key][i].yearEST) <= year && (parseInt(dataset[key][i].yearClosed) > year || parseInt(dataset[key][i].yearClosed) == 0)) 
                {
                    yearDataset.push(dataset[key][i]);
                }
            }
        }  
    }else if(type == "category"){
        for(var i = 0; i < data.length; i++){
                if(parseInt(data[i].yearEST) <= year && (parseInt(data[i].yearClosed) > year || parseInt(data[i].yearClosed) == 0)) 
                {
                    yearDataset.push(data[i]);
                }
            }
    }
    
    // Update the #count
    d3.select("#count").text(yearDataset.length);
    // Update the points
    createPoints(yearDataset);
	//Update the Table
    if(animating == false) {
	   clearBox('dataTable');
	   var informationTable = tabulate(yearDataset, ["Company","City","Country","Year Established","Category"]);
    }
    makeChart(yearShown);
}

// The table generation function
function tabulate(data, columns) {
    /*var table = d3.select("#dataTable").append("table").attr("class","table")
        thead = table.append("thead"),
        tbody = table.append("tbody");

    // append the header row
    thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
            .text(function(column) { return column; });

    // create a row for each object in the data
    var rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr");

    // create a cell in each row for each column
    var cells = rows.selectAll("td")
        .data(function(row) {
            return columns.map(function(column) {
                return {column: column, value: row[column]};
            });
        })
        .enter()
        .append("td")
        //.attr("style", "font-family: Courier") // sets the font style
        .html(function(d) { return d.value; });
    
    return table;*/
    var table = d3.select("#dataTable");
    var panel = table.selectAll("div")
        .data(mapLegend)
        .enter()
        .append("div")
            .attr("id", "accordion")
            .attr("class","panel-group")
            .attr("role", "tablist")
            .attr("aria-multiselectable", "true")
            .append("div")
                .attr("class", "panel panel-default");

    // Panel Heading
    panel.append("div")
        .attr("id", function(d, i){ return d.key; })
        .attr("class", "panel-heading")
        .attr("role", "tab")
        .style("background-color", function(d, i){ return d.color; })
        .append("h4")
            .attr("class", "panel-title")
            .append("a")
                .attr("data-toggle", "collapse")
                .attr("data-parent","#accordion")
                .attr("href", function(d, i){ return "#collapse" + i; })
                .attr("aria-expanded", "false")
                .attr("aria-controls", function(d, i){ return "collapse" + i; })
                .text(function(d){ return d.key; });
    
    // Panel Body
    panel.append("div")
        .attr("id", function(d, i){ return "collapse" + i; })
        .attr("class", "panel-collapse collapse")
        .attr("role", "tabpanel")
        .attr("aria-labelledby", function(d, i){ return "heading"+i; })
        .append("div")
            .attr("class", "panel-body")
            .text(function(d){ return "All the " + d.key + " companies will go here."});
}

function createLegend() {
    console.log("from legend:");
    console.log(dataset);
    var key = d3.select("#legend");

    // Create div elements for colors
    key.selectAll("div")
        .data(mapLegend)
        .enter()
        .append("div")
            .attr("id", function(d){ return d.id; })
            .attr("class", "legend-key col-md-2")
            .append("div")
                .attr("class", "color")
                .style("background-color", function(d){ return d.color; });
    
    // Create text labels
    key.selectAll(".legend-key")
        .data(mapLegend)
        .append("span")
            .text(function(d){ return d.key; });
}

function activateComponents() {
    // Add onclick event to the path elements for zooming
    d3.selectAll("path").on("click", zoom);

    // Add onclick event to the legend
    d3.selectAll(".legend-key")
        .on("click", function(){
            // Get the categoy id
            var category = this.id;
            update(yearShown,"category", dataset[category]);
        });
}