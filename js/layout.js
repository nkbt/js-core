define([
	'dom', 'underscore', 'async', 'lib/app'
], function ($, _, async, app) {
	"use strict";
	app.log('Loaded');

	var triggerRenderingDone = _.debounce(function ($context) {
		app.trigger($context, 'lib/layout:finished');
	}, 200);


	function renderTemplate(element, callback) {
		var $element = $(element),
			templateName = $element.data('lib_layout-template');
		app.log('Layout rendering template...', [templateName, $element.get(0)]);

		$element.attr('data-lib_layout-rendered', true);

		return require(['txt!templates/' + templateName + '.html'], function (content) {
			var $content = $($.parseHTML(content.trim()));
			html($element, $content);
			return _.isFunction(callback) && callback(null, $content);
		});
	}


	function render(element, callback) {
		var $element = $(element).length && $(element) || app.$root;
		async.each(
			$element.find('.lib_layout[data-lib_layout-template]:not([data-lib_layout-rendered])'),
			renderTemplate,
			callback
		);
	}


	function renderBlock(blockName, content, callback) {
		var $content = _.isString(content) ? $($.parseHTML(content.trim())) : $(content);
		html(app.$root.find('.lib_layout[data-lib_layout-block="' + blockName + '"]'), $content);
		return _.isFunction(callback) && callback(null, $content);
	}


	function contentRenderer(callback) {
		return function (template) {
			return renderBlock('content', template, callback);
		};
	}


	function change($element) {
		app.log('Layout Changed', [$element.get(0)]);
		$element.trigger('lib/layout:changed');
		triggerRenderingDone($element);
		return render($element);
	}


	/**
	 * Set the HTML, then trigger the changed event on the new children element(s)
	 * @param element
	 * @param contents
	 */
	function html(element, contents) {

		var $element = $(element).html(contents),
			$children = $element.children();

		return _.each($children, function (child) {
			var $child = $(child);
			return change($child);
		});
	}

	/**
	 * Append the child to the parent, and trigger the changed event on the new child
	 * @param parent
	 * @param child
	 */
	function append(parent, child) {

		var $child = $(child);
		$child.appendTo(parent);

		return change($child);
	}

	/**
	 * Prepend the child to the parent, and trigger the changed event on the new child
	 * @param parent
	 * @param child
	 */
	function prepend(parent, child) {

		var $child = $(child);
		$child.prependTo(parent);

		return change($child);
	}


	return {
		render: render,
		renderBlock: renderBlock,
		contentRenderer: contentRenderer,
		html: html,
		append: append,
		prepend: prepend
	};

});
