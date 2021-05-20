async function seriesPromise(fn, items) {
    const keys = Object.keys(items);
    const isArray = Array.isArray(items);
    const length = isArray ? items.length : keys.length;
    const finalResult = new items.constructor();

    for (let i = 0; i < length; i++) {
        const key = keys[i];

        if (isArray && isNaN(key)) {
            continue;
        }

        finalResult[keys[i]] = await fn(items[key]);
    }

    return finalResult;
}

module.exports = seriesPromise;
