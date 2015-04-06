unitModifers = {
  'oz' : 30,
  'gallon' : 3785,
  'quart' : 946,
  'pinch' : 0.5,
  'liter' : 1000,
  'fifth' : 757,
  'pint' : 473,
  'part' : 45,
  'shot' : 45,
  'dash' : 1,
  'can' : 355,
  'tbsp' : 15,
  'splash' : 3,
  'drop' : 0.5,
  'glass' : 250
}

var colors = [];
var colorInfo = [];
var curColor;
var prevColor;
var curGlassType;
var ctx;
var address;
var ingredients;
var totalVal;
var tempVal;

//DOM Ready
$(document).ready(function() {
    $("#ingredientlist").empty();
    loadDrink(curDrink);
});

//Load page with drink ingredients/chart
function loadDrink(drinkToGet) {

    address = '/drinks/find/details/' + encodeURI(drinkToGet.toLowerCase());

    //Populate list with ingredients
    $.getJSON(address, function(item) {
        curGlassType = item.glass;

      ctx = document.querySelector("canvas").getContext("2d"),
      grad = ctx.createLinearGradient(0, 0, 0, 150),
      step = grad.addColorStop.bind(grad), // function reference to simplify
      dlt = -2, y = 150;

        document.getElementById('title').innerHTML = capitalize(item.name);
        $('#description').append('<p>' + item.directions + '</p>');
        ingredients = item.ingredients;
        totalVal = 0;
        tempVal = 0;

        $("#ingredientlist").append(
          $('<h3>Ingredients</h3>')
        );

        $.each(ingredients, function(index, value) {
          modifier = mapUnit(value.measure);
          totalVal += value.amount * modifier;
          colors.push(value.name);
        });

        //Get array of colors for graph/ingredients
        parsedColors = colors.join();
        $.get('/drinks/getColors/' + parsedColors, function(items) {
            $.each(items, function(index,value){
              colorInfo.push(value);
            })

            //INGREDIENT LOOP
        $.each(ingredients, function(index, value) {
            modifier = mapUnit(value.measure);
            //Pull the color from the array
            curColor = "black"
            $.each(colorInfo, function(index2, value2) {
                if (value.name == value2.name) {
                    curColor = value2.color;
                }
            });

            $("#ingredientlist").append(
              $('<li></li>')
              .text(value.amount + ' ' + value.measure + ' ' + capitalize(value.name + ''))
              .css("color", curColor)
            );

            //Steps for graph gradient
            //small line
            step(tempVal/totalVal, "black");
            step(tempVal/totalVal+.01, "black");
            //actual alcohol stuff
            step(tempVal/totalVal+.01, curColor);
            tempVal += value.amount * modifier;
            step(tempVal/totalVal, curColor)

        });
        ///INGREDIENT LOOP END

        //CHART
        //Shape of glass depending on glasstype
        if(curGlassType == 'highball glass') {
          ctx.moveTo(75, 0); ctx.lineTo(75, 150); ctx.lineTo(225, 150); ctx.lineTo(225, 0);
        }

        (function loop() {
          ctx.globalCompositeOperation = "copy";  // will clear canvas with next draw

          // Fill the previously defined triangle path with any color:
          ctx.fillStyle = "#bfbfbf";  // fill some solid color for performance
          ctx.fill();

          // draw a rectangle to clip the top using the following comp mode:
          ctx.globalCompositeOperation = "destination-in";
          ctx.fillRect(0, y, 300, 150 - y);

          // now that we have the shape we want, just replace it with the gradient:
          // to do that we use a new comp. mode
          ctx.globalCompositeOperation = "source-in";
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 300, 150);

          ctx.globalCompositeOperation = "source-over";
          ctx.beginPath();
          ctx.moveTo(75, 0); ctx.lineTo(75, 150); ctx.lineTo(225, 150); ctx.lineTo(225, 0);
          ctx.lineWidth = 5;
          ctx.strokeStyle = '#bfbfbf';
          ctx.stroke();

          y += dlt;
          requestAnimationFrame(loop);
        })();
                ///CHART

        });

        
    });
};


function parseFrac(frac) {
 frac = frac.split(/ ?(\d+)\/(\d+)/);
 if(!isNaN(parseInt(frac[2])))
   return Math.round(frac[0] * 1 + frac[1] / frac[2], 3);
 else
   return false;
};

//Map units to a modifier for consistent #s for chart
//Loosely based off of ML, might need to adjust
function mapUnit(unitString) {
  return unitModifers[unitString];
};