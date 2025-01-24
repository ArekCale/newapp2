const express = require("express");
const User = require("../db");
const bcrypt = require('bcrypt');
const login = express.Router();
const jwt = require('jsonwebtoken');


login.post("/login",async(req,res)=>{

let { email, password } =req.body;

    let usr = await User.findOne({where:{email:email}})

    if(usr!==null){

        let response = bcrypt.compareSync(password,usr.password);
        if(response){
            try{
                jwt.verify(usr.token,process.env.SECRET);
                let JWT = jwt.sign({email:email},process.env.SECRET,{expiresIn:"60s"});
                res.cookie("TOKEN",JWT,{secure:true});
            }
            catch(err){ 
                let token = jwt.sign({email:email},process.env.SECRET,{expiresIn:"120s"});
                usr.token = token;
                usr.save();
                console.log(err); 
            }
            
        }

      
    }
    else{ 
        res.json("Cant Find User with Given Email") 
    }


   
    res.json("User has been logged");
});

module.exports = login;