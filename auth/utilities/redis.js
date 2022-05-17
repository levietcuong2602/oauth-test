const redis = require('redis');
const bluebird = require('bluebird');

const { REDIS_URI } = require('../config');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const client = redis.createClient({
  url: REDIS_URI,
});

client.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error('REDIS_ERROR: ', err);
});

const publisher = redis.createClient({
  url: REDIS_URI,
});

const subscriber = redis.createClient({
  url: REDIS_URI,
});

module.exports = { client, publisher, subscriber };
