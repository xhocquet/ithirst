unitModifers = {
  'oz' : 30,
  'gallon' : 3785,
  'quart' : 946,
  'pinch' : 0.5,
}

//DOM Ready
$(document).ready(function() {
    $("#ingredientlist").empty();
    loadDrink(curDrink);
});

//Load page with drink ingredients/chart
function loadDrink(drinkToGet) {

    var ctx = document.querySelector("canvas").getContext("2d"),
    grad = ctx.createLinearGradient(0, 0, 0, 150),
    step = grad.addColorStop.bind(grad), // function reference to simplify
    dlt = -2, y = 150;

    var address = '/drinks/find/details/' + drinkToGet.toLowerCase();
    var colors;
    var curColor;
    var prevColor;

    //Get array of colors for graph/ingredients
    $.getJSON('/drinks/getColors', function(items) {
        colors = items;
    });

    //Populate list with ingredients
    $.getJSON(address, function(item) {
        document.getElementById('title').innerHTML = capitalize(item.name);
        $('#description').append('<p>' + item.directions + '</p>');
        var ingredients = item.ingredients;
        var garnishes = item.garnish;
        var totalVal = 0;
        var tempVal = 0;

        $("#ingredientlist").append(
          $('<h3>Ingredients</h3>')
        );

        $.each(ingredients, function(index, value) {
          totalVal += value.amount;
        });

        //INGREDIENT LOOP
        $.each(ingredients, function(index, value) {
            //Pull the color from the array
            $.each(colors, function(index2, value2) {
                if (value.name == value2.name) {
                    curColor = value2.color;
                }
            });

            $("#ingredientlist").append(
              $('<li></li>')
              .text(value.amount + ' ' + capitalize(value.name + ''))
              .css("color", curColor)
            );

            //Steps for graph gradient
            //small line
            step(tempVal/totalVal, "black");
            step(tempVal/totalVal+.01, "black");
            //actual alcohol stuff
            step(tempVal/totalVal+.01, curColor);
            tempVal += value.amount;
            step(tempVal/totalVal, curColor)

        });
        ///INGREDIENT LOOP END

        //GARNISH LOOP
        if (garnishes != null && garnishes.length > 0) {
          $("#ingredientlist").append(
            $('<h3>Garnishes</h3>')
          );

          $.each(garnishes, function(index, value) {
              $("#ingredientlist").append(
                $('<li></li>')
                .text(capitalize(value+''))
                .css("color", '#d0d0d0')
              );
          });
        };
        ///GARNISH LOOP END

        //CHART
        // store a triangle path - we'll reuse this for the demo loop
        ctx.moveTo(75, 0); ctx.lineTo(75, 150); ctx.lineTo(225, 150); ctx.lineTo(225, 0);

        (function loop() {
          ctx.globalCompositeOperation = "copy";  // will clear canvas with next draw

          // Fill the previously defined triangle path with any color:
          ctx.fillStyle = "#000";  // fill some solid color for performance
          ctx.fill();

          // draw a rectangle to clip the top using the following comp mode:
          ctx.globalCompositeOperation = "destination-in";
          ctx.fillRect(0, y, 300, 150 - y);

          // now that we have the shape we want, just replace it with the gradient:
          // to do that we use a new comp. mode
          ctx.globalCompositeOperation = "source-in";
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 300, 150);

          y += dlt;
          requestAnimationFrame(loop);
        })();
        ///CHART
    });
};

//Capitalization helper
function capitalize(input) {
    var split = input.split(' ');
    for (var i = 0, len = split.length; i < len; i++) {
        if (split[i].length > 3 || split[i] == 'gin' || split[i] == 'old') {
          split[i] = split[i].charAt(0).toUpperCase() + split[i].slice(1);
        }
    }
    return split.join(' ');
}

//Map units to a modifier for consistent #s for chart
//Loosely based off of ML, might need to adjust
function mapUnit(unitString) {

}