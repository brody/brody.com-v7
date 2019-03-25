/**
 * @license konami-js v1.0.1
 * http://mck.me/mit-license
 */
var Konami = {};

(function(Konami, window) {
	'use strict';

	/**
	 * Creates an event handler responding to the specified sequence.
	 * @param {...number|function()} arguments
	 * @return {function(Event)}
	 */
	var sequence = Konami.sequence = function() {
		var sequence = Array.prototype.slice.call(arguments),
			state = 0;

		/**
		 * Event handler
		 * @param {Event|number} e
		 */
		return function(e) {
			// patch legacy IE
			e = (e || window.event);
			e = (e.keyCode || e.which || e);

			if (e === sequence[state] || e === sequence[(state = 0)]) {
				// move next and peek
				var action = sequence[++state];

				// sequence complete when a function is reached
				if (typeof action !== 'function') {
					return;
				}

				// fire action
				action();

				// reset when sequence completed
				state = 0;
			}
		};
	};

	/**
	 * Creates an event handler responding to the Konami Code.
	 * @param {function()} action completed sequence callback
	 * @return {function(Event)}
	 */
	Konami.code = function(action) {
		return sequence(38, 38, 40, 40, 37, 39, 37, 39, 66, 65, action);
	};

})(Konami, window);

$(document).on('keyup',

	Konami.code(function() {
		// alert('Congratulations, 30 lives!');
		$(function () {
			Cookies.set('theme', 'konami', { expires: 7 });
			$("html").addClass("konami");
			$("html").removeClass("night");
			$("html").removeClass("day");
			$("html").addClass("font-mono");
			$("#theme-toggle svg").removeClass("text-primary-01");
			$(".konami").append("<audio id='1up' preload='auto'><source src='/audio/1-up.wav' type='audio/wav'></audio>");
			$("audio#1up")[0].play();
			draw();
			(function smoothscroll(){
				var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
				if (currentScroll > 0) {
					 window.requestAnimationFrame(smoothscroll);
					 window.scrollTo (0,currentScroll - (currentScroll/32));
				}
			})();
		});
	})

);
