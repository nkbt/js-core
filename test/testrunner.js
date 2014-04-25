"use strict";

require.config({
	baseUrl: '../js',
	paths: {
		underscore: '../bower_components/underscore/underscore',
		dom: '../bower_components/jquery/dist/jquery',
		
		test: '../test',
		mocha: '../bower_components/mocha/mocha',
		chai: '../bower_components/chai/chai'
	},
	shim: {
		underscore: {
			exports: '_'
		},
		dom: {
			exports: 'jQuery'
		},
		mocha: {
			exports: 'mocha'
		},
		chai: {
			exports: 'chai'
		}
	}
});

// load tests
require([
	'mocha', 'chai'
], function (mocha, chai) {
	// start the test runner
	mocha.ui('bdd');

	window.expect = chai.expect;

	// load up the tests
	require([
		'test/lib/app'

		// add more here...
	], function () {
		if (window.mochaPhantomJS) {
			mochaPhantomJS.run();
		} else {
			mocha.run();
		}
	});
});