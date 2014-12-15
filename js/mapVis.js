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

var colors = { 
    dev:"#F8EC00",
    onlineDev:"#FF0F00", 
    pub:"#83FF0D", 
    mob:"#FF2F7C", 
    org:"#1CDDBA", 
    mult:"#FFF",
    allCat:colors.map,
    map:"#29363C", 
    mapBorder:"white",
    mapHilight:"#eee",
    mapHBC: "#eee"
};

var mapLegend = [
    {id:"developer", key:"Developer", color:colors.dev},
    {id:"onlineDeveloper", key:"Online Developer", color:colors.onlineDev},
    {id:"publisher", key:"Publisher", color:colors.pub},
    {id:"mobileHandheld", key:"Mobile/Handheld", color:colors.mob},
    {id:"organization", key:"Organization", color:colors.org},
    {id:"multipleSectors", key:"Multiple Sectors", color:colors.mult},
    {id: "allCategory", key:"Show All", color:colors.allCat}
];

var colTableData = [
    {dataText:"Company", dataField:"company"},
    {dataText:"City", dataField:"city"},
    {dataText:"Country", dataField:"country"},
    {dataText:"Year Established", dataField:"yearEST"},
    {dataText:"Category", dataField:"category"}
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
            //.on("click", zoom);

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
            popupOnHover: false,
            //highlightOnHover: false,
            //highlightBorderWidth:,
            highlightBorderColor: colors.mapHBC,
            highlightFillColor: colors.mapHilight,
            borderColor: colors.mapBorder
        },
        fills: {
            defaultFill: colors.map,    // Map color
            pub: colors.pub,
            dev: colors.dev, 
            onlineDev: colors.onlineDev,
            mob: colors.mob,
            org: colors.org,
            mult: colors.mult

        }
    });

    animating = true;
    startAnimation();
}



// Draws the coordinate points
function createPoints(data) {
    //console.log("data: "  + data);
    // Create the points 
    var points = [];
    for(var key in data){
        for(var i = 0; i < data[key].length; i++){
            points.push(data[key][i]);
        }
    }
    
    map.bubbles(points, {
        borderWidth: 0,
        fillOpacity: 1,
        popupOnHover: true,
        popupTemplate: function(d) {
            // Info box 
            var string ="<div class=' map-tooltip'>";
            string += "<h3 class='popover-title' style='background-color:" + colors[d.fillKey] + ";'>" + d.company + "</h3>";
            string += "<div class='popover-content'>";
            string += "<p><b>Located: </b> " + d.city + ", " + d.country;
            string += "<br/><b>Founded: </b> " + d.yearEST;
            if(d.yearClosed != '0'){
                string += "<br/><b>Closed: </b>" + d.yearClosed; 
            }
            string += "<br/><b>Category: </b>" + d.category;
            string += "</p></div></div>";
            return string; 
        }
    });
}
    
function clearBox(elementID) {
    document.getElementById(elementID).innerHTML = "";
}

