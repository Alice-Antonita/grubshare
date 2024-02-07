let client = require('../dbConnection');

let collection = client.db().collection('events');

function postEvent(event, callback) {
    collection.insertOne(event,callback);
}

// function getAllCats(callback) {
//     collection.find({}).toArray(callback);
// }

module.exports = postEvent;