function parallel(fn, items, callback) {
    if (!items || typeof items !== 'object') {
        throw new Error('Items must be an object or an array');
    }

    const keys = Object.keys(items);
    const isArray = Array.isArray(items);
    const length = isArray ? items.length : keys.length;
    const finalResult = new items.constructor();
    let done = 0;
    let errored;

    if (length === 0) {
        return callback(null, finalResult);
    }

    function isDone(key) {
        return (...args) => {
            const [error, result] = args;
            if (errored) {
                return;
            }

            if (error) {
                errored = true;
                return callback(error);
            }

            finalResult[key] = args.length > 2 ? args.slice(1) : result;

            if (++done === length) {
                callback(null, finalResult);
            }
        };
    }

    for (let i = 0; i < length; i++) {
        const key = keys[i];
        if (isArray && isNaN(key)) {
            continue;
        }

        fn(items[key], isDone(key));
    }
}

module.exports = parallel;
