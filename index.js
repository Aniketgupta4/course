// const express = require('express');
// const app = express();
// const userModel = require("./models/user.js");
// const bcrypt = require('bcrypt');
// const jwt = require("jsonwebtoken");

// const cookieParser = require('cookie-parser');
// const path = require('path');

// app.set("view engine","ejs");
// app.use(express.json());
// app.use(express.urlencoded({extended:true}));
// app.use(express.static(path.join(__dirname, "public")));
// app.use(cookieParser());

// app.get('/',function(req,res){
//     res.render('index');
// })

// app.post("/create",async (req,res)=>{
//     let {username,email,password,age} = req.body;
    
//     bcrypt.genSalt(10,(err,salt)=>{
//         bcrypt.hash(password,salt,async(err,hash)=>{
//             let createdUser = await userModel.create({
//                 username,
//                 email,
//                 password:hash,
//                 age
//             })

//              let token = jwt.sign({email},"shhhhhhhhhhhhh");
//              res.cookie("token",token);
//              res.render('page');
//         })
//     })
// });


// app.get("/login",function(req,res){
//     res.render("login");
// })

// app.post("/login",async function(req,res){
//     let user = await userModel.findOne({email:req.body.email});
//     if(!user) return res.send("something went wrong");

//     bcrypt.compare(req.body.password,user.password,function(err,result){
//         if(result){
//             let token = jwt.sign({email:user.email},"shhhhhhhhhhhhh");
//             res.cookie("token",token);  
//             res.render("inside");
//         }else res.send("No you can't Login");
//     })
// })

// app.get("/logout", function(req,res){
//      res.cookie("token","");
//      res.redirect("/");
// })

// app.listen(3000, function(){
//     console.log("Server started on port 3000");
// });




const express = require('express');
const app = express();
const userModel = require("./models/user.js");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const cookieParser = require('cookie-parser');
const path = require('path');

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

// Middleware to check if the user is authenticated
function checkAuth(req, res, next) {
    const token = req.cookies.token;
    
    if (!token) {
        return res.redirect('/login'); // Redirect to login if no token is found
    }

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, "shhhhhhhhhhhhh");
        req.user = decoded; // Store user data from the token in the request object
        next(); // Continue to the next middleware or route handler
    } catch (err) {
        return res.redirect('/login'); // Redirect if token is invalid
    }
}

app.get('/', function (req, res) {
    res.render('front');
});


app.get("/create", function (req, res) {
    res.render("index");
});

app.get("/front", function (req, res) {
    res.render("front");
});

// Sign up route
app.post("/create", async (req, res) => {
    let { username, email, password, age } = req.body;

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            let createdUser = await userModel.create({
                username,
                email,
                password: hash,
                age
            });

            let token = jwt.sign({ email }, "shhhhhhhhhhhhh");
            res.cookie("token", token);
            res.render('page');
        });
    });
});

// Login route
app.get("/login", function (req, res) {
    res.render("login");
});

// Login authentication
app.post("/login", async function (req, res) {
    let user = await userModel.findOne({ email: req.body.email });
    if (!user) return res.send("something went wrong");

    bcrypt.compare(req.body.password, user.password, function (err, result) {
        if (result) {
            let token = jwt.sign({ email: user.email }, "shhhhhhhhhhhhh");
            res.cookie("token", token);
            res.render("inside");
        } else {
            res.send("No you can't Login");
        }
    });
});

// Protected route: Only accessible when the user is logged in
app.get("/inside", checkAuth, function (req, res) {
    res.render("inside");
});

// Logout route: Clears the token (logs out the user)
app.get("/logout", function (req, res) {
    res.cookie("token", "");
    res.redirect("/login");
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});
