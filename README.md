# foreign

Asnyc map that actualy works. Parallel, Series, Sync and Async

## Usage

```javascript
const foreign = require('foreign');
```

### Parallel

```javascript
const items = [1, 2, 3];

foreign.parallel(
    (item, callback) => {
        somethingAsync(item, callback);
    },
    items,
    (error, result) => {},
);
```

### Series

```javascript
const items = [1, 2, 3];

foreign.series(
    (item, callback) => {
        somethingAsync(item, callback);
    },
    items,
    (error, result) => {},
);
```

### SeriesPromise

```javascript
const items = [1, 2, 3];

const result = foreign.series(async (item) => someAsyncFunction(item), items);
```

### SeriesAll

```javascript
const items = [1, 2, 3];

foreign.seriesAll(
    (item, callback) => {
        somethingAsync(item, callback);
    },
    items,
    (error, result) => {
        // 'error' will always be a either array or object of errors
        // 'result' will always be a either array or object of results
        // depending on the type `items` is.
        //
        // NOTE: `error.length` is not a reliable indicator of number of errors
        //
        // All items will be processed in order even if
        // some return errors. `foreign.series` and `foreign.seriesPromise` will return
        // on first error

        // example error checking:
        if (error) {
            const itemsThatFailed = Object.keys(error);
        }
    },
);
```

### Multiple return values

```javascript
const items = [1, 2, 3];

foreign.series(
    (item, callback) => {
        callback(null, item, 'foo');
    },
    items,
    (error, results) => {
        console.log(results); // [[1, 'foo'], [2, 'foo'], [3, 'foo']]
    },
);
```
