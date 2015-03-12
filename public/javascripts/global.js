//DOM Ready
$(document).ready(function() {
    //Autocomplete on search box
    var availableTags = [];
    $.getJSON('/drinks/getDrinkNames', function(items) {
        $.each(items, function(index, value) {
        availableTags.push(capitalize(value.name));
      });
    });
    
    $( "#tags" ).autocomplete({
      source: availableTags
    });

    //Montior search for enter
    $('#tags').keypress(function(e) {
      if (e.keyCode == 13 && document.getElementById('tags').value != '') {
          loadDrink(document.getElementById('tags').value);
      }
    });
});

//Load page with drink ingredients/chart
function loadDrink(drinkToGet) {
console.log('Harvey Wallbanger'.toLowerCase())

    $("#ingredientlist").empty();

    var address = '/drinks/find/' + drinkToGet.toLowerCase();
    var colors;
    var curColor;
    var data = [];
    var chartOptions = {
              //Boolean - Whether we should show a stroke on each segment
              segmentShowStroke : false,
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
            };

    //Get array of colors for graph/ingredients
    $.getJSON('/drinks/getColors', function(items) {
        colors = items;
    });

    //Populate list with ingredients
    $.getJSON(address, function(item) {
        document.getElementById('drinkTitle').innerHTML = capitalize(item.name);
        document.getElementById('description').innerHTML = 
          '<hr id="linebreak"><p>' + item.directions + '</p>';
        var ingredients = item.ingredients;

        //INGREDIENT LOOP
        $.each(ingredients, function(index, value) {
            //Pull the color from the array
            $.each(colors, function(index2, value2) {
                if (index == value2.name) {
                    curColor = value2.color;
                }
            });

            $("#ingredientlist").append(
              $('<li></li>')
              .text(value + ' parts ' + capitalize(index + ''))
              .css("color", curColor)
            );

            data.push({'value': value, 'color': curColor, 'label': capitalize(index+'')})
        });
        ///INGREDIENT LOOP END

        //CHART
        $.getScript("/javascripts/chartjs/Chart.js", function(){
          var ctx = document.getElementById("ingredientChart").getContext("2d");
          var ingredients = new Chart(ctx).Doughnut(data,chartOptions);
        });
        ///CHART



    });
};

//Capitalization helper
function capitalize(input) {
    var split = input.split(' ');
    for (var i = 0, len = split.length; i < len; i++) {
        if (split[i].length > 3 || split[i] == 'gin') {
          split[i] = split[i].charAt(0).toUpperCase() + split[i].slice(1);
        }
    }
    return split.join(' ');
}