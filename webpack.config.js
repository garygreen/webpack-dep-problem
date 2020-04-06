const path = require('path');

/**
 * Manually list dependencies here to automatically rebuild if any of these files change.
 * This is useful for files in the chain that webpack isn't aware of.
 */
const addDepPaths = [
	'some_external_dep_webpack_doesnt_know_about_due_to_external_tooling.js'
];

module.exports = {
	entry: {
		site: './test.js'
	},

	output: {
		path: __dirname + '/test',
		filename: 'js/[name]-[contenthash].js'
	},

	mode: 'development',

	plugins: [{
		apply: function(compiler) {
			compiler.hooks.compilation.tap('add-deps:compilation', function(compilation) {
				addDepPaths.forEach(function(depPath) {
					compilation.compilationDependencies.add(path.join(compiler.context, depPath));
				});
			});

			compiler.hooks.afterEmit.tap('add-deps:afterEmit', function(compilation) {
				addDepPaths.forEach(function(depPath) {
					compilation.fileDependencies.add(path.join(compiler.context, depPath));
				});
			});

			compiler.hooks.afterEmit.tap('add-deps-using-contextDependencies:afterEmit', function(compilation) {
				addDepPaths.forEach(function(depPath) {
					compilation.contextDependencies.add(path.join(compiler.context));
				});
			});
		}
	}]

};