async function seriesPromise(fn, items) {
    const results = [];

    for (let i = 0; i < items.length; i++) {
        let result;
        const item = items[i];

        try {
            result = await fn(item);
        } catch (error) {
            return Promise.reject(error);
        }

        results.push(result);
    }

    return results;
}

module.exports = seriesPromise;
