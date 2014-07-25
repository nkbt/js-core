/*global console: false */
define([
	'module', 'dom', 'underscore'
], function (module, $, _) {
	"use strict";

	var config = _.defaults(module.config(), {
			log: false
		}),
		$element = $(document.body),
		app;

	function fillItem(prefix, key, value) {
		return function (item) {
			var $item = $(item),
				target = $item.attr([prefix, '-', key].join(''));
			if (target) {
				target.split(',').forEach(function (targetAttr) {
					if (targetAttr === 'value' && $item.is('[type=radio]')) {
						$item.prop('checked', ($item.val() === value));
					} else if (targetAttr === 'value' && _.isFunction($item.val)) {
						$item.val(value).trigger('change');
					} else if (targetAttr === 'html') {
						$item.html(value);
					} else {
						$item.attr(targetAttr, value);
					}
				});
			} else {
				$item.html(value);
			}
			return $item;
		};
	}

	function fill($element, prefix, data) {
		return _.each(data, function (value, key) {
			var selector = ['[', prefix, '-', key, ']'].join('');
			return _.each($element.find(selector).add($element.filter(selector)), fillItem(prefix, key, value));
		});
	}

	function log(/* String */ method, /* Array */ args) {
		if (!config.log) {
			return null;
		}
		try {
			throw new Error('debug');
		} catch (/* Error */ exc) {
			return console.log(method, args, '\n', _.rest(exc.stack.split('\n'), 2).join('\n'));
		}
	}


	function on() {
		var args = _.toArray(arguments);
		log('on', _.initial(args));
		$element.on.apply($element, args);
		return app;
	}


	function off() {
		var args = _.toArray(arguments);
		log('off', _.initial(args));
		$element.off.apply($element, args);
		return app;
	}


	function one() {
		var args = _.toArray(arguments);
		log('one', _.initial(args));
		$element.one.apply($element, args);
		return app;
	}


	function trigger() {
		var args = _.toArray(arguments),
			$target = _.first(args);
		if ($target instanceof $) {
			log('trigger', _.flatten(_.union([$target.get(0)], _.rest(args))));
			$target.trigger.apply($target, _.rest(args));
		} else if (_.isElement($target)) {
			log('trigger', _.flatten(args));
			$target = $($target);
			$target.trigger.apply($target, _.rest(args));
		} else {
			log('trigger', _.flatten(_.union([$element.get(0)], args)));
			$element.trigger.apply($element, args);
		}

		return app;
	}


	function domReady(callback) {
		return $(callback);
	}


	function asyncDomReady(callback) {
		return domReady(function () {
			var args = _.toArray(arguments);
			args.unshift(null);
			return callback.apply(null, args);
		});
	}


	function getElement(event, selector) {
		return $(event.target).closest(selector);
	}


	function getRoot(event, selector) {
		var $element = $(event.target);
		return $element.is(selector) && $element || false;
	}


	app = {
		$root: $element,
		fill: fill,

		on: on,
		off: off,
		one: one,
		trigger: trigger,

		ready: domReady,
		asyncReady: asyncDomReady,
		getElement: getElement,
		getRoot: getRoot,

		log: log
	};


	return app;
});
