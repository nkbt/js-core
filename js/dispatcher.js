define([
	'module', 'underscore', 'history', 'lib/app', 'lib/router', 'entity/route'
], function (module, _, history, app, router, RouteEntity) {
	"use strict";
	app.log('Loaded');


	var config = _.defaults(module.config(), {
			basePath: 'app/controllers'
		}),
		currentUrl;


	/**
	 * @param {RouteEntity} route
	 * @param {Function?} callback
	 * @returns {*}
	 */
	function run(route, callback) {
		var newUrl = router.routeToUrl(route),
			controllerModule;
		if (newUrl === currentUrl) {
			return callback && callback(null);
		}
		currentUrl = newUrl;
		app.log("run", [JSON.stringify(route)]);

		controllerModule = [config.basePath, route.controller()].join('/');

		if (require.defined(controllerModule)) {
			app.trigger('lib/dispatcher:run', [route]);
			return callback && callback(null);
		} else {
			return require([
					controllerModule
				], function () {
					app.trigger('lib/dispatcher:run', [route]);
					return callback && callback(null);
				}, function (error) {
					app.log('404', [controllerModule, error.message]);
					app.trigger('lib/dispatcher:404', [route]);
					return callback && callback(null);
				}
			);
		}
	}


	/**
	 * @param {String} url
	 * @param {Function?} callback
	 * @returns {*}
	 */
	function dispatch(url, callback) {
		var route = router.urlToRoute(url),
			path = ['/', router.routeToUrl(route)].join('');
		history.pushState(route.get(), "", path);
		return run(route, callback);
	}


	/**
	 * @param {Event} event
	 * @param {String} url
	 * @returns {*}
	 */
	function onDispatch(event, url) {
		return _.isString(url) && dispatch(url);
	}


	/**
	 * @param {Event} event
	 * @returns {*}
	 */
	function onClick(event) {
		event.preventDefault();
		var $link = app.getElement(event, '.lib_dispatcher-link');
		return dispatch($link.attr('href'));
	}


	/**
	 * Restoring current page
	 */
	function restoreState(callback) {
		return dispatch(document.location.href, callback);
	}


	/**
	 * "Reload" current page
	 */
	function reload(callback) {
		return dispatch(document.location.href, callback);
	}


	// Bind to StateChange Event
	history.Adapter.bind(window, 'statechange', function () {
		var state = history.getState(),
			route = new RouteEntity(state.data);
		return run(route);
	});


	app
		.on('lib/dispatcher:dispatch', null, onDispatch)
		.on('lib/dispatcher:reload', null, reload)
		.on('click', '.lib_dispatcher-link', onClick);


	return {
		dispatch: dispatch,
		restoreState: restoreState,
		reload: reload
	};

});
