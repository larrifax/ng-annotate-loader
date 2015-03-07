var ngAnnotate = require("ng-annotate");
var loaderUtils = require("loader-utils");

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

module.exports = function (content, map) {
    var callback = this.async();
    this.cacheable && this.cacheable();

    var query = loaderUtils.parseQuery(this.query);
    var options = isEmpty(query) ? { add: true } : query;
    var result = ngAnnotate(content, options);

    if (result.errors) {
        result.errors.forEach(function(error) {
            this.emitError(error);
        });
    }

    callback(null, result.src, map);
}
