var availableIngredients = [];
var myIngredients = [];
var curString;
var possibleDrinks = [];

//DOM Ready
$(document).ready(function() {
    //Autocomplete on search box
    $.getJSON('/drinks/getIngredients', function(items) {
        $.each(items, function(index, value) {
          availableIngredients.push(value.name);
      });
    });
    
    $( "#ingredients" ).autocomplete({
      source: function(request, response) {
        var results = $.ui.autocomplete.filter(availableIngredients, request.term);
        response(results.slice(0, 8));
      },
      appendTo: '#searcharea'
    });

    //Montior search for enter
    $('#ingredients').keypress(function(e) {
      curString = document.getElementById('ingredients').value;
      if (e.keyCode == 13 && curString != '') {
          addIngredient(curString);
      }
    });

    $('#addingredient').click(function(e) {
      e.preventDefault();
      linkPlus();
    })

    $('#searchbutton').click(function(e) {
      e.preventDefault();
      findDrinks(myIngredients);
    })
});
    
function addIngredient(curIngredient) {
  myIngredients.push(curIngredient.toLowerCase());
  $('#ingredientshelf').append(
    $('<a></a>')
      .text(capitalize(curIngredient) + ' ')
    )
  document.getElementById('ingredients').value = '';
}

function linkPlus() {
  curString = document.getElementById('ingredients').value;
  addIngredient(curString);
}

//Compare function to sort drinks by matches
function compareMatches(a,b) {
  if (a.matching > b.matching)
     return -1;
  if (a.matching < b.matching)
    return 1;
  return 0;
}

function findDrinks(curIngredients) {
  parsedIngredients = myIngredients.join();
  $.getJSON('/drinks/getDrinksByIngredients/' + parsedIngredients, function(items) {
    $.each(items, function(index, value) {
      possibleDrinks.push(value);
    });

    // Counts matching ingredients to sort
    $.each(possibleDrinks, function(index, value) {
      tempIngredients = value.ingredients
      value.matching = Number(0);
      $.each(myIngredients, function(index2, value2) {
        $.each(tempIngredients, function (index3, value3) {
          if(value2 === value3.name) {
            value.matching += 1;
          }
        });
      });
    });

    possibleDrinks.sort(compareMatches);

    $.each(possibleDrinks, function(index, value) {
      curDrink = value.name;
      $('#availabledrinks').append(
        $('<a class="drinklistitem"></a>')
          .text(capitalize(curDrink) + ' - ' + value.matching + ' ingredients owned')
          .attr("href", "/drinks/find/"+value._id),
        $('<br />')
        )
    });
  });
}