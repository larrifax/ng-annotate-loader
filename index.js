var ngAnnotate = require("ng-annotate");
var loaderUtils = require("loader-utils");

module.exports = function (content, map) {
    var callback = this.async();
    this.cacheable && this.cacheable();

    var options = loaderUtils.parseQuery(this.query) || { add: true };
    var result = ngAnnotate(content, options);

    if (result.errors) {
        result.errors.forEach(function(error) {
            this.emitError(error);
        });
    }

    callback(null, result.src, map);
}
