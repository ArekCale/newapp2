const express = require("express");
const check = express.Router();


check.post('/check_email',(req,res)=>{
    
    let matrix = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/
    let response = matrix.test(req.body.email);
    res.json(response);
    
});


check.post('/check_password',(req,res)=>{
    
    let matrix = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/
    let response = matrix.test(req.body.password);
   
    res.json(response);
    
});

check.post('/compare_password',(req,res)=>{
    
    let response = false;
    let pass1 = req.body.pass1;
    let pass2 = req.body.pass2;

    pass1===pass2?response=true:response=false;
    
    res.json(response);
    
});


module.exports = check;