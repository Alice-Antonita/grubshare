const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    organiser: {
        type: String,
        required: false
    },
    ename: {
        type: String,
        required: false
    },
    edate: {
        type: String,
        required: false
    },
    etime: {
        type: String,
        required: false
    },
    elocation: {
        type: String,
        required: false
    },
    edesc: {
        type: String,
        required: false
    },
    eimage: {
        type: Buffer,
        required: false
    }
});

const eventCollection = new mongoose.model("events", EventSchema);

module.exports = eventCollection;