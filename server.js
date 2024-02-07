const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname + '/'));

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.render('index.html');
});

app.get("/views/newslogin.html", (req, res) => {
    res.render("http://localhost:3000/views/newlogin.html");
});

app.get("/views/newsignup.html", (req, res) => {
    res.render("http://localhost:3000/views/newsignup.html");
});

app.get("/views/add-event.html", (req, res) => {
    res.render("http://localhost:3000/views/add-event.html");
});

// MongoDB connection for Grubshare1 database
mongoose.connect('mongodb://localhost:27017/Grubshare1', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define Event Schema and Model
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

// Define User Schema and Model
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confpassword: {
        type: String,
        required: true
    }
});

const User = mongoose.model('User', UserSchema);

// Route for registering events
app.post("/views/add-event.html", async (req, res) => {
    try {
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

        res.status(201).json({ message: 'Event registered successfully' });
    } catch (error) {
        console.error("Error registering event:", error);
        res.status(500).json({ error: error.message });
    }
});

// Route for registering users
app.post("/views/newsignup.html", async (req, res) => {
    try {
        const userData = {
            email: req.body.email,
            fullname: req.body.fullname,
            name: req.body.username,
            password: req.body.password,
            confpassword: req.body.confpassword
        };

        const existingUser = await User.findOne({ email: userData.email });

        if (existingUser) {
            res.send("User already exists. Please choose a different username");
        } else {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
            userData.password = hashedPassword;
            const newUser = new User(userData);
            await newUser.save();
            res.status(201).json({ message: 'User registered successfully' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route for login
app.post("/views/newlogin.html", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.log_email });
        if (!user) {
            return res.send("Username cannot be found");
        }
        const isPasswordMatch = await bcrypt.compare(req.body.log_password, user.password);
        if (isPasswordMatch) {
            res.redirect("http://localhost:3000/index.html");
        } else {
            return res.send("Wrong password");
        }
    } catch (error) {
        return res.send("Wrong Details");
    }
});

app.listen(PORT, () => {
    console.log('Server started');
});
