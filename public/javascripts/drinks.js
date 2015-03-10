//DOM Ready
$(document).ready(function () {
  $('#search').keypress(function(e) {
    if (e.keyCode == 13) {
      loadDrink();
    }
  });
});

function loadDrink() {
  var drinkToGet = document.getElementById('search').value;
  console.log(drinkToGet);
};