

// Night Mode ////////////////////////////////////////////

$(function() {
    // get hour of time
    var hour = (new Date).getHours();

    // remove select class if already applied
    // $('.select').removeClass('select');

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



/**
 * Timeago is a jQuery plugin that makes it easy to support automatically
 * updating fuzzy timestamps (e.g. "4 minutes ago" or "about 1 day ago").
 *
 * @name timeago
 * @version 1.6.3
 * @requires jQuery v1.2.3+
 * @author Ryan McGeary
 * @license MIT License - http://www.opensource.org/licenses/mit-license.php
 *
 * For usage and examples, visit:
 * http://timeago.yarp.com/
 *
 * Copyright (c) 2008-2017, Ryan McGeary (ryan -[at]- mcgeary [*dot*] org)
 */

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof module === 'object' && typeof module.exports === 'object') {
    factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function ($) {
  $.timeago = function(timestamp) {
    if (timestamp instanceof Date) {
      return inWords(timestamp);
    } else if (typeof timestamp === "string") {
      return inWords($.timeago.parse(timestamp));
    } else if (typeof timestamp === "number") {
      return inWords(new Date(timestamp));
    } else {
      return inWords($.timeago.datetime(timestamp));
    }
  };
  var $t = $.timeago;

  $.extend($.timeago, {
    settings: {
      refreshMillis: 60000,
      allowPast: true,
      allowFuture: false,
      localeTitle: false,
      cutoff: 0,
      autoDispose: true,
      strings: {
        prefixAgo: null,
        prefixFromNow: null,
        suffixAgo: "ago",
        suffixFromNow: "from now",
        inPast: 'any moment now',
        seconds: "a minute",
        minute: "a minute",
        minutes: "%d minutes",
        hour: "an hour",
        hours: "%d hours",
        day: "a day",
        days: "%d days",
        month: "a month",
        months: "%d months",
        year: "about a year",
        years: "%d years",
        wordSeparator: " ",
        numbers: []
      }
    },

    inWords: function(distanceMillis) {
      if (!this.settings.allowPast && ! this.settings.allowFuture) {
          throw 'timeago allowPast and allowFuture settings can not both be set to false.';
      }

      var $l = this.settings.strings;
      var prefix = $l.prefixAgo;
      var suffix = $l.suffixAgo;
      if (this.settings.allowFuture) {
        if (distanceMillis < 0) {
          prefix = $l.prefixFromNow;
          suffix = $l.suffixFromNow;
        }
      }

      if (!this.settings.allowPast && distanceMillis >= 0) {
        return this.settings.strings.inPast;
      }

      var seconds = Math.abs(distanceMillis) / 1000;
      var minutes = seconds / 60;
      var hours = minutes / 60;
      var days = hours / 24;
      var years = days / 365;

      function substitute(stringOrFunction, number) {
        var string = $.isFunction(stringOrFunction) ? stringOrFunction(number, distanceMillis) : stringOrFunction;
        var value = ($l.numbers && $l.numbers[number]) || number;
        return string.replace(/%d/i, value);
      }

      var words = seconds < 45 && substitute($l.seconds, Math.round(seconds)) ||
        seconds < 90 && substitute($l.minute, 1) ||
        minutes < 45 && substitute($l.minutes, Math.round(minutes)) ||
        minutes < 90 && substitute($l.hour, 1) ||
        hours < 24 && substitute($l.hours, Math.round(hours)) ||
        hours < 42 && substitute($l.day, 1) ||
        days < 30 && substitute($l.days, Math.round(days)) ||
        days < 45 && substitute($l.month, 1) ||
        days < 365 && substitute($l.months, Math.round(days / 30)) ||
        years < 1.5 && substitute($l.year, 1) ||
        substitute($l.years, Math.round(years));

      var separator = $l.wordSeparator || "";
      if ($l.wordSeparator === undefined) { separator = " "; }
      return $.trim([prefix, words, suffix].join(separator));
    },

    parse: function(iso8601) {
      var s = $.trim(iso8601);
      s = s.replace(/\.\d+/,""); // remove milliseconds
      s = s.replace(/-/,"/").replace(/-/,"/");
      s = s.replace(/T/," ").replace(/Z/," UTC");
      s = s.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"); // -04:00 -> -0400
      s = s.replace(/([\+\-]\d\d)$/," $100"); // +09 -> +0900
      return new Date(s);
    },
    datetime: function(elem) {
      var iso8601 = $t.isTime(elem) ? $(elem).attr("datetime") : $(elem).attr("title");
      return $t.parse(iso8601);
    },
    isTime: function(elem) {
      // jQuery's `is()` doesn't play well with HTML5 in IE
      return $(elem).get(0).tagName.toLowerCase() === "time"; // $(elem).is("time");
    }
  });

  // functions that can be called via $(el).timeago('action')
  // init is default when no action is given
  // functions are called with context of a single element
  var functions = {
    init: function() {
      functions.dispose.call(this);
      var refresh_el = $.proxy(refresh, this);
      refresh_el();
      var $s = $t.settings;
      if ($s.refreshMillis > 0) {
        this._timeagoInterval = setInterval(refresh_el, $s.refreshMillis);
      }
    },
    update: function(timestamp) {
      var date = (timestamp instanceof Date) ? timestamp : $t.parse(timestamp);
      $(this).data('timeago', { datetime: date });
      if ($t.settings.localeTitle) {
        $(this).attr("title", date.toLocaleString());
      }
      refresh.apply(this);
    },
    updateFromDOM: function() {
      $(this).data('timeago', { datetime: $t.parse( $t.isTime(this) ? $(this).attr("datetime") : $(this).attr("title") ) });
      refresh.apply(this);
    },
    dispose: function () {
      if (this._timeagoInterval) {
        window.clearInterval(this._timeagoInterval);
        this._timeagoInterval = null;
      }
    }
  };

  $.fn.timeago = function(action, options) {
    var fn = action ? functions[action] : functions.init;
    if (!fn) {
      throw new Error("Unknown function name '"+ action +"' for timeago");
    }
    // each over objects here and call the requested function
    this.each(function() {
      fn.call(this, options);
    });
    return this;
  };

  function refresh() {
    var $s = $t.settings;

    //check if it's still visible
    if ($s.autoDispose && !$.contains(document.documentElement,this)) {
      //stop if it has been removed
      $(this).timeago("dispose");
      return this;
    }

    var data = prepareData(this);

    if (!isNaN(data.datetime)) {
      if ( $s.cutoff === 0 || Math.abs(distance(data.datetime)) < $s.cutoff) {
        $(this).text(inWords(data.datetime));
      } else {
        if ($(this).attr('title').length > 0) {
            $(this).text($(this).attr('title'));
        }
      }
    }
    return this;
  }

  function prepareData(element) {
    element = $(element);
    if (!element.data("timeago")) {
      element.data("timeago", { datetime: $t.datetime(element) });
      var text = $.trim(element.text());
      if ($t.settings.localeTitle) {
        element.attr("title", element.data('timeago').datetime.toLocaleString());
      } else if (text.length > 0 && !($t.isTime(element) && element.attr("title"))) {
        element.attr("title", text);
      }
    }
    return element.data("timeago");
  }

  function inWords(date) {
    return $t.inWords(distance(date));
  }

  function distance(date) {
    return (new Date().getTime() - date.getTime());
  }

  // fix for IE6 suckage
  document.createElement("abbr");
  document.createElement("time");
}));


