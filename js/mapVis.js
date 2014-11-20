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
            dataset[i].radius = 2;
            // fillKey
            dataset[i].fillKey = "bubColor";
        }
        // Add Datamap's key values 
        createMap();
        // Default points
        createPoints(dataset);
    }
});
    

// Add an event to the input element
d3.select("#slider").select("input").on("change", function() {
    // Get the year input
    year = this.value;

    console.log("year: " + year);

    // Temporary array to hold specific points based on the year
    var yearDataset = [];

    for(var i = 0; i < dataset.length; i++){
        // Filter out the years
        if(parseInt(dataset[i].yearEST) <= year && (parseInt(dataset[i].yearClosed) > year || parseInt(dataset[i].yearClosed) == 0)) {
            yearDataset.push(dataset[i]);
        }
    }
    // Update the points
    createPoints(yearDataset);
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
            bubColor: "#BEF600"
        }
    });
}


// Draws the coordinate points
function createPoints(data) {

    console.log("length: "  + data.length);
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