//DOM Ready
$(document).ready(function() {
  $("#colorlist").empty();
  loademptycolors();
});

function loademptycolors() {
	$.getJSON('/drinks/getEmptyColors', function(items) {
    $.each(items, function(index, value) {
    	$("#colorlist").append(
        value.name + ' '
      );
      $("#colorlist").append(
        $('<input type="text">')
        	.attr('id', "color"+index)
      );
      $("#colorlist").append(
        $('<br />')
      );
      $("#color"+index).spectrum(
      { 
        color: value.color,
        showButtons: false,
        hide: function(color){
          console.log(color)
          var address = '/drinks/changeColor/'+value.name+'/'+color.toHex();
          $.post(address);
        },
      });
    });
    $.getJSON('/drinks/getEmptyColorsCount', function(body) {
      $("#colorlist").append(
        'Remaining uncolored: ' + body.total
      );
    });
   });
}

