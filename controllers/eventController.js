const Event = require("../models/eventModel");

exports.addEvent = async (req, res) => {
    try{
    console.log("Received request body:", req.body);

        const eventData = {
            organiser: req.body.organiser,
            ename: req.body.ename,
            edate: req.body.edate,
            etime: req.body.etime,
            elocation: req.body.elocation,
            edesc: req.body.edesc,
            eimage: req.body.eimage
        };

        console.log("Creating event with data:", eventData);

        const newEvent = new Event(eventData);
        const savedEvent = await newEvent.save();
        console.log("Event saved:", savedEvent);
        return res.send('<script>alert("Regsiteration Successful"); window.location.href = "http://localhost:3000/views/admin-event.html"; </script>');   
    } catch (error) {
        console.error("Error registering event:", error);
        res.status(500).json({ error: error.message });
    }
};
