//DOM Ready
$(document).ready(function() {
    $("#drinklist").empty();
    loadDrinkList();
});

function loadDrinkList() {
	$.getJSON('/drinks/getDrinkNames', function(items) {
    $.each(items, function(index, value) {
      $("#drinklist").append(
        $('<a class="drinklistitem"></a><br />')
        .text(capitalize(value.name+''))
        .css("color", '#d0d0d0')
        .attr("href", "/drinks/find/"+value._id)
      );
    });
   });
};