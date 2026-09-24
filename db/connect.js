const dns = require('node:dns');
dns.setServers(['1.1.1.1', '8.8.8.8']);

const { MongoClient } = require('mongodb');

let _db;

const initDb = async () => {
  if (_db) {
    console.log('Db is already initialized!');
    return _db;
  }
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  _db = client.db(process.env.DB_NAME || 'apartmentTrackerDB');
  return _db;
};

const getDb = () => {
  if (!_db) {
    throw new Error('Db not initialized');
  }
  return _db;
};

module.exports = { initDb, getDb };