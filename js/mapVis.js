var map, 
    dataset,
    yearShown,
    animating;


d3.csv("data/video_game_developers.csv", function(error, data) {

    // Check if the file loaded correctly
    if(error) {
        console.log(error);
    }else {
       // console.log(data);
        dataset = data;
        for(var i = 0; i < dataset.length; i++){
            //  radius
            dataset[i].radius = 3;

            // Seperate the categor string into an array
            if( dataset[i].category.search(/,/) != -1 ) {
                dataset[i].category = dataset[i].category.split(",");                
            }else {
                dataset[i].category = [dataset[i].category];
            } 
            
            // Assign a fillKey value based on what category it is
            switch(dataset[i].category[0]){
                case "Developer":
                    dataset[i].fillKey = "dev";
                    break;
                case "Online Developer":
                    dataset[i].fillKey = "onlineDev";
                    break;
                case "Publisher":
                    dataset[i].fillKey = "pub";
                    break;
                case "Mobile/Handheld":
                    dataset[i].fillKey = "mob";
                    break;
                case "Organization":
                    dataset[i].fillKey = "org";
                    break;
                default:
                    dataset[i].fillKey = "other";
            }
        }
        createMap();
        // Default points
        update(1960);
    }
});

function createMap() {

    // Create a new world map 
    map = new Datamap({
        element: document.getElementById("map"),
        projection: "mercator",
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
            other: "#FFF"
        }
    });
    animating = true;
    startAnimation();
}

function createZoomedMap() {

    // Create a new world map 
    map = new Datamap({
  element: document.getElementById("map"),
  scope: 'world',
  // Zoom in on Africa
  setProjection: function(element) {
    var projection = d3.geo.equirectangular()
      .center([-100, 40])
      .rotate([0, 0])
      .scale(1000)
      .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
      
    var path = d3.geo.path()
      .projection(projection);
    
    return {path: path, projection: projection};
  },geographyConfig: {
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
            other: "#FFF"
        }
    });
    animating = true;
    startAnimation();
}

// Draws the coordinate points
function createPoints(data) {

    //console.log("length: "  + data.length);
    // Create the points 
    map.bubbles(data, {
        borderWidth: 0,
        fillOpacity: 1,
        popupTemplate: function(geo, data) {
            // Info box 
            var string = "<div class='hoverInfo'><span>" + data.company + "</span>";
            string += "<br/>" + data.city + ", " + data.country;
            string += "<br/>Founded: " + data.yearEST;
            if(data.yearClosed != '0')
            {
                string += "<br/>Closed: " + data.yearClosed; 
            }
            string += "<br/>Category: " + data.category;
            string += "</div>";   
            return string;
        }
    });
}
    function clearBox(elementID)
{
    document.getElementById(elementID).innerHTML = "";
}
    // when the input range changes update the circle 
d3.select("#year").on("input", function() {
  update(+this.value);
});

function startAnimation() {
    if(animating == true)
    {
    yearShown = yearShown + 1;
    d3.select("#titleHeader").text("Game Companies in " + yearShown);
        if(yearShown > 2013)
        {
            animating = false;
        }
        update(yearShown);
        //console.log(year);
    var t = setTimeout(function()
    {
        startAnimation()
    },100);
    }
}

// update the elements
function update(year) 
{
  // adjust the text on the range slider
  d3.select("#year-value").text(year);
  d3.select("#year").property("value", year);
    yearShown = year;
    d3.select("#titleHeader").text("Game Companies in " + yearShown);

    // Temporary array to hold specific points based on the year
    var yearDataset = [];
    for(var i = 0; i < dataset.length; i++){
        // Filter out the years
        if(parseInt(dataset[i].yearEST) <= year && (parseInt(dataset[i].yearClosed) > year || parseInt(dataset[i].yearClosed) == 0)) 
        {
            yearDataset.push(dataset[i]);
        }
    }
    // Update the #count
    d3.select("#count").text(yearDataset.length);
    // Update the points
    createPoints(yearDataset);
	
	//Update the Table
		clearBox('dataTable');
	var informationTable = tabulate(yearDataset, ["company","city","country","yearEST","category","website"]);
}

// The table generation function
function tabulate(data, columns) {
    var table = d3.select("#dataTable").append("table")
            .attr("style", "margin-left: 250px"),
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
    
    return table;
}