// when the input range changes update the circle 
d3.select("#year").on("input", function(d) 
{
    if(radius == 1)
    {
        zoom(d);
    }
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
function update(year, categoryType) {
    // adjust the text on the range slider
    d3.select("#year-value").text(year);
    d3.select("#year").property("value", year);
    yearShown = year;

    d3.select("#titleHeader").text("Game Companies in " + yearShown);

    // Temporary object to hold specific points based on the year
    var yearDataset = {};

    // If its all categories it needs to go through a for each loop
    if(categoryType == "allCategory") {
        //  Hide "Show All" option
        d3.select("#allCategory")
            .classed("allCategory-hide", true);

        for(var key in dataset){
            // Add a cateogry key to yearDataset object, 
            // and make it an empty array
            yearDataset[key] = [];

            // In the main object fileter out the current and previous years, 
            // and push it to the new cateogry array
            for(var i = 0; i < dataset[key].length; i++){
                if(parseInt(dataset[key][i].yearEST) <= year && (parseInt(dataset[key][i].yearClosed) > year || parseInt(dataset[key][i].yearClosed) == 0))
                    yearDataset[key].push( dataset[key][i] );
            }
        }  
    }
    else { 
        //  Show "Show All" option
        d3.select("#allCategory")
            .classed("allCategory-hide", false);

        // Since we know the category, there is no need for a for each loop
        yearDataset[categoryType] = [];

        var catArray = dataset[categoryType]; 
        for(var i = 0; i < catArray.length; i++){
            if(parseInt(catArray[i].yearEST) <= year && (parseInt(catArray[i].yearClosed) > year || parseInt(catArray[i].yearClosed) == 0)) 
                yearDataset[categoryType].push( catArray[i] );
        }
    }

    // Update the #count
   // d3.select("#count").text(yearDataset.length);

    // Update the points
    createPoints(yearDataset);

	//Update the Table
    if(animating == false) {
	   clearBox('dataTable');
	   var informationTable = tabulate(yearDataset);
    }
    if(categoryType == "allCategory"){
        makeChart(yearShown, animating);
    }
    else{
        makeIsolatedChart(yearShown,categoryType);
    }
}

// The table generation function
function tabulate(data) {
    console.log(data);
    var tablesHolder = d3.select("#dataTable");

    for(var cat in data){
        if(data[cat].length > 0){
            var panel = tablesHolder.append("div")
                .attr("id", "accordion")
                .attr("class","panel-group")
                .attr("role", "tablist")
                .attr("aria-multiselectable", "true")
                .append("div")
                .attr("class", "panel panel-default");

            // Panel Heading
            var panHeading = panel.append("div")
                .attr("id", cat + "-panel")
                .attr("class", "panel-heading")
                .attr("role", "tab")
                .style("background-color", function(){ 
                    for(var i =0; i < mapLegend.length; i++){
                        if(cat == mapLegend[i].id) return mapLegend[i].color;
                    }
                })
                .append("h4")
                    .attr("class", "panel-title")
                    .append("a")
                        .attr("data-toggle", "collapse")
                        .attr("data-parent","#accordion")
                        .attr("href", function(){ 
                            for(var i =0; i < mapLegend.length; i++){
                                if(cat == mapLegend[i].id) return "#collapse" + i;
                            }
                        })
                        .attr("aria-expanded", "false")
                        .attr("aria-controls", function(){ 
                            for(var i =0; i < mapLegend.length; i++){
                                if(cat == mapLegend[i].id) return "collapse" + i;
                            }
                        })
                        .text(function(){ 
                            for(var i =0; i < mapLegend.length; i++){
                                if(cat == mapLegend[i].id) return mapLegend[i].key;
                            }
                        });
    
            // Panel Body
            var panBody = panel.append("div")
                .attr("id", function(){ 
                    for(var i =0; i < mapLegend.length; i++){
                        if(cat == mapLegend[i].id) return "collapse" + i;
                    }
                })
                .attr("class", "panel-collapse collapse")
                .attr("role", "tabpanel")
                .attr("aria-labelledby", function(){ 
                    for(var i =0; i < mapLegend.length; i++){
                        if(cat == mapLegend[i].id) return "heading" + i; 
                    }
                })
                .append("div")
                    .attr("class", "panel-body");

            // Create table
            panBody.append("table")
                .attr("id", function(){ return cat + "-table"; })
                .attr("class", function(){ return "category-table"; })
                .attr("data-sort-name", "yearEST")
                .attr("data-sort-order", "asc")
                .append("thead")
                    .append("tr")
                    .selectAll("th")
                    .data(colTableData)
                    .enter()
                        .append("th")
                            .attr("data-field", function(col){ return col.dataField; })
                            .attr("data-sortable", function(col){
                                if(col.dataField != "category") return "true";
                                else return "false";
                            })
                            .text(function(col){ return col.dataText; });
        }
        
        // Bootstrap table
        $("#" + cat + "-table").bootstrapTable({
            data: data[cat]
        }); 

        // Add <a> tag to companies
        if(data[cat].length > 0){            
            var cell = d3.select("#" + cat + "-table").select("tbody")
                .selectAll("tr").select("td")
                .data(data[cat]);

            // Add a link only if there is a webiste value
            cell.each(function(d){
                if(d.website != "") {
                    var td = d3.select(this);
                    
                    td.html("").append("a")
                        .attr("href", "http://"+d.website)
                        .attr("target", "_blank")
                        .text(d.company);
                    }
                });
        }
    }  
}


function createLegend() {
    var key = d3.select("#legend");

    // Create div elements for colors
    key.selectAll("div")
        .data(mapLegend)
        .enter()
        .append("div")
            .attr("id", function(d){ return d.id; })
            .classed("legend-key", true)
            .each(function(d){
                if(d.id == "allCategory"){
                   d3.select(this).classed("allCategory-hide", true);
                }
            })
            .append("div")
                .attr("class", "color")
                .style("background-color", function(d){ return d.color; });
    
    // Create text labels
    key.selectAll(".legend-key")
        .data(mapLegend)
        .append("span")
            .text(function(d){ return d.key; });
        pullColors(mapLegend);
}

function activateComponents() {
    // Add onclick event to the path elements for zooming
    d3.selectAll("path").on("click", zoom);

    // Add onclick event to the legend
    d3.selectAll(".legend-key")
        .on("click", function(){
            // Get the categoy id
            //var category = (this.id == "all" ? "allCategory" : this.id);
            var category = this.id;
            update(yearShown, category);
        });
}