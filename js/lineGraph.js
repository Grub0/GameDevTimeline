var lgData;
var colors=['#000'];
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
var mult =["Multiple Category"];
    
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
        counts,
          deves,
          onli,
          publi,
          mobi,
          orga,
          mult
      ]
    },            legend: {
        show: true
    },            
        color: {
  pattern: [colors[0],colors[1],colors[2],colors[3],colors[4],colors[5],colors[6]]
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
