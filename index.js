const express = require("express");
const cors = require("cors");
const path = require('path');
const register = require('./routes/register');
const login = require('./routes/login');
const update = require("./routes/update")

require("dotenv").config();

const port = process.env.PORT;
const app = express();

app.use(cors({credentials:true,origin:"http://localhost:5173"}));
app.use(express.json())
app.use(express.static('public'));
app.use(register);
app.use(login);
app.use(update);
app.set("view engine","pug")

app.listen(port,(err)=>{
    if(err){console.log(err)}
    else{ console.log(`Server on Port ${port}`)}
})
    