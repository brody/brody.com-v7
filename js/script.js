

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
    // else if (hour < 23) {  // 11:00 to 15:59
    //     $('#intro').addClass('select');
    // }

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




/*
Last.FM jQuery plugin
shows recently played tracks
Athor: Ringo Rohe
       - with much help from Douglas Neiner
-- lastplayed --
Options:
apikey:         (string) Last.fm API key - get it from here: http://www.lastfm.com/api/account
username:       (string) username
limit:          (int) Number of tracks to load - optional, default is 20
cover:          (bool) show covers - optional, default is true
coversize:      (int) cover image size - optional, default is 64
datetime:       (bool) show date and time - optional, default is true
refresh:        (int) number of seconds to check for new tracks - optional, default is 0 (no refresh)
grow:           (bool) if true new tracks extend the box, if false older tracks will be removed - optional, default is false
shownowplaying: (bool) shows currently playing tracks - optional, default is true
albumlinks:		(bool) wraps album text in a link to last.fm - optional, default is false
coverlinks:		(bool) wraps cover text in a link to last.fm - optional, default is false
artistlinks:	(bool) wraps artist text in a link to last.fm - optional, default is false
tracklinks:		(bool) wraps track text in a link to last.fm - optional, default is false
linktarget:		(string) the target attribute value for album, cover, artist, and track links (if enabled) - optional, default is `_blank`
Usage:
$(document).ready(function() {
	$('#LastFM').lastplayed({
		apikey:     'b25b9595...',
		username:   'Username',
		limit:      5,
		cover:      true,
		datetime:   true,
		refresh:    30,
		grow:       true
	});
});
-- nowplaying --
Options
apikey:         (string) Last.fm API key - get it from here: http://www.lastfm.com/api/account
username:       (string) username
refresh:        (int) number of seconds to check for new tracks - optional, default is 0 (no refresh)
icon:			(string) url of a Icon showed beside the text - optional, default is false
hide:			(bool) hides the element when nothing is playing - optional, default is false
notplayingtext:	(string) text that is shown when nothing is played - optional, default is 'nothing playing'
Usage:
$('#nowPlayingBox').nowplaying({
	apikey:			'b25b9595...',
	username:		'Username',
	refresh:		30,
	icon:			'http://cdn.last.fm/flatness/global/icon_eq.gif',
	hide:			false,
	notplayingtext:	'some text'
});
############## BUGS ####################
- tell me if you find some
*/

