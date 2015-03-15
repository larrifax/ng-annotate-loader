var ngAnnotate = require("ng-annotate");
var loaderUtils = require("loader-utils");
var SourceMapConsumer = require("source-map").SourceMapConsumer;
var SourceMapGenerator = require("source-map").SourceMapGenerator;

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

function getOptions() {
    var defaults = { add: true };
    var query = loaderUtils.parseQuery(this.query);
    var options = isEmpty(query) ? defaults : query;

    if (this.sourceMap && options.sourcemap === undefined) {
        options.sourcemap = { inline: false, inFile: this.resourcePath };
    }

    return options;
}

module.exports = function (content, map) {
    var that = this;
    var callback = this.async();
    this.cacheable && this.cacheable();

    var options = getOptions.bind(this)();
    var result = ngAnnotate(content, options);

    if (result.errors) {
        result.errors.forEach(function(error) {
            that.emitError(error);
        });
    }

    if (this.sourceMap) {
        var originalSourcemap = new SourceMapConsumer(map);
        var annotatedSourcemap = new SourceMapConsumer(result.map);
        var resultingSourcemap = SourceMapGenerator.fromSourceMap(annotatedSourcemap);
        resultingSourcemap.applySourceMap(originalSourcemap, this.resourcePath);
    }

    callback(null, result.src, resultingSourcemap === undefined ? map : resultingSourcemap.toJSON());
}