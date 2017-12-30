$('#nav-button').click(function() {
  $('#overlay').addClass('overlay-open');
});
$('#close-button').click(function() {
  $('#overlay').removeClass('overlay-open');
});

$(function() {
    // get hour of time
    var hour = new Date().getHours();

    // change to night mode between 6pm & 8am
    if (hour > 17 || hour < 8) {
        $('body').addClass('night');
}
});

// $(function() {
//
// var from = document.referrer;
// window.alert(from);
//
// });
