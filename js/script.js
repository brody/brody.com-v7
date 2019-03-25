// Mobile Nav Expand & Theme Toggle

$(function () {
    $("#sandwich").on("click", function () {
        $("#menu").toggleClass("hidden");
        $("#theme-toggle").toggleClass("hidden");
        $("#nav").toggleClass("nav-open");
    });
    $("#toggle-day").on("click", function () {
        Cookies.set('theme', 'day', { expires: 7 });
        $("html").removeClass("night");
        $("html").removeClass("font-mono");
        $("html").addClass("day");
        $("#theme-toggle svg").removeClass("text-primary-01");
        $(this).find("svg").addClass("text-primary-01");
        if ($('html').hasClass("konami")) {
            draw();
            $("html").removeClass("konami");
        };
    });
    $("#toggle-night").on("click", function () {
        Cookies.set('theme', 'night', { expires: 7 });
        $("html").removeClass("day");
        $("html").removeClass("font-mono");
        $("html").addClass("night");
        $("#theme-toggle svg").removeClass("text-primary-01");
        $(this).find("svg").addClass("text-primary-01");
        if ($('html').hasClass("konami")) {
            draw();
            $("html").removeClass("konami");
        };
    });
});

// Logo Collapse

$(window).scroll(function(){
    if ($(this).scrollTop() > 54) {
       $('#logo').addClass('collapse');
    } else {
       $('#logo').removeClass('collapse');
    }
});
