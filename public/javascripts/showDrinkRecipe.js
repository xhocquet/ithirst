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
        document.getElementById('description').innerHTML = 
          '<hr id="linebreak"><p>' + item.directions + '</p>';
        var ingredients = item.ingredients;
        var garnishes = item.garnish;
        var totalVal = 0;
        var tempVal = 0;

        $("#ingredientlist").append(
          $('<h3>Ingredients</h3>')
        );

        $.each(ingredients, function(index, value) {
          totalVal += value;
        });

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
            
            step(tempVal/totalVal, curColor);
            tempVal += value;
            step(tempVal/totalVal, curColor)

        });
        ///INGREDIENT LOOP END
        $("#ingredientlist").append(
          $('<h3>Garnishes</h3>')
        );
        //GARNISH LOOP
        if (garnishes != null) {
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
        ctx.moveTo(75, 0); ctx.lineTo(150, 150); ctx.lineTo(0, 150);

        (function loop() {
          ctx.globalCompositeOperation = "copy";  // will clear canvas with next draw

          // Fill the previously defined triangle path with any color:
          ctx.fillStyle = "#000";  // fill some solid color for performance
          ctx.fill();
          
          // draw a rectangle to clip the top using the following comp mode:
          ctx.globalCompositeOperation = "destination-in";
          ctx.fillRect(0, y, 150, 150 - y);

          // now that we have the shape we want, just replace it with the gradient:
          // to do that we use a new comp. mode
          ctx.globalCompositeOperation = "source-in";
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 150, 150);
          
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