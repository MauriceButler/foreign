var test = require('tape'),
    foreign = require('../'),
    majigger = 0;


function processItems(item, callback){
    if(item !== 3){
        return callback(null, majigger++);
    }

    setTimeout(function(){
        callback(null, majigger++);
    }, 500);
}


test('parallel with array', function(t){
    t.plan(2);

    foreign.parallel(
        processItems,
        [1,2,3,4],
        function(error, results){
            t.notOk(error, 'no error');
            t.ok(results[0] < results[1] && results[1] < results[2] && results[3] < results[2], 'Correct order of completion');
        }
    );
});

test('parallel handles empty array', function(t){
    t.plan(2);

    foreign.parallel(
        processItems,
        [],
        function(error, results){
            t.notOk(error, 'no error');
            t.deepEqual(results, [], 'Handles empty array');
        }
    );
});

test('parallel with object', function(t){
    t.plan(2);

    foreign.parallel(
        processItems,
        {
            foo: 1,
            bar: 2,
            meh: 3,
            stuff:4
        },
        function(error, results){
            t.notOk(error, 'no error');
            t.ok(results.foo < results.bar && results.bar < results.meh && results.stuff < results.meh, 'Correct order of completion');
        }
    );
});

test('parallel handles object with no keys', function(t){
    t.plan(2);

    foreign.parallel(
        processItems,
        {},
        function(error, results){
            t.notOk(error, 'no error');
            t.deepEqual(results, {}, 'Handles object with no keys');
        }
    );
});

test('series with array', function(t){
    t.plan(2);

    foreign.series(
        processItems,
        [1,2,3,4],
        function(error, results){
            t.notOk(error, 'no error');
            t.ok(results[0] < results[1] && results[1] < results[2] && results[2] < results[3], 'Correct order of completion');
        }
    );
});

test('series handles empty array', function(t){
    t.plan(2);

    foreign.series(
        processItems,
        [],
        function(error, results){
            t.notOk(error, 'no error');
            t.deepEqual(results, [], 'Handles empty array');
        }
    );
});

test('series with object', function(t){
    t.plan(2);

    foreign.series(
        processItems,
        {
            foo: 1,
            bar: 2,
            meh: 3,
            stuff:4
        },
        function(error, results){
            t.notOk(error, 'no error');
            t.ok(results.foo < results.bar && results.bar < results.meh && results.meh < results.stuff, 'Correct order of completion');
        }
    );
});

test('series handles object with no keys', function(t){
    t.plan(2);

    foreign.series(
        processItems,
        {},
        function(error, results){
            t.notOk(error, 'no error');
            t.deepEqual(results, {}, 'Handles object with no keys');
        }
    );
});

test('parallel with array with extra keys', function(t){
    t.plan(2);

    var items = [1,2,3,4];

    items.foo = 'bar';

    foreign.parallel(
        processItems,
        items,
        function(error, results){
            t.notOk(error, 'no error');
            t.ok(results.length === 4, 'Correct number of results');
        }
    );
});

test('series with array with extra keys', function(t){
    t.plan(2);

    var items = [1,2,3,4];

    items.foo = 'bar';

    foreign.parallel(
        processItems,
        items,
        function(error, results){
            t.notOk(error, 'no error');
            t.ok(results.length === 4, 'Correct number of results');
        }
    );
});

test('parallel error on last item wont callback twice', function(t){
    t.plan(2);

    var items = [1,2,3,4];

    foreign.parallel(
        function(item, callback){
            if(item === 4){
                return callback('BANG');
            }

            callback(null, item);
        },
        items,
        function(error, results){
            t.equal(error, 'BANG', 'correct error');
            t.notOk(results, 'no results');
        }
    );
});

test('handels additional arguments', function(t){
    t.plan(2);

    foreign.series(
        function(item, callback){
            callback(null, item, 'foo');
        },
        [1,2,3],
        function(error, results){
            t.notOk(error, 'no error');
            t.deepEqual(results, [[1, 'foo'], [2, 'foo'], [3, 'foo']], 'correct result');
        }
    );
});