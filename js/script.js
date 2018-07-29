// document.onreadystatechange=function(){
//
//   var date = new Date();
//   var hour = date.getHours();
//
//   if (hour > 17 || hour < 8) {
//       document.body.className += ' ' + 'night';
//   }
//
// };
//
// $(function() {
//     // get hour of time
//     var hour = (new Date).getHours();
//
//     if (hour > 17 || hour < 8) {
//         $('html').addClass('night');
//
// });

$(function() {
    // get hour of time
    var hour = (new Date).getHours();

    // remove select class if already applied
    // $('.select').removeClass('select');

    if (hour > 17) {  // 0:00 to 6:59
        $('html').addClass('night');
    } else if (hour < 8) {  // 7:00 to 10:59
        $('body').addClass('night');
    }
    // else if (hour < 23) {  // 11:00 to 15:59
    //     $('#intro').addClass('select');
    // }

});


$('#moon').on('click', function() {
  $('html').toggleClass('night');
});


$('#btn-hamburger').click(function(event) {
  event.stopPropagation();
  $('#menu').toggleClass('is-open');
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
});
