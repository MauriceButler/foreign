# foreign
Asnyc map that actualy works. Parallel, series, cury

## Usage

```javascript

var foreign = require('foreign');

```

### Parallel


```javascript

var items = [1,2,3];

foreign.parallel(function(item, callback){
    somethingAsync(item, callback);
}, items, function(error, result){

});

```

### Series


```javascript

var items = [1,2,3];

foreign.series(function(item, callback){
    somethingAsync(item, callback);
}, items, function(error, result){

});

```