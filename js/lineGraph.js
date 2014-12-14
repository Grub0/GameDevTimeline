var lgData;
var colors=['#000'];
    var yea=['x'];
var counts=["Total"];
var deves=["Developers"];
var onli=["Online Developer"];
var publi=["Publisher"];
var mobi=["Mobile/Handheld"];
var orga=["Organization"];
var mult =["Multiple Category"];
d3.csv("data/count_by_year.csv", function(data) 
{
    lgData = data;
});

function makeChart(maxYear)
{   
        for(var i=0;i<lgData.length;i++)
    {
        yea[i +1] = lgData[i].year;
        if(lgData[i].year <= maxYear)
        {
        counts[i +1] = lgData[i].Total;
        deves[i+1] = lgData[i].Developer;
        onli[i+1] =lgData[i].OnlineDeveloper;
        publi[i+1]=lgData[i].Publisher;
        mobi[i+1]=lgData[i].MobileHandheld;
        orga[i+1]=lgData[i].Organization;
            mult[i+1]=lgData[i].MultipleCategory;
        }
    }
    
 var chart = c3.generate({
    bindto: '#chart',
    data: {
      x: 'x',
      columns: 
      [
        yea,
        //counts,
          deves,
          onli,
          publi,
          mobi,
          orga,
          mult
      ]
    },            legend: {
        show: false
    },            
        color: {
  pattern: [//colors[0],
            colors[1],colors[2],colors[3],colors[4],colors[5],colors[6]]
}
});   
}

//isoValue being the specific collumn that we want to have shown
function makeIsolatedChart(maxYear,isoValue)
{   
    console.log("making iso graph");
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
 var chart = c3.generate({
    bindto: '#chart',
    data: {
      x: 'x',
      columns: 
      [
        yea,
        dataToShow
      ]
    },            legend: {
        show: false
    },            
        color: {
  pattern: [colors[colorToShow]]
}
});   
}

function pullColors(legendArray)
{
    for(var i =1;i<7;i++)
    {
        colors[i] = legendArray[i-1].color;
    }
}
