var width = 600,
    height = 650,
    datasetLine,
    counts = [],
    years=[];
var lineData;


d3.csv("data/count_by_year.csv", function(error, data) 
{
    datasetLine = data;
    lineData = [];
    for(var i=0;i<datasetLine.length;i++)
    {
        counts[i] = datasetLine[i].Count;
        years[i] = datasetLine[i].year;
    }
    lineData[0] = years;
    lineData[1] = counts;
    
    var svg = d3.select("#lineGraph").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g");

//Create scale functions
        var xScale = d3.scale.linear().domain([2014,1960]).range([width - 20,40]);
        var yScale = d3.scale.linear().domain([0,2056]).range([height - 20,20]);
//Setting axis stuff						
        var xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(10);   
        var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(10);   

        //Create X axis
		svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0,630)")
        .style("Fill","white")
		.call(xAxis);

        //Create Y axis
		svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(40,0)")
        .style("Fill","white")
        .style("font-size","10px")
		.call(yAxis);
    
console.log(lineData);
    
    var lineFunction = d3.svg.line()
    .x(function(d) { return xScale(d[0]); })
    .y(function(d) { return yScale(d[1]); });
    
//The line SVG Path we draw
var lineGraph = svg.append("path")
.attr("d", lineFunction(lineData))
.attr("transform","translate(600,500)")
.attr("stroke", "white")
.attr("stroke-width", 2)
.attr("fill", "none");
});