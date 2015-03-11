var ctx = document.getElementById("ingredientChart").getContext("2d");
var data = [
    {
        value: 3,
        color:"#F5F39D",
        label: "Tequila"
    },
    {
        value: 2,
        color: "#F7F7E1",
        label: "Triple Sec"
    },
    {
        value: 1,
        color: "#66DE2F",
        label: "Lime Juice"
    }
]
var options ={
    //Boolean - Whether we should show a stroke on each segment
    segmentShowStroke : false,

    //String - The colour of each segment stroke
    segmentStrokeColor : "#fff",

    //Number - The width of each segment stroke
    segmentStrokeWidth : 2,

    //Number - The percentage of the chart that we cut out of the middle
    percentageInnerCutout : 50, // This is 0 for Pie charts

    //Number - Amount of animation steps
    animationSteps : 80,

    //String - Animation easing effect
    animationEasing : "easeOutCubic",

    //Boolean - Whether we animate the rotation of the Doughnut
    animateRotate : true,

    //Boolean - Whether we animate scaling the Doughnut from the centre
    animateScale : false
}

var ingredients = new Chart(ctx).Doughnut(data,options);