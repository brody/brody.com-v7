// Night Mode ////////////////////////////////////////////

$(function() {
    // get hour of time
    var hour = (new Date).getHours();

    if (hour > 17) {  // 0:00 to 6:59
        $('html').addClass('night');
    } else if (hour < 8) {  // 7:00 to 10:59
        $('html').addClass('night');
    }

});


// Night Mode Toggle //////////////////////////////////////

$('#moon').on('click', function() {
  $('html').toggleClass('night');
});


// Menu Toggle ///////////////////////////////////////////

$('.hamburger').click(function(event) {
  event.stopPropagation();
  $('#menu').toggleClass('is-open');
  $(this).toggleClass('is-open');

});

$('#menu').click(function(event) {
  event.stopPropagation();
});

$('nav').click(function(event) {
 // remove me when nav is removed
  event.stopPropagation();
});

$(document).click(function() {
  $('#menu').removeClass('is-open');
  $('.hamburger').removeClass('is-open');
});
