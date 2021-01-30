import { Db, Collection } from 'mongodb';

var dbConnection: Function = require('./mongoConnections')

const getCollectionFn = (collection: string) => {
    var _col: Collection = undefined;

    return async () => {
        if (!_col) {
            var db: Db = await dbConnection();
            _col = await db.collection(collection);
        }
        return _col;
    };
};

module.exports = {
    movies: getCollectionFn('movies')
};
