# foreign

Asnyc map that actualy works. Parallel, series, cury

## Usage

```javascript

var foreign = require('foreign');

```

### Parallel


```javascript

var items = [1,2,3];

foreign.parallel(
    function(item, callback){
        somethingAsync(item, callback);
    },
    items,
    function(error, result){

    }
);

```

### Series


```javascript

var items = [1,2,3];

foreign.series(
    function(item, callback){
        somethingAsync(item, callback);
    },
    items,
    function(error, result){

    }
);

```

### SeriesAll

```javascript

var items = [1,2,3];

foreign.seriesAll(
    function(item, callback) {
        somethingAsync(item, callback);
    },
    items,
    function(error, result) {
        // 'error' will always be a either array or object of errors
        // 'result' will always be a either array or object of results
        // depending on the type `items` is.
        //
        // All items will be processed in order even if
        // some return errors. `foreign.series` will return
        // on first error
    }
);

```

### Multiple return values

```javascript

var items = [1,2,3];

    foreign.series(
        function(item, callback){
            callback(null, item, 'foo');
        },
        items,
        function(error, results){
            console.log(results); // [[1, 'foo'], [2, 'foo'], [3, 'foo']]
        }
    );

```
