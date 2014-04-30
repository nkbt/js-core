define([
	'module', 'underscore', 'lib/app', 'lib/router'
], function (module, _, app, router) {
	"use strict";
	app.log('Loaded');

	var config = _.defaults(module.config(), {
		active: 'active'
	});

	function update($context, route) {
		var match = router.cleanUrl([route.controller(), route.action()].join('/')),
			selector = match ? '.lib_navigation-item[data-lib_navigation-route~="' + match + '"]'
				: '.lib_navigation-item[data-lib_navigation-route=""]';

		$context.find(['.lib_navigation-item', config.active].join('.'))
			.removeClass(config.active)
			.attr('data-lib_navigation-active', null);

		return $context.find(selector)
			.addClass(config.active)
			.attr('data-lib_navigation-active', '');
	}


	function onUrlChanged(event, route) {
		return update(app.$root, route);
	}


	function onDomChanged(event) {
		var $context = app.getRoot(event, '.lib_navigation'),
			route = router.urlToRoute(document.location.href);
		return $context && update($context, route);
	}


	app
		.on('lib/dispatcher:run', onUrlChanged)
		.on('lib/layout:changed', '.lib_navigation', onDomChanged);

});
