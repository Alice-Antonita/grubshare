const express = require("express");
const pasth = require("path");
const bcrypt = require("bcrypt");//import bcrypt for hashing password
const collection = require("./config");

let app = express();
let port = process.env.port || 3000;

app.use(express.json());

app.use(express.static(__dirname + '/'));

app.use(express.urlencoded({extended: false}));

app.get('/', (req, res)=>{
    res.render('index.html');
});

//get login
app.get("/views/newslogin.html", (req,res) => {
    res.render("http://localhost:3000/views/newlogin.html");
});

//get signup
app.get("/views/newsignup.html", (req,res) => {
    res.render("http://localhost:3000/views/newsignup.html");
});


app.get("views/admin.html",(req, res) => {
    res.render('http://localhost:3000/views/admin.html', {username: req.session.username});
})

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
    const existingUser = await collection.findOne({email: data.email});

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

            const userdata = await collection.insertMany(data);
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
        const check = await collection.findOne({email: req.body.log_email});    
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

app.listen(port, ()=>{
    console.log('server started - 2');
});