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

app.get("views/admin.html",(req, res) => {
    res.render('http://localhost:3000/views/admin.html', {username: req.session.username});
})

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

        // Retrieve all events from the database
        const events = await Event.find();

        // Render an HTML page with the retrieved event data
        res.render('admin-event.html', { events }); //
    } catch (error) {
        console.error("Error registering event:", error);
        res.status(500).json({ error: error.message });
    }
});

//Register user
app.post("/views/newsignup.html", async (req,res) =>{
    const data = {
        email: req.body.email,
        fullname: req.body.fullname,
        name: req.body.username,
        password: req.body.password,
        confpassword: req.body.confpassword
    }

    //check if user already exist
    const existingUser = await User.findOne({email: data.email});

    //if exists send a pop up message for the user
    if(existingUser){        
        res.send('<script>alert("User already exists. Please choose a different email id"); window.location.href = "http://localhost:3000/views/newsignup.html"; </script>');
    }
    else{
        //check length of password
        if (data.password.length < 6){
                return res.send('<script>alert("Password is too small"); window.location.href = "http://localhost:3000/views/newsignup.html"; </script>');  
        }
        
        //check whether password and confirm password are same
        if(data.password == data.confpassword){
            //hash the password
            const saltRounds = 10; //number of salt round for bcrypt
            const hashedPassword = await bcrypt.hash(data.password, saltRounds);
            const hashedConfPassword = await bcrypt.hash(data.confpassword, saltRounds);

            //Replace the hash password and confirm password with original passwords
            data.password = hashedPassword; 
            data.confpassword = hashedConfPassword; 

            const userdata = await User.insertMany(data);
            console.log(userdata);
            res.redirect("http://localhost:3000/views/newlogin.html");
        }
        else{
            return res.send('<script>alert("Passwords do not match"); window.location.href = "http://localhost:3000/views/newsignup.html"; </script>');   
        }   
    }        
});

//Login user
app.post("/views/newlogin.html", async (req,res) =>{
    try{
        //check if the email already exists in the database
        const check = await User.findOne({email: req.body.log_email});    
        //if exists it should add a pop up message    
        if(!check){
            return res.send('<script>alert("Email does not exist"); window.location.href = "http://localhost:3000/views/newlogin.html"; </script>');
        }
        //compare hashed password from database with the plain text
        const isPasswordMatch = await bcrypt.compare(req.body.log_password, check.password);
        
        if(isPasswordMatch){
            res.redirect("http://localhost:3000/views/admin.html");
        }else {
            res.send('<script>alert("Incorrect Password"); window.location.href = "http://localhost:3000/views/newlogin.html"; </script>');
        }
    }catch{
        return res.send("wrong Details");
    }
});

app.listen(PORT, () => {
    console.log('Server started');
});