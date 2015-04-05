var availableIngredients = [];
var myIngredients = [];
var curString;

//DOM Ready
$(document).ready(function() {
    //Autocomplete on search box
    $.getJSON('/drinks/getIngredients', function(items) {
        $.each(items, function(index, value) {
          availableIngredients.push(capitalize(value.name));
      });
    });
    
    $( "#ingredients" ).autocomplete({
      source: availableIngredients,
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

function findDrinks(curIngredients) {
  parsedIngredients = curIngredients.join();
  $.getJSON('/drinks/getDrinksByIngredients/' + parsedIngredients, function(items) {
    $.each(items, function(index, value) {
      curDrink = value.name;
      $('#availabledrinks').append(
        $('<a></a>')
          .text(capitalize(curDrink))
        )
    });
  });
}