/* eslint-disable no-sparse-arrays */
const test = require('tape');
const foreign = require('..');

let majigger = 0;

function processItems(item, callback) {
    if (item === undefined) {
        throw new Error('item is undefined');
    }

    if (item !== 3) {
        return callback(null, majigger++);
    }

    setTimeout(() => callback(null, majigger++), 500);
}

test('parallel with array', (t) => {
    t.plan(2);

    foreign.parallel(processItems, [1, 2, 3, 4], (error, results) => {
        t.notOk(error, 'no error');
        t.ok(
            results[0] < results[1] && results[1] < results[2] && results[3] < results[2],
            'Correct order of completion',
        );
    });
});

test('parallel handles empty array', (t) => {
    t.plan(2);

    foreign.parallel(processItems, [], (error, results) => {
        t.notOk(error, 'no error');
        t.deepEqual(results, [], 'Handles empty array');
    });
});

test('parallel with object', (t) => {
    t.plan(2);

    foreign.parallel(
        processItems,
        {
            foo: 1,
            bar: 2,
            meh: 3,
            stuff: 4,
        },
        (error, results) => {
            t.notOk(error, 'no error');
            t.ok(
                results.foo < results.bar && results.bar < results.meh && results.stuff < results.meh,
                'Correct order of completion',
            );
        },
    );
});

test('parallel handles object with no keys', (t) => {
    t.plan(2);

    foreign.parallel(processItems, {}, (error, results) => {
        t.notOk(error, 'no error');
        t.deepEqual(results, {}, 'Handles object with no keys');
    });
});

test('series with array', (t) => {
    t.plan(2);

    foreign.series(processItems, [1, 2, 3, 4], (error, results) => {
        t.notOk(error, 'no error');
        t.ok(
            results[0] < results[1] && results[1] < results[2] && results[2] < results[3],
            'Correct order of completion',
        );
    });
});

test('series handles empty array', (t) => {
    t.plan(2);

    foreign.series(processItems, [], (error, results) => {
        t.notOk(error, 'no error');
        t.deepEqual(results, [], 'Handles empty array');
    });
});

test('series with object', (t) => {
    t.plan(2);

    foreign.series(
        processItems,
        {
            foo: 1,
            bar: 2,
            meh: 3,
            stuff: 4,
        },
        (error, results) => {
            t.notOk(error, 'no error');
            t.ok(
                results.foo < results.bar && results.bar < results.meh && results.meh < results.stuff,
                'Correct order of completion',
            );
        },
    );
});

test('series handles object with no keys', (t) => {
    t.plan(2);

    foreign.series(processItems, {}, (error, results) => {
        t.notOk(error, 'no error');
        t.deepEqual(results, {}, 'Handles object with no keys');
    });
});

test('parallel with array with extra keys', (t) => {
    t.plan(2);

    const items = [1, 2, 3, 4];

    items.foo = 'bar';

    foreign.parallel(processItems, items, (error, results) => {
        t.notOk(error, 'no error');
        t.ok(results.length === 4, 'Correct number of results');
    });
});

test('series with array with extra keys', (t) => {
    t.plan(2);

    const items = [1, 2, 3, 4];

    items.foo = 'bar';

    foreign.parallel(processItems, items, (error, results) => {
        t.notOk(error, 'no error');
        t.ok(results.length === 4, 'Correct number of results');
    });
});

test('parallel error on last item wont callback twice', (t) => {
    t.plan(2);

    const items = [1, 2, 3, 4];

    foreign.parallel(
        (item, callback) => {
            if (item === 4) {
                return callback('BANG');
            }

            callback(null, item);
        },
        items,
        (error, results) => {
            t.equal(error, 'BANG', 'correct error');
            t.notOk(results, 'no results');
        },
    );
});

test('handels additional arguments', (t) => {
    t.plan(2);

    foreign.series(
        (item, callback) => {
            callback(null, item, 'foo');
        },
        [1, 2, 3],
        (error, results) => {
            t.notOk(error, 'no error');
            t.deepEqual(
                results,
                [
                    [1, 'foo'],
                    [2, 'foo'],
                    [3, 'foo'],
                ],
                'correct result',
            );
        },
    );
});

test('series with massive stack', (t) => {
    t.plan(2);

    const data = [];

    for (let i = 0; i < 50000; i++) {
        data.push(i);
    }

    foreign.series(
        (item, callback) => {
            callback(null, item);
        },
        data,
        (error, result) => {
            t.notOk(error, 'no error');
            t.equal(50000, result.length, 'didnt explode');
        },
    );
});

test('seriesAll with array', (t) => {
    t.plan(2);

    foreign.seriesAll(processItems, [1, 2, 3, 4], (error, results) => {
        t.notOk(error, 'no error');
        t.ok(
            results[0] < results[1] && results[1] < results[2] && results[2] < results[3],
            'Correct order of completion',
        );
    });
});

test('seriesAll handles empty array', (t) => {
    t.plan(2);

    foreign.seriesAll(processItems, [], (error, results) => {
        t.notOk(error, 'no error');
        t.deepEqual(results, [], 'Handles empty array');
    });
});

test('seriesAll with object', (t) => {
    t.plan(2);

    foreign.seriesAll(
        processItems,
        {
            foo: 1,
            bar: 2,
            meh: 3,
            stuff: 4,
        },
        (error, results) => {
            t.notOk(error, 'no error');
            t.ok(
                results.foo < results.bar && results.bar < results.meh && results.meh < results.stuff,
                'Correct order of completion',
            );
        },
    );
});

test('seriesAll handles object with no keys', (t) => {
    t.plan(2);

    foreign.seriesAll(processItems, {}, (error, results) => {
        t.notOk(error, 'no error');
        t.deepEqual(results, {}, 'Handles object with no keys');
    });
});

test('handles additional arguments', (t) => {
    t.plan(2);

    foreign.seriesAll(
        (item, callback) => {
            callback(null, item, 'foo');
        },
        [1, 2, 3],
        (error, results) => {
            t.notOk(error, 'no error');
            t.deepEqual(
                results,
                [
                    [1, 'foo'],
                    [2, 'foo'],
                    [3, 'foo'],
                ],
                'correct result',
            );
        },
    );
});

test('seriesAll with massive stack', (t) => {
    t.plan(2);

    const data = [];

    for (let i = 0; i < 50000; i++) {
        data.push(i);
    }

    foreign.seriesAll(
        (item, callback) => {
            callback(null, item);
        },
        data,
        (error, result) => {
            t.notOk(error, 'no error');
            t.equal(50000, result.length, 'didnt explode');
        },
    );
});

test('seriesAll with errors will run all items', (t) => {
    t.plan(3);

    foreign.seriesAll(
        (item, callback) => {
            if (item % 2 === 0) {
                return callback(item);
            }
            if (item % 3 === 0) {
                return callback(null, item, 'hi');
            }
            return callback(null, item);
        },
        [1, 2, 3, 4],
        (error, results) => {
            t.equal(error.length, 4, 'ok error length');
            t.deepEqual(error, [, 2, , 4], 'no error');
            t.deepEqual(results, [1, , [3, 'hi']], 'Handles object with no keys');
        },
    );
});

test('seriesPromise runs in order', async (t) => {
    t.plan(1);

    const result = await foreign.seriesPromise(
        (item) => {
            if (item % 2 === 0) {
                return new Promise((resolve) => setTimeout(() => resolve(item), 10));
            }
            if (item % 3 === 0) {
                return new Promise((resolve) => setTimeout(() => resolve(item), 50));
            }
            return new Promise((resolve) => setTimeout(() => resolve(item), 30));
        },
        [1, 2, 3, 4],
    );

    t.deepEqual(result, [1, 2, 3, 4], 'results in order');
});

test('seriesPromise stops on error', async (t) => {
    t.plan(2);
    let error;

    try {
        await foreign.seriesPromise(
            (item) => {
                if (item % 2 === 0) {
                    return new Promise((resolve) => setTimeout(() => resolve(item), 10));
                }
                if (item % 3 === 0) {
                    return new Promise((resolve, reject) => setTimeout(() => reject(new Error(`${item} was bad`)), 50));
                }
                return new Promise((resolve) => setTimeout(() => resolve(item), 30));
            },
            [1, 2, 3, 4],
        );
    } catch (exception) {
        error = exception;
    }

    t.ok(error instanceof Error, 'is an error');
    t.equal(error.message, '3 was bad', 'correct error message');
});
