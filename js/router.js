define([
	'module', 'underscore', 'entity/route'
], function (module, _, RouteEntity) {
	"use strict";

	var config = _.defaults(module.config(), {
			controllerName: 'index',
			actionName: 'index'
		}),
		routeCleaner = new RegExp(
			[
				["^", config.controllerName, "\/", config.actionName, "$"].join(''),
				["\/", config.actionName, "$"].join(''),
				["^", config.controllerName, "$"].join('')
			].join('|')
		);


	/**
	 * @param {String} url
	 * @returns {RouteEntity}
	 */
	function urlToRoute(url) {
		var location = urlToLocation(url),
			params = location.pathname.split('/'),
			paramsSize = _.size(params),
			route = new RouteEntity({controller: config.controllerName, action: config.actionName});

		if (!!location.search.length) {
			route.query(location.search);
		}

		/**
		 * "/controller"
		 */
		if (paramsSize === 2 && !!params[1].length) {
			route.controller(params[1]);
		} else {

			/**
			 * "/controller/action"
			 */
			if (paramsSize === 3) {
				if (!!params[1].length) {
					route.controller(params[1]);
				}
				if (!!params[2].length) {
					route.action(params[2]);
				}
			}

		}

		return route;
	}


	function urlToLocation(url) {
		var element = document.createElement("a");

		element.href = _.isString(url) && url || '/';
		return {
			hash: element.hash,
			hostname: element.hostname,
			href: element.href,
			pathname: ['/', element.pathname].join('/').replace(new RegExp('^\/+'), '/'),
			port: element.port,
			protocol: element.protocol,
			search: element.search
		};
	}


	function escapeRegExp(str) {
		return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	}


	function getQueryParam(query, name) {
		var regex = new RegExp("[\\?&]" + escapeRegExp(name) + "=([^&#]*)"),
			results = regex.exec(query);
		return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}


	/**
	 * @param {string} url
	 * @returns {string}
	 */
	function cleanUrl(url) {
		return url.replace(routeCleaner, '');
	}

	
	/**
	 * @param {RouteEntity} route
	 */
	function routeToUrl(route) {
		var url = cleanUrl([route.controller(), route.action()].join('/')),
			query = route.query();
		if (!!query) {
			url = [url, query].join('');
		}
		return url;
	}


	return {
		urlToRoute: urlToRoute,
		routeToUrl: routeToUrl,

		getQueryParam: getQueryParam,
		cleanUrl: cleanUrl
	};

});
