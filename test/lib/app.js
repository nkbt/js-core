define(['lib/app', 'dom'], function (app, $) {
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

		describe('fill', function () {

			it('should trigger change event when filling value', function (done) {

				var $element = $('<div/>').appendTo('body'),
					$input = $('<input data-fill_me-text="value">').appendTo($element);

				$input.on('change', function (event) {
					expect(event).to.be.an.object;
					expect(event.target.value).to.equal('hello');

					done();
				});

				app.fill($element, 'data-fill_me', {
					text: 'hello'
				});

			});

		});

	});

});
