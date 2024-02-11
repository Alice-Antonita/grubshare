const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    organiser: {
        type: String,
        required: true
    },
    ename: {
        type: String,
        required: true
    },
    edate: {
        type: String,
        required: true
    },
    etime: {
        type: String,
        required: true
    },
    elocation: {
        type: String,
        required: true
    },
    edesc: {
        type: String,
        required: true
    },
    eimage: {
        type: String,
        required: true
    }
});

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;
