var map, 
    dataset,
    year;


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
  
            // Assign a fillKey value based on what category it is
            switch(dataset[i].category){
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
        // Add Datamap's key values 
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
            if(data.yearClosed != '0'){
                string += "<br/>Closed: " + data.yearClosed; 
            }
            string += "<br/>Category: " + data.category;
            string += "</div>";   
            
            return string;
        }
    });
}
    
    // when the input range changes update the circle 
d3.select("#year").on("input", function() {
  update(+this.value);
});


// update the elements
function update(year) 
{

  // adjust the text on the range slider
  d3.select("#year-value").text(year);
  d3.select("#year").property("value", year);
    console.log("year: " + year);

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
}