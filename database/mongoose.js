/*
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://Nespire:damianos12@cluster0.mmmzg.mongodb.net/fluenceerp?retryWrites=true&w=majority', { useNewUrlParser: true}).then(() => {
  console.log('Connected to MongoDB')
}).catch((e) => {
  console.log('MongoDB Error');
  console.log(e);
});

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

module.exports = { mongoose }

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://Nespire:<password>@cluster0.mmmzg.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
*/

const MongoClient = require("mongodb").MongoClient;

const dbConnectionUrl = "mongodb+srv://Nespire:damianos12@cluster0.mmmzg.mongodb.net/fluenceerp?retryWrites=true&w=majority";

function initialize(
    dbName,
    dbCollectionName,
    successCallback,
    failureCallback
) {
    MongoClient.connect(dbConnectionUrl, function(err, dbInstance) {
        if (err) {
            console.log(`[MongoDB connection] ERROR: ${err}`);
            failureCallback(err); // this should be "caught" by the calling function
        } else {
            const dbObject = dbInstance.db(dbName);
            const dbCollection = dbObject.collection(dbCollectionName);
            console.log("[MongoDB connection] SUCCESS");

            successCallback(dbCollection);
        }
    });
}

module.exports = {
    initialize
};