define(['underscore', 'entity/abstract'], function (_, factory) {
	"use strict";

	var exports = {Entity: null},
		_namespace = "route";

/**
 * @module RouteEntity
 */
var RouteEntity = {
	controller: function () {
	},
	action: function () {
	},
	query: function () {
	}
};

exports.Entity = RouteEntity;


	return function (defaults) {
		return factory(_namespace, exports.Entity, defaults);
	};
});
