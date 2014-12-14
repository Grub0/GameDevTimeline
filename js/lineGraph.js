var lgData,
    chart;
var colors=['#000'];

d3.csv("data/count_by_year.csv", function(data) {
    lgData = data;
});

function makeChart(maxYear, animating) {   
    var yea=['x'];
    var counts=["Total"];
    var deves=["Developers"];
    var onli=["Online Developer"];
    var publi=["Publisher"];
    var mobi=["Mobile/Handheld"];
    var orga=["Organization"];
    var mult =["Multiple Category"];

    for(var i=0;i<lgData.length;i++) {
        yea[i +1] = lgData[i].year;

        if(lgData[i].year <= maxYear) {
            counts[i +1] = lgData[i].Total;
            deves[i+1] = lgData[i].Developer;
            onli[i+1] =lgData[i].OnlineDeveloper;
            publi[i+1]=lgData[i].Publisher;
            mobi[i+1]=lgData[i].MobileHandheld;
            orga[i+1]=lgData[i].Organization;
            mult[i+1]=lgData[i].MultipleCategory;
        }
    }
    
    // Activate the tooltip and the zoom only after animation completes
    var toolVisibility = false,
        zoomEnable = false;
    if(animating == false){
        toolVisibility = true;
        zoomEnable = true;
    }

    chart = c3.generate({
        bindto: '#lineGraph',
        data: {
            x: 'x',
            columns: [
                yea, 
                deves,
                onli,
                publi,
                mobi,
                orga,
                mult
            ]
        },            
        legend: {
            show: false
        },            
        color: {
            pattern: [
                colors[1],colors[2],colors[3],colors[4],colors[5],colors[6]
            ]
        },
        axis: {
            x: {
                label: {
                    text: 'Year',
                    position: 'outer-center',
                }
            },
            y: {
                label: {
                    text: 'Number of Companies',
                    position: 'outer-middle'
                }
            }
        },
        zoom: {
            enabled: zoomEnable
        },
        tooltip: {
            show: toolVisibility,
            grouped: true,
            contents: function (d, defaultTitleFormat, defaultValueFormat, color) {
                var text, value, bgcolor;
                    
                for(i = 0; i < d.length; i++){
                    if(!(d[i] && (d[i].value || d[i].value === 0))) continue;
                    if(!text){
                        title = d[i].x;
                        text = "<table class='table c3-tooltip'>" + (title || title === 0 ? "<tr><th colspan='2'>" + title + "</th></tr>" : "");
                    }
                    bgcolor = color(d[i].id);

                    text += "<tr class='c3-tooltip-name-" +  d[i].id + "'>";
                    text += "<td class='name'><div class='color' style='background-color:" + bgcolor + "'></div></td>";
                    text += "<td class='value'>" + d[i].value + "</td>";
                    text += "</tr>";
                }
                return text + "</table>";   
            }
        }     
    });  

}

//isoValue being the specific collumn that we want to have shown
function makeIsolatedChart(maxYear,isoValue) {   
    var yea=['x'];
    var counts=["Total"];
    var deves=["Developers"];
    var onli=["Online Developer"];
    var publi=["Publisher"];
    var mobi=["Mobile/Handheld"];
    var orga=["Organization"];
    var mult =["Multiple Category"];
    
    for(var i=0;i<lgData.length;i++) {
        yea[i +1] = lgData[i].year;

        if(lgData[i].year <= maxYear) {
            counts[i +1] = lgData[i].Total;
            deves[i+1] = lgData[i].Developer;
            onli[i+1] =lgData[i].OnlineDeveloper;
            publi[i+1]=lgData[i].Publisher;
            mobi[i+1]=lgData[i].MobileHandheld;
            orga[i+1]=lgData[i].Organization;
            mult[i+1]=lgData[i].MultipleCategory;
        }
    }
    var colorToShow;
    var dataToShow;

    switch (isoValue) {
        case "developer":
            colorToShow = 1;
            dataToShow=deves;
            break;
        case "onlineDeveloper":
            colorToShow = 2;
            dataToShow=onli;
            break;
        case "publisher":
            colorToShow = 3;
            dataToShow=publi;
            break;
        case "mobileHandheld":
            colorToShow = 4;
            dataToShow=mobi;
            break;
        case "organization":
            colorToShow = 5;
            dataToShow=orga;
            break;
        case "multipleCategories":
            colorToShow = 6;
            dataToShow=mult;
            break;
        default:
    }

    chart = c3.generate({
        bindto: '#lineGraph',
        data: {
            x: 'x',
            columns: [
                yea,
                dataToShow
            ],
            //labels:true
        },            
        legend: {
            show: false
        },            
        color: {
            pattern: [colors[colorToShow]]
        },
        axis: {
            x: {
                label: {
                    text: 'Year',
                    position: 'outer-center',
                }
            },
            y: {
                label: {
                    text: 'Number of Companies',
                    position: 'outer-middle'
                }
            }
        },
        zoom: {
            enabled: true
        },
        tooltip: {
            contents: function (d, defaultTitleFormat, defaultValueFormat, color) {
                text = "<table class='table c3-tooltip'><tr><th colspan='1'>" + d[0].x + "</th></tr>";
                text += "<tr class='c3-tooltip-name-" +  d[0].id + "'>";
                text += "<td class='value'>" + d[0].value + "</td>";
                text += "</tr></table>";
                
                return text;   
            }
        }
    });  
}

function pullColors(legendArray) {
    for(var i =1;i<7;i++) {
        colors[i] = legendArray[i-1].color;
    }
}