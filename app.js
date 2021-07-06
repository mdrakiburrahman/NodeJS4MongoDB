var MongoClient = require("mongodb").MongoClient;
var assert = require("assert");
var ObjectId = require("mongodb").ObjectID;
var url =
  "mongodb://aiacosmosmongodemo:HeWhZk3uUouDjaz6IjcQkNJdlxoC2mGZY45I1A9J8LPXtZbEKxEcWcAqLmqAhcObHRXkW9FTTb5CXrReHhYJBg==@aiacosmosmongodemo.mongo.cosmos.azure.com:10255/?ssl=true";

// Insert a sample document into the database
var insertDocument = function (db, callback) {
  db.collection("families").insertOne(
    {
      id: "AndersenFamily",
      lastName: "Andersen",
      parents: [{ firstName: "Thomas" }, { firstName: "Mary Kay" }],
      children: [{ firstName: "John", gender: "male", grade: 7 }],
      pets: [{ givenName: "Fluffy" }],
      address: { country: "USA", state: "WA", city: "Seattle" },
    },
    function (err, result) {
      assert.strictEqual(err, null);
      console.log("↩️ Inserted a document into the families collection.");
      callback();
    }
  );
};

// Find the document from the database
var findFamilies = function (db, callback) {
  var cursor = db.collection("families").find();
  cursor.each(function (err, doc) {
    assert.strictEqual(err, null);
    if (doc != null) {
      console.log("🔍 Here is the document:");
      console.dir(doc);
    } else {
      callback();
    }
  });
};

// Update the document in the database, add a new Pet
var updateFamilies = function (db, callback) {
  db.collection("families").updateOne(
    { lastName: "Andersen" },
    {
      $set: { pets: [{ givenName: "Fluffy" }, { givenName: "Rocky" }] },
      $currentDate: { lastModified: true },
    },
    function (err, results) {
      console.log("🐶 We've added a pet!");
      console.log(results);
      callback();
    }
  );
};

// Remove the document from the database
var removeFamilies = function (db, callback) {
  db.collection("families").deleteMany(
    { lastName: "Andersen" },
    function (err, results) {
      console.log("🗑️ Cleaning up.");
      console.log(results);
      callback();
    }
  );
};

// Connect to the database and execute
MongoClient.connect(url, function (err, client) {
  assert.strictEqual(null, err);
  var db = client.db("familiesdb");
  insertDocument(db, function () {
    findFamilies(db, function () {
      updateFamilies(db, function () {
        removeFamilies(db, function () {
          client.close();
        });
      });
    });
  });
});
