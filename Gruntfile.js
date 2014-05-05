'use strict';

module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		mocha_phantomjs: {
			options: {
				reporter: 'tap'
			},
			all: ['test/**/*.html']
		},
		jshint: {
			options: {
			},
			lib: {
				src: ['js/**/*.js'],
				options: {
					jshintrc: 'js/.jshintrc'
				}
			},
			test: {
				src: ['test/**/*.js'],
				options: {
					jshintrc: 'test/.jshintrc'
				}
			}
		},
		watch: {
			browser: {
				files: ['js/**/*.js'],
				tasks: ['jshint:lib']
			}
		},
		'bower-install-simple': {
			options: {
			}
		}
	});

	grunt.loadNpmTasks('grunt-mocha-phantomjs');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-bower-install-simple');

	grunt.registerTask('install', ['bower-install-simple']);
	grunt.registerTask('test', ['jshint', 'mocha_phantomjs']);
	grunt.registerTask('default', ['install', 'test']);
};
