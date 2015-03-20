var availableIngredients = [];
var myIngredients = [];

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
          myIngredients.push(curString);
          document.getElementById('ingredients').value = '';
      }
    });
});