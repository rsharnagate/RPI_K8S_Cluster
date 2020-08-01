const NodeCache = require( "node-cache" );
const myCache = new NodeCache();

const Cache = {
    store(key, obj) {
        return myCache.set(key, obj, 0);
    },

    exists(key) {
        return myCache.has(key);
    },

    read(key) {
        if (myCache.has(key)) {
            return myCache.get(key);
        } else {
            return null;
        }        
    },

    delete(key) {
        myCache.del(key);
    },

    flush() {
        myCache.flushAll();
    }
};

myCache.on( "set", function( key, value ) {
    console.log(`Cached ${key}`);
});

myCache.on( "del", function( key, value ) {
    console.log(`Deleted ${key}`);
});

myCache.on( "expired", function( key, value ) {
    console.log(`Expired ${key}`);
});

myCache.on( "flush", function() {
    console.log(`Cache flushed`);
});

module.exports = Cache;