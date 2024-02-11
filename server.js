const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");

const eventController = require("./controllers/eventController");
const userController = require("./controllers/userController");

app.use(express.json());
app.use(express.static(__dirname + '/'));

app.use(express.urlencoded({ extended: false }));

// MongoDB connection for Grubshare1 database
mongoose.connect('mongodb://localhost:27017/Grubshare1', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Routes
app.get('/', (req, res) => {
    res.render('index.html');
});

app.post("/views/add-event.html", eventController.addEvent);
app.post("/views/newsignup.html", userController.signup);
app.post("/views/newlogin.html", userController.login);

app.listen(PORT, () => {
    console.log('Server started');
});
