const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url =  'mongodb://localhost:27017/test';

export function start() {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    global.test = {};
    global.test.db = db;
    console.log("Connected correctly to Mongo");
  });
}
