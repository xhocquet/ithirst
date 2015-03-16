var availableTags = [];

//DOM Ready
$(document).ready(function() {
    //Autocomplete on search box
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
      curString = document.getElementById('tags').value;
      if (e.keyCode == 13 && curString != '') {
          window.location.assign('/drinks/find/' + curString);
      }
    });
});

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