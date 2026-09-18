const dns = require('node:dns');
const util = require('node:util');
dns.setServers(['1.1.1.1', '8.8.8.8']);

const dnsPromises = dns.promises;
const originalLookup = dns.lookup;

async function resolveHostname(hostname) {
  try {
    const addresses = await dnsPromises.resolve4(hostname);
    if (addresses.length > 0) return { address: addresses[0], family: 4 };
  } catch {
    // fall through to IPv6
  }
  try {
    const addresses = await dnsPromises.resolve6(hostname);
    if (addresses.length > 0) return { address: addresses[0], family: 6 };
  } catch {
    // fall through to the original OS lookup
  }
  return util.promisify(originalLookup)(hostname);
}

function customLookup(hostname, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  resolveHostname(hostname)
    .then(({ address, family }) => callback(null, address, family))
    .catch((err) => callback(err));
}
customLookup[util.promisify.custom] = resolveHostname;

dns.lookup = customLookup;

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