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
			$element.html($content);
			app.trigger($content, 'lib/layout:changed');
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
		app.$root.find('.lib_layout[data-lib_layout-block="' + blockName + '"]').html($content);
		app.trigger($content, 'lib/layout:changed', [blockName]);
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


	app
		.on('lib/layout:changed', null, onChanged)
	;


	return {
		render: render,
		renderBlock: renderBlock,
		contentRenderer: contentRenderer
	};

});