(function ($) {

	/* ######################### Recent Tracks Class definition ################################# */

	var recentTracksClass = function (elem, options) {

		var $myDiv	 = elem,
			lasttime = 0,
			refresh	 = parseInt(options.refresh, 10),
			$list,
			timer,
			lastCurrentPlaying = false,
			lastfmLinkPrefix = 'http://www.last.fm/music/';

		function error( message ) {
			 $("<p>", {
					class: "error",
					html: message
				}).appendTo($myDiv);
				window.clearInterval(timer);
		}

		function makeTwo(i) {
			return i < 10 ? '0' + i : i;
		}

    function calculateDateAgo(secAgo) {
     var agoString, agoRange, agoScaled;
     if(secAgo >= (agoRange = 60*60*24))
       agoString = (agoScaled = Math.floor(secAgo/agoRange))+" "+(agoScaled>1?"days":"day") + " ago"
     else if(secAgo >= (agoRange = 60*60))
       agoString = (agoScaled = Math.floor(secAgo/agoRange))+" "+(agoScaled>1?"hours":"hour") + " ago"
     else if(secAgo >= (agoRange = 60))
       agoString = (agoScaled = Math.floor(secAgo/agoRange))+" "+(agoScaled>1?"minutes":"minute") + " ago"
     else if(secAgo >= -60)
       agoString = "listening just now";
     else
       agoString = "soon ;)";
     return agoString
    }

		function doLastPlayedStuff() {

			// remove error div if exists
			$myDiv.children('.error').remove();

			//create URL
			var url = 'https://ws.audioscrobbler.com/2.0/?callback=?',
				params = {
					method:  "user.getrecenttracks",
					format:  "json",
					limit:   options.limit,
					user:    options.username,
					api_key: options.apikey
				};

			//sending request
			$.getJSON(url, params, function(data) {

				var foundCurrentPlayingTrack = false;

				//check for errors
				if ( !data || !data.recenttracks ) {
					return error('Username "' + options.username + '" does not exist!');
				} else if( !data.recenttracks.track ) {
					return error('"' + options.username + '" has no tracks to show!');
				}

				//create ul if not exists
				$list = $myDiv.children('ul');
				if (!$list.length) {
					$list = $("<ul>").appendTo( $myDiv.html('') );
				}

				//walk through each Track - reversed to fill up list from latest to newest
				$(data.recenttracks.track.reverse()).each(function() {
					var track = this;
					var tracktime, tracknowplaying, ts, listitem, dateCont;

					//getting timestamp from latestentry
					if(track.date && track.date.uts > lasttime) {
						tracktime = parseInt(track.date.uts, 10);
					}

					//check if entry is currently playing
					if( track['@attr'] && track['@attr'].nowplaying === 'true' ) {
						foundCurrentPlayingTrack = true;
						if( lastCurrentPlaying.name !== track.name ) {
							lastCurrentPlaying = track;
							tracknowplaying = true;
							//remove old nowplaying entry
							$list.children('li.nowplaying').remove();
						}
					}

					if(tracktime > lasttime || (tracknowplaying && options.shownowplaying)) {

						// ------------ create list item -----------
						listitem = $( "<li>", {
							// add nowplaying class
							class: tracknowplaying ? "nowplaying" : ""
						});

						// ----------------- IMAGE -----------------
						if (options.cover) {
							if (track.image[2]['#text']) {
								var $cover = $("<img>", {
									alt: track.artist['#text'],
									src: track.image[2]['#text'],
									width: parseInt(options.coversize, 10)
								}).appendTo(listitem);

								if(options.coverlinks){
									var coverpath = [
										track.artist['#text'],'/',
										track.album['#text']
									].join('').replace(/[\s]/gi,'+');

									$cover.wrap($("<a>", {
										href: lastfmLinkPrefix+coverpath,
										target: options.linktarget
									}));
								}
							}
						}

						// ----------------- TRACK -----------------
						var $track = $("<div>", {
							class: 'track',
							html: track.name
						}).appendTo(listitem);

						if(options.tracklinks){
							var trackpath = [
								track.artist['#text'],'/',
								track.album['#text'],'/',
								track.name
							].join('').replace(/[\s]/gi,'+');

							$track.wrapInner($("<a>", {
								href: lastfmLinkPrefix+trackpath,
								target: options.linktarget
							}));
						}

						// ---------------- ARTIST -----------------
						var $artist = $("<div>", {
							class: 'artist',
							html: track.artist['#text']
						}).appendTo(listitem);

						if(options.artistlinks){
							$artist.wrapInner($("<a>", {
								href: lastfmLinkPrefix+(track.artist['#text'].replace(/[\s]/gi,'+')),
								target: options.linktarget
							}));
						}

						// ---------------- ALBUM ------------------
						// var $album = $("<div>", {
						// 	class: 'album',
						// 	html: track.album['#text']
						// }).appendTo(listitem);
            //
						// if(options.artistlinks){
						// 	var artistpath = [
						// 		track.artist['#text'],'/',
						// 		track.album['#text']
						// 	].join('').replace(/[\s]/gi,'+');
            //
						// 	$album.wrapInner($("<a>", {
						// 		href: lastfmLinkPrefix+artistpath,
						// 		target: options.linktarget
						// 	}));
						// }


            // ---------------- DATE -------------------
            if (options.datetime) {

              if (tracknowplaying) {
                dateCont = 'Now playing';
              } else {
                ts = new Date(tracktime * 1000);
                dateCont = makeTwo(ts.getDate())+'.'+makeTwo(ts.getMonth()+1)+' - '+makeTwo(ts.getHours())+':'+makeTwo(ts.getMinutes());
              }

              $("<div>", {
                class: "date",
                html: dateCont
              }).appendTo(listitem);
            }


						//add listitem to list
						$list.prepend(listitem);

						if(!tracknowplaying) {
							lasttime = tracktime;
						}
					}

				});

				if( !foundCurrentPlayingTrack ) {
					lastCurrentPlaying = false;
					//remove old nowplaying entry
					$list.children('li.nowplaying').remove();
				}

				//throw old entries away
				if (options.grow === false) {
					while($list.children().length > options.limit) {
						$list.children('li').last().remove();
					}
				}

			});

		}

		if (refresh > 0) {
			timer = window.setInterval(function(){
				doLastPlayedStuff();
			}, refresh * 1000);
		}

		doLastPlayedStuff();
	};

	/* ######################## Recent Tracks Class ends here ################################# */





	/* ######################### Now Playing Class definition ################################# */

	var nowPlayingClass = function (elem, options) {

		var $myDiv	 = elem,
			refresh	 = parseInt(options.refresh, 10),
			timer;

		function error( message ) {
			 $("<p>", {
					class: "error",
					html: message
				}).appendTo($myDiv);
				window.clearInterval(timer);
		}

		function update( html ) {
			$myDiv.html( html );
		}

		function nowPlayingInterval() {

			// remove error div if exists
			$myDiv.children('.error').remove();

			//create URL
			var url = 'https://ws.audioscrobbler.com/2.0/?callback=?',
				params = {
					method:  "user.getrecenttracks",
					format:  "json",
					limit:   1,
					user:    options.username,
					api_key: options.apikey
				};

			//sending request
			$.getJSON(url, params, function(data) {

				//check for errors
				if ( !data || !data.recenttracks ) {
					return error('Username "' + options.username + '" does not exist!');
				} else if( !data.recenttracks.track ) {
					return error('"' + options.username + '" has no tracks to show!');
				}

				var track = data.recenttracks.track[0];

				if( track && track['@attr'] && track['@attr'].nowplaying === 'true' ) {
					var html = '';

					if (options.icon) {
						html = html + '<img src="' + options.icon + '" class="icon" alt="now playing icon" />';
					}

					html = html + '<span class="track">' + track.artist['#text'] + '</span>';
					html = html + ' - ';
					html = html + '<span class="track">' + track.name + '</span>';
					if(track.album['#text']) {
						html = html + ' (';
						html = html + '<span class="track">' + track.album['#text'] + '</span>';
						html = html + ')';
					}

					$myDiv.show();
					update(html);
				} else {
					if(options.hide) {
						$myDiv.hide();
					} else {
						update(options.notplayingtext);
					}
				}

			});

		}

		if (refresh > 0) {
			timer = window.setInterval(function(){
				nowPlayingInterval();
			}, refresh * 1000);
		}

		nowPlayingInterval();
	};

	/* ######################## Now Playing Class ends here ################################# */








	/* ##################################### Recent Tracks Function ########################### */

	$.fn.lastplayed = function (options) {
		var opts = $.extend({}, $.fn.lastplayed.defaults, options);

		if (typeof(options.username) === "undefined") {
			return this;
		}

		if (typeof(options.apikey) === "undefined") {
			return this;
		}

		return this.each(function(){
			recentTracksClass($(this), opts);
		});

	};

	$.fn.lastplayed.defaults = {
		limit:			5,
		refresh:		0,
		cover:			true,
		// coversize:		56,
		datetime:		true,
		grow:			false,
		shownowplaying:	true,
		albumlinks:		false,
		coverlinks:		false,
		artistlinks:	false,
		tracklinks:		true,
		linktarget:		'_blank'
	};



	/* ################################# Now Playing Function ################################ */

	$.fn.nowplaying = function (options) {
		var opts = $.extend({}, $.fn.nowplaying.defaults, options);

		if (typeof(options.username) === "undefined") {
			return this;
		}

		if (typeof(options.apikey) === "undefined") {
			return this;
		}

		return this.each(function(){
			nowPlayingClass($(this), opts);
		});

	};

	$.fn.nowplaying.defaults = {
		refresh:		0,
		icon:			false,
		hide:			false,
		notplayingtext: 'nothing playing'
	};

}(jQuery));


$(document).ready(function() {
	$('#lastFM').lastplayed({
		apikey:     '75176bb2349e51a475ea56ac979f7dc4',
		username:   'brodym',
		limit:      5,
		cover:      true,
		datetime:   true,
		refresh:    30,
		grow:       true
	});
});
