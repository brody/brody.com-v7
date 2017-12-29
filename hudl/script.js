(function($) {
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') || location.hostname == this.hostname) {

      var target = $(this.hash),
        headerHeight = $(".navbar").height(); // Get fixed header height

      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');

      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top - headerHeight
        }, 500);
        return false;
      }
    }
  });
})(jQuery);

// Redirect mobile devices to Prototype

if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
  location.replace("https://marvelapp.com/8751g7");
} else if ((navigator.userAgent.match(/iPad/i))) {
  location.replace("https://marvelapp.com/8751g7?emb=1");
}
