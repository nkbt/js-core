define(['lib/app'], function (app) {
	"use strict";

	describe('app', function () {

		describe('events', function () {

			it('should trigger a custom event', function (done) {

				app.on('custom:event', '', function (event) {
					expect(event).to.be.an.object;

					done();
				});

				app.trigger('custom:event');

			});

		});

	});

});
