function parallel(fn, items, callback) {
    if (!items || typeof items !== 'object') {
        throw new Error('Items must be an object or an array');
    }

    var keys = Object.keys(items);
    var isArray = Array.isArray(items);
    var length = isArray ? items.length : keys.length;
    var finalResult = new items.constructor();
    var done = 0;
    var errored;

    if (length === 0) {
        return callback(null, finalResult);
    }

    function isDone(key) {
        return function (error, result) {
            if (errored) {
                return;
            }

            if (error) {
                errored = true;
                return callback(error);
            }

            finalResult[key] = arguments.length > 2 ? Array.prototype.slice.call(arguments, 1) : result;

            if (++done === length) {
                callback(null, finalResult);
            }
        };
    }

    for (var i = 0; i < length; i++) {
        var key = keys[i];
        if (isArray && isNaN(key)) {
            continue;
        }

        fn(items[key], isDone(key));
    }
}

function series(fn, items, callback) {
    if (!items || typeof items !== 'object') {
        throw new Error('Items must be an object or an array');
    }

    var keys = Object.keys(items);
    var isArray = Array.isArray(items);
    var length = isArray ? items.length : keys.length;
    var finalResult = new items.constructor();

    if (length === 0) {
        return callback(null, finalResult);
    }

    function next(index) {
        var key = keys[index];

        index++;

        if (isArray && isNaN(key)) {
            return next(index);
        }

        fn(items[key], function (error, result) {
            if (error) {
                return callback(error);
            }

            finalResult[key] = arguments.length > 2 ? Array.prototype.slice.call(arguments, 1) : result;

            if (index === length) {
                return callback(null, finalResult);
            }

            setImmediate(() => next(index));
        });
    }

    next(0);
}

function seriesAll(fn, items, callback) {
    if (!items || typeof items !== 'object') {
        throw new Error('Items must be an object or an array');
    }

    var keys = Object.keys(items);
    var isArray = Array.isArray(items);
    var length = isArray ? items.length : keys.length;
    var finalResult = new items.constructor();
    var errors = new items.constructor();
    var hasErrored = false;

    if (length === 0) {
        return callback(null, finalResult);
    }

    function next(index) {
        var key = keys[index];

        index++;

        if (isArray && isNaN(key)) {
            return next(index);
        }

        fn(items[key], function (error, result) {
            if (error) {
                hasErrored = true;
                errors[key] = error;
            } else {
                finalResult[key] = arguments.length > 2 ? Array.prototype.slice.call(arguments, 1) : result;
            }

            if (index === length) {
                return callback(hasErrored ? errors : null, finalResult);
            }

            setImmediate(() => next(index));
        });
    }

    next(0);
}

module.exports = {
    parallel,
    series,
    seriesAll,
};
