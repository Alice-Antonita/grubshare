const express = require("express");
const pasth = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config");
let app = express();
let port = process.env.port || 3000;

app.use(express.json());

app.use(express.static(__dirname + '/'));

app.use(express.urlencoded({extended: false}));

app.get('/', (req, res)=>{
    res.render('index.html');
});

app.get("/views/newslogin.html", (req,res) => {
    res.render("http://localhost:3000/views/newlogin.html");
});

app.get("/views/newsignup.html", (req,res) => {
    res.render("http://localhost:3000/views/newsignup.html");
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
    const existingUser = await collection.findOne({email: data.email});

    if(existingUser){
        res.send("User already exists. Please choose a different username");
    }
    else{
        //hash the password
        const saltRounds = 10; //number of salt round for bcrypt
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        //Replace the hash password with original password
        data.password = hashedPassword; 
        
        const userdata = await collection.insertMany(data);
        console.log(userdata);
    }
    
});

//Login user
app.post("/views/newlogin.html", async (req,res) =>{
    try{
         
        const check = await collection.findOne({email: req.body.log_email});        
        if(!check){
            return res.send("user name cannot be found");
        }
        //compare hashed password from database with the plain text
        const isPasswordMatch = await bcrypt.compare(req.body.log_password, check.password);
        
        if(isPasswordMatch){
            res.redirect("http://localhost:3000/views/nindex.html");
        }else {
            return res.send("wrong password");
        }
    }catch{
        return res.send("wrong Details");
    }
});

app.listen(port, ()=>{
    console.log('server started - 2');
});