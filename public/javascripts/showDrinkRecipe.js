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

        ctx = document.querySelector("canvas").getContext("2d");
        if (curGlassType == 'highball glass') {
            grad = ctx.createLinearGradient(0, 0, 0, 150)
        } else if (curGlassType == 'shooter glass' || curGlassType == 'shot glass') {
            grad = ctx.createLinearGradient(0, 70, 0, 150);
        }

        step = grad.addColorStop.bind(grad), // function reference to simplify
            dlt = -2;

        if (curGlassType == 'highball glass') {
            y = 150;
        } else if (curGlassType == 'shooter glass' || curGlassType == 'shot glass') {
            y = 80;
        }

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
            tempNum = Number(value.amount)
            if (isNaN(tempNum)) {
                if (hasFraction = parseFrac(value.amount)) {
                    tempNum = hasFraction
                }
            }
            totalVal += tempNum * modifier;
            colors.push(value.name);
        });

        //Get array of colors for graph/ingredients
        parsedColors = colors.join();
        $.get('/drinks/getColors/' + parsedColors, function(items) {
            $.each(items, function(index, value) {
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
                step(tempVal / totalVal, "black");
                step(tempVal / totalVal + .01, "black");
                //actual alcohol stuff
                step(tempVal / totalVal + .01, curColor);

                tempNum = Number(value.amount)
                if (isNaN(tempNum)) {
                    if (hasFraction = parseFrac(value.amount)) {
                        tempNum = hasFraction
                    }
                }

                tempVal += tempNum * modifier;

                step(tempVal / totalVal, curColor)

            });
            ///INGREDIENT LOOP END

            //CHART
            //Shape of glass depending on glasstype
            if (curGlassType == 'highball glass') {
                ctx.moveTo(75, 0);
                ctx.lineTo(75, 150);
                ctx.lineTo(200, 150);
                ctx.lineTo(200, 0);
            } else if (curGlassType == 'shooter glass' || curGlassType == 'shot glass') {
                ctx.moveTo(75, 70);
                ctx.lineTo(75, 150);
                ctx.lineTo(140, 150);
                ctx.lineTo(140, 70);
            }

            (function loop() {
                ctx.globalCompositeOperation = "copy"; // will clear canvas with next draw

                // Fill the previously defined triangle path with any color:
                ctx.fillStyle = "#bfbfbf"; // fill some solid color for performance
                ctx.fill();

                // draw a rectangle to clip the top using the following comp mode:
                ctx.globalCompositeOperation = "destination-in";
                if (curGlassType == 'highball glass') {
                    ctx.fillRect(0, y, 300, 150 - y);
                } else if (curGlassType == 'shooter glass' || curGlassType == 'shot glass') {
                    ctx.fillRect(0, y, 300, 150 - y);
                }

                // now that we have the shape we want, just replace it with the gradient:
                // to do that we use a new comp. mode
                ctx.globalCompositeOperation = "source-in";
                ctx.fillStyle = grad;
                if (curGlassType == 'highball glass') {
                    ctx.fillRect(0, 0, 300, 150);
                } else if (curGlassType == 'shooter glass' || curGlassType == 'shot glass') {
                    ctx.fillRect(0, 70, 300, 150);
                }

                ctx.globalCompositeOperation = "source-over";
                ctx.beginPath();
                if (curGlassType == 'highball glass') {
                    ctx.moveTo(75, 0);
                    ctx.lineTo(75, 150);
                    ctx.lineTo(200, 150);
                    ctx.lineTo(200, 0);
                } else if (curGlassType == 'shooter glass' || curGlassType == 'shot glass') {
                    ctx.moveTo(75, 70);
                    ctx.lineTo(75, 150);
                    ctx.lineTo(140, 150);
                    ctx.lineTo(140, 70);
                }
                ctx.lineWidth = 3;
                ctx.strokeStyle = '#bfbfbf';
                ctx.stroke();

                y += dlt;
                requestAnimationFrame(loop);
            })();
            ///CHART

        });


    });
};

//Parses fractions into floats for chart
function parseFrac(frac) {
 var y = frac.split(' ');
  if(y.length > 1){
      var z = y[1].split('/');
      return (+y[0] + (z[0] / z[1]));
  }
  else{
      var z = y[0].split('/');
      if(z.length > 1){
          return(z[0] / z[1]);
      }
      else{
          return(z[0]);
      }
  }
}

//Map units to a modifier for consistent #s for chart
//Loosely based off of ML, might need to adjust
function mapUnit(unitString) {
  return unitModifers[unitString];
};