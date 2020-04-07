function seriesAll(fn, items, callback) {
    if (!items || typeof items !== 'object') {
        throw new Error('Items must be an object or an array');
    }

    const keys = Object.keys(items);
    const isArray = Array.isArray(items);
    const length = isArray ? items.length : keys.length;
    const finalResult = new items.constructor();
    const errors = new items.constructor();
    let hasErrored = false;

    if (length === 0) {
        return callback(null, finalResult);
    }

    function next(index) {
        const key = keys[index];

        index++;

        if (isArray && isNaN(key)) {
            return next(index);
        }

        fn(items[key], (...args) => {
            const [error, result] = args;

            if (error) {
                hasErrored = true;
                errors[key] = error;
            } else {
                finalResult[key] = args.length > 2 ? args.slice(1) : result;
            }

            if (index === length) {
                return callback(hasErrored ? errors : null, finalResult);
            }

            setImmediate(() => next(index));
        });
    }

    next(0);
}

module.exports = seriesAll;
