define([
	'module', 'dom', 'underscore', 'lib/app', 'lib/response'
], function (module, $, _, app, response) {
	"use strict";

	app.log('Loaded');

	var config = _.defaults(module.config(), {
		baseUrl: '',
		isJsonp: false
	});

	function run(method, url, data, callback) {
		app.trigger('lib/request:start');

		var options = {
			url: [config.baseUrl, url].join(''),
			type: method,
			data: {
				'__data': JSON.stringify(data)
			},
			dataType: 'text',
			success: function (json) {
				return response.parse(json, callback);
			},
			error: function (responseText) {
				return response.error(responseText, callback);
			}
		};

		if (config.isJsonp) {
			options.jsonp = '__jsonp';
			options.dataType = 'jsonp';
			options.data.__noError = true;
		}

		return $.ajax(options).always(function () {
			app.trigger('lib/request:complete');
		});
	}

	// expose jQuery.param - though we may phase out jQuery later
	run.param = $.param;

	run.METHOD_GET = 'GET';
	run.METHOD_POST = 'POST';
	run.METHOD_PUT = 'PUT';
	run.METHOD_PATCH = 'PATCH';
	run.METHOD_DELETE = 'DELETE';
	run.METHOD_HEAD = 'HEAD';
	run.METHOD_OPTIONS = 'OPTIONS';

	return run;
});
