import { Db, MongoClient } from 'mongodb';

const settings = {
    mongoConfig: {
        serverUrl: 'mongodb://localhost:27017',
        database: 'Szemis-Stephen-CS554-Lab7'
    }
};
const mongoConfig = settings.mongoConfig;

var _connection: MongoClient = undefined;
var _db: Db = undefined;

module.exports = async () => {
    if (!_connection) {
        _connection = await MongoClient.connect(mongoConfig.serverUrl, {
            useUnifiedTopology: true
        });
        _db = await _connection.db(mongoConfig.database);
    }
    return _db;
};
