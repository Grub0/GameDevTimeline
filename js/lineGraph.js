var lgData;
var yea=['x'];
var counts=["Total"];
var deves=["Developers"];
var onli=["Online Developer"];
var publi=["Publisher"];
var mobi=["Mobile/Handheld"];
var orga=["Organization"];
d3.csv("data/count_by_year.csv", function(data) 
{
    lgData = data;
});

function makeChart(maxYear)
{
    var yea=['x'];
var counts=["Total"];
var deves=["Developers"];
var onli=["Online Developer"];
var publi=["Publisher"];
var mobi=["Mobile/Handheld"];
var orga=["Organization"];
    
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
        }
    }
    
 var chart = c3.generate({
    bindto: '#chart',
    data: {
      x: 'x',
      columns: 
      [
        yea,
        counts,
          deves,
          onli,
          publi,
          mobi,
          orga
      ]
    }
});   
}
