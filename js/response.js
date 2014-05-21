/*global console: false */
define([
	'underscore', 'lib/app', 'lib/messenger', 'entity/from-json'
], function (_, app, messenger, fromJson) {
	'use strict';

	function successHandler(responseEntity, callback) {
		var errorMessage = _(responseEntity.message()).reduce(function (result, messageEntity) {
				var type = messageEntity.isError() && messenger.TYPE_ERROR || messenger.TYPE_MESSAGE;
				if (messageEntity.isError()) {
					console.warn(messageEntity.text(), messageEntity.trace().split('\n'));
				}
				app.trigger('messenger:show', [type, messageEntity.text()]);
				return result === null && messageEntity.isError() && messageEntity.text() || null;
			}, null),
			error = errorMessage && new Error(errorMessage) || null,
			payloads = responseEntity.payload(),
			payload;

		if (responseEntity.redirect()) {
			document.location.href = responseEntity.redirect();
			return null;
		}

		if (_.isEmpty(payloads)) {
			return callback(null, null);
		}

		// For now we use only one payloadEntity per response
		// TODO: implement reques batching using payload id
		payload = payloads.shift();
		return callback(error, payload.data());
	}

	function parseResponse(text, callback) {
		if (_.isObject(text)) {
			text = JSON.stringify(text);
		}
		return fromJson(text, function (error, responseEntity) {
			if (!error) {
				successHandler(responseEntity, callback);
			} else {
				veryBadErrorHandler(error, callback);
			}
		});
	}

	function errorHandler(response, callback) {
		if (!response.responseText) {
			return veryBadErrorHandler(new Error("Application Error"), callback);
		}
		return parseResponse(response.responseText, callback);
	}

	function veryBadErrorHandler(error, callback) {
		app.trigger('messenger:show', [messenger.TYPE_ERROR, error.message]);
		return callback(error);
	}

	return {
		parse: parseResponse,
		error: errorHandler
	};
});