// LastFm Top Artists ////////////////////////////////////////////

$(document).ready(function() {
    $.getJSON("https://ws.audioscrobbler.com/2.0/?method=user.getTopArtists&user=brodym&api_key=75176bb2349e51a475ea56ac979f7dc4&period=1month&limit=5&format=json&callback=?", function(json) {
        var html = '';
        $.each(json.topartists.artist, function(i, item) {
            html += "<li><img src=" + item.image[2]['#text'] + " alt=" + item.name + "><div class='artist'><a href=" + item.url + " target='_blank'>" + item.name + "</a></div><div class='play-count'>" + item.playcount + " plays" + "</div></li>"

        });
        $('#lastFM-top-artists ul').append(html);
    });
});


// LastFm Recent Tracks

$(document).ready(function() {
    $.getJSON("https://ws.audioscrobbler.com/2.0/?callback=?&method=user.getrecenttracks&format=json&limit=5&user=brodym&api_key=75176bb2349e51a475ea56ac979f7dc4&_=1535163214017", function(json) {
        var html = '';
        $.each(json.recenttracks.track, function(i, item) {

            if( item && item['@attr'] && item['@attr'].nowplaying === 'true' ) {
              var trackdate = "<div class='date track--now-playing'> Now Playing </div>";
            }
            else {
              var offset = new Date().getTimezoneOffset()/60;
              var trackdateuts = new Date(item.date['#text']).toISOString().slice(0, -1);
              var trackdate = "<div class='date timeago' title='" + trackdateuts + offset + "'></div>";
              console.log(offset);
              console.log(trackdateuts);

              // var tzoffset = (new Date(item.date['#text'])).getTimezoneOffset() * 60000; //offset in milliseconds
              // var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
              // => '2015-01-26T06:40:36.181'
              // console.log(tzoffset);
              // console.log(localISOTime);


            }

            if (item.image[2]['#text']) {
              var trackimage = "<img " + "src='" + item.image[2]['#text'] + "'" + " alt='" + item.name + "'>";
            }
            else {
              var trackimage = "<img " + "src='/assets/images/track-placeholder.svg'" + " alt='" + item.name + "'>";
            }

            html += "<li>" + trackimage + "<div class='track'><a href=" + item.url + " target='_blank'>" + item.name + "</a></div><div class='artist'>" + item.artist['#text'] + "</div>" + trackdate + "</li>"
        });
        $('#lastFM-recent-tracks ul').append(html);
        $(".timeago").timeago().delay(600);

    });

});
