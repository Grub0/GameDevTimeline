var map, 
    dataset;

d3.csv("data/video_game_developers.csv", function(error, data) {
    // Check if the file loaded correctly
    if(error) {
        console.log(error);
    }else {
        console.log(data);
        dataset = data;
        // Add Datamap key values 
        for(var i = 0; i < dataset.length; i++){
            //  radius
            dataset[i].radius = 3;
            // Assign a fillKey value based on what category it is
            switch(dataset[i].category){
                case "Developer":
                    dataset[i].fillKey = "dev";
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
    }
});
    

function createMap() {
    // Create a new world map 
    map = new Datamap({
        element: document.getElementById("map"),
        projection: "mercator",
        geographyConfig: {
            popupOnHover: false,
            highlightOnHover: false
        },
        fills: {
            defaultFill: "#abdda4",
            dev: "purple",
            pub: "green",
            mob: "red",
            org: "blue",
            other: "grey"
        }
    });

    // Create points 
    map.bubbles(dataset, {
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

    // Show legend for the map
    map.legend();
}