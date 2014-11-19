var dataset = [];

d3.csv("data/video_game_developers.csv", function(data) {
    dataset = data.map(function(d) { 
        return [ d["Company"], d["City"],  d["Country"],  d["Longitude"],  d["Latitude"],  d["Year EST"],  d["Year Closed"],  d["Category"],  d["Website"] ]; 
    });
    console.log(dataset);
   
	var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		osm = L.tileLayer(osmUrl, {maxZoom: 18,minZoom:3, attribution: osmAttrib});

	var map = L.map('map').setView([0, 0], 3).addLayer(osm);
    var yearBeingShown = 1990;
    

    
    for (i = 0; i < dataset.length; i++) {
        var company = dataset[i][0];
        var country = dataset[i][1];
        var city = dataset[i][2];
        var longitude = parseFloat(dataset[i][3]);
        var latitude = parseFloat(dataset[i][4]);
        var yearEST = parseInt(dataset[i][5]);
        var yearClosed = parseInt(dataset[i][6]);
        
        if(yearClosed == 0) {
            yearClosed = 2015;
        }
        var Category = dataset[i][7];
        var Website = dataset[i][8];
        
        var MapIcon = L.Icon.extend({
			options: {
				shadowUrl: '',
				iconSize:     [50, 50],
				shadowSize:   [50, 64],
				iconAnchor:   [22, 94],
				shadowAnchor: [4, 62],
				popupAnchor:  [-3, -76]
			}
		});

        var devIcon = new MapIcon({iconUrl: 'images/controller.png'});
        var pubIcon = new MapIcon({iconUrl: 'images/dollar.png'});
        var mobIcon = new MapIcon({iconUrl: 'images/mobile.png'});
        var defaultIcon = new MapIcon({iconUrl: 'images/def.png'});

        if(yearEST < yearBeingShown && yearClosed > yearBeingShown) {
            if(Category == "Developer") {
            	L.marker([latitude,longitude], {icon: devIcon})
            		.addTo(map)
            		.bindPopup(
                        "Company: " + company + "<br>"+
                        "Website: " +  Website  + "<br>"+
                         "City: " + city + "<br>"+ 
                         "Country: " + country + "<br>"+
                         "Category: " + Category + "<br>"+
                        "Year EST: " + yearEST + "<br>"+
                        "Year Closed: " + yearClosed + "<br>"
                         )
            		.openPopup(); 
            }else if(Category == "Publisher") {
            	L.marker([latitude,longitude], {icon: pubIcon})
            	    .addTo(map)
            		.bindPopup(
                        "Company: " + company + "<br>"+
                        "Website: " +  Website  + "<br>"+
                         "City: " + city + "<br>"+ 
                         "Country: " + country + "<br>"+
                         "Category: " + Category + "<br>"+
                        "Year EST: " + yearEST + "<br>"+
                        "Year Closed: " + yearClosed + "<br>"
                         )
            		.openPopup(); 
            }else if(Category == "Mobile/Handheld") {
        	    L.marker([latitude,longitude], {icon: mobIcon})
        		.addTo(map)
        		.bindPopup(
                    "Company: " + company + "<br>"+
                    "Website: " +  Website  + "<br>"+
                     "City: " + city + "<br>"+ 
                     "Country: " + country + "<br>"+
                     "Category: " + Category + "<br>"+
                    "Year EST: " + yearEST + "<br>"+
                    "Year Closed: " + yearClosed + "<br>"
                     )
        		.openPopup(); 
            }else {
        	    L.marker([latitude,longitude], {icon: defaultIcon})
        		.addTo(map)
        		.bindPopup(
                    "Company: " + company + "<br>"+
                    "Website: " +  Website  + "<br>"+
                     "City: " + city + "<br>"+ 
                     "Country: " + country + "<br>"+
                     "Category: " + Category + "<br>"+
                    "Year EST: " + yearEST + "<br>"+
                    "Year Closed: " + yearClosed + "<br>"
                     )
        		.openPopup(); 
            }
        }
    }
});