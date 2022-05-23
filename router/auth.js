const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');
const cookieParser = require("cookie-parser");
router.use(cookieParser());


//connection with DB
require('../db/conn');
const User = require("../model/userSchema");


// Register Router
router.post('/register', async (req, res) => {

    const { name, email, phone, vnumber, password, cpassword } = req.body

    if (!name || !email || !phone || !vnumber || !password || !cpassword) {
        return res.status(422).json({ err: "please fill the filed properly" })
    }

    try {
        //check user exit or not in datatbase
        const userExits = await User.findOne({ email: email });
        //compare password with databse
        if (userExits) {
            return res.status(422).json({ err: "Email Already Exits" });
        } else if (password != cpassword) {
            res.status(422).json({ message: "Password not matching" });
        } else {
            const user = new User({ name, email, phone, vnumber, password, cpassword });
            //save data in database
            await user.save();
            res.status(201).json({ message: "user register successfully" });
        }


    } catch (err) {
        console.log(err);
    }

});


//Login router

router.post("/signin", async (req, res) => {
    // console.log(req.body);
    // res.json({message:"login aswsome"});
    try {
        let token;
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Please fill the data" });
        }
        //ckeck email with database
        const userLogin = await User.findOne({ email: email });

        if (userLogin) {

            //create jsonwebtoken 
            token = await userLogin.generateAuthToken();
            console.log(token);

            res.cookie("jwttoken", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true
            })
            //compare password with databse
            const isMacth = await bcrypt.compare(password, userLogin.password)

            if (!isMacth) {
                res.status(400).json({ message: "Invalid Password " });
            }
            else {
                // localStorage.setItem('user', JSON.stringify(data));
                res.json({ message: "Login Succesfully" });
            }
        } else {
            res.status(400).json({ message: "Invalid credentials" });
        }


    } catch (err) {
        console.log("error");
    }
})

//About us page 

router.get("/welcome", authenticate, (req, res) => {
    console.log("hello welcome");
    res.send(req.rootUser);
})

// get contact us data
router.get("/getdata", authenticate, (req, res) => {
    console.log("hello contact ");
    res.send(req.rootUser);
})

//contact us page
router.post("/contact", authenticate, async (req, res) => {
    try {
        console.log(req.body);
        const { name, email, phone, message } = req.body;

        if (!name || !email || !phone || !message) {
            console.log("error in contact form");
            return res.json({ error: "please fill the contact form" });
        }
        const userContact = await User.findOne({ _id: req.userID });
        if (userContact) {
            const userMessage = await userContact.addMessage(name, email, phone, message);
            await userContact.save();
            res.status(201).json({ message: "User Contact Succesfully" });
        }


    } catch (error) {
        console.log(error)
    }
})

// Logout Functionality
router.get("/logout",(req, res) => {
    console.log("Log out");
    res.clearCookie('jwttoken',{path:'/'});
    res.status(200).send('User Logout');
})

module.exports = router;