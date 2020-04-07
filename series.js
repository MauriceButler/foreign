function series(fn, items, callback) {
    if (!items || typeof items !== 'object') {
        throw new Error('Items must be an object or an array');
    }

    const keys = Object.keys(items);
    const isArray = Array.isArray(items);
    const length = isArray ? items.length : keys.length;
    const finalResult = new items.constructor();

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
                return callback(error);
            }

            finalResult[key] = args.length > 2 ? args.slice(1) : result;

            if (index === length) {
                return callback(null, finalResult);
            }

            setImmediate(() => next(index));
        });
    }

    next(0);
}

module.exports = series;
