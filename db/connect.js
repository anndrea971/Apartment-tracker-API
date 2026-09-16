const dns = require('node:dns');
dns.setServers(['1.1.1.1', '8.8.8.8']);

// setServers() above only affects dns.resolve()-family functions. The actual
// TCP connection (used internally by the MongoDB driver) calls dns.lookup(),
// which always asks the OS resolver and ignores setServers(). This override
// reroutes dns.lookup() through the resolver that does respect the custom
// servers, falling back to the normal OS lookup if that fails. Belt-and-
// suspenders: your Windows DNS settings should already handle this, but this
// keeps the project portable if you ever code from a different network.
const dnsPromises = dns.promises;
const originalLookup = dns.lookup;
dns.lookup = (hostname, options, callback) => {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  dnsPromises.resolve4(hostname)
    .then((addresses) => callback(null, addresses[0], 4))
    .catch(() => {
      dnsPromises.resolve6(hostname)
        .then((addresses) => callback(null, addresses[0], 6))
        .catch(() => originalLookup(hostname, options, callback));
    });
};

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
