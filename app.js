const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser ());

dotenv.config({path:'./config.env'});
// DB connection
require('./db/conn');

app.use(express.json());
//  require router
app.use(require('./router/auth'));

const User = require('./model/userSchema');
const PORT = process.env.PORT;


app.get('/',(req,res)=>{
res.send(`Hello word from server`);
});

// router.get('/about',(req,res)=>{
//     console.log("hello about us");
//     res.send(`Hello word from about server`);
// })
// app.get('/contact',(req,res)=>{
//     res.send(`Hello word from contact server`);
// })

app.get('/dashboard',(req,res)=>{
    res.send('Hello word from dashboard server');
})

app.get('/signin',(req,res)=>{
    res.send(`Hello word from signin server`);
})

app.get('/signup',(req,res)=>{
    res.send('Hello word from signup server');
})

app.listen(PORT,()=>{
    console.log(`Server is running on port number ${PORT}`);
})