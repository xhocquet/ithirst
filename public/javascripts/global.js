var availableTags = [];
var tagIds = [];

//DOM Ready
$(document).ready(function() {
    //Autocomplete on search box
    $.getJSON('/drinks/getDrinkNames', function(items) {
        $.each(items, function(index, value) {
          availableTags.push(capitalize(value.name));
          tagIds.push(value._id);
      });
    });

    $( "#tags" ).autocomplete({
      source: function(request, response) {
        var results = $.ui.autocomplete.filter(availableTags, request.term);
        response(results.slice(0, 20));
      },
      appendTo: '#navsearch'
    });

    //Montior search for enter
    $('#tags').keypress(function(e) {
      curString = document.getElementById('tags').value.toLowerCase();
      if (e.keyCode == 13 && curString != '') {
          i = availableTags.indexOf(capitalize(curString));
          window.location.assign('/drinks/find/' + tagIds[i]);
      }
    });
});

//Capitalization helper
function capitalize(input) {
    var split = input.split(' ');
    for (var i = 0, len = split.length; i < len; i++) {
        if (split[i].length > 3 || split[i] == 'gin' || split[i] == 'old' || split[i] == 'dry' || split[i] == 'kir' || split[i] == 'red' || split[i] == 'sec' || split[i] == 'rum' || split[i] == 'pie' || split[i] == 'sex' || split[i] == 'tea') {
          split[i] = split[i].charAt(0).toUpperCase() + split[i].slice(1);
        }
    }
    return split.join(' ');
};