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


	function onChanged(event) {
		var $context = $(event.target);
		triggerRenderingDone($context);
		app.log('Layout Changed', [$context.get(0)]);
		return render($context);
	}

	function html(element, contents) {
		// set the HTML, then trigger the changed event on the new children element(s)
		$(element).html(contents).children().trigger('lib/layout:changed');
	}

	function append(parent, child) {
		// append the child to the parent, and trigger the changed event on the new child
		$(child).appendTo(parent).trigger('lib/layout:changed');
	}

	function prepend(parent, child) {
		// prepend the child to the parent, and trigger the changed event on the new child
		$(child).prependTo(parent).trigger('lib/layout:changed');
	}

	app
		.on('lib/layout:changed', null, onChanged)
	;


	return {
		render: render,
		renderBlock: renderBlock,
		contentRenderer: contentRenderer,
		html: html,
		append: append,
		prepend: prepend
	};

});
