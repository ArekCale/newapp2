const express = require("express");
const {User} = require("../db");
const bcrypt = require('bcrypt');
const login = express.Router();
const jwt = require('jsonwebtoken');




login.post("/login",async(req,res)=>{

let { email, password } =req.body;
let usr ="";

 if(User.length!==0){  
    
        const usr = await User.findOne({where:{email:email}})
        .then(x=>{ return x; })
        .catch(err=>{ console.log(err)});
    }       
else{  
        const { readFileSync } = require("fs");
        let f = JSON.parse(readFileSync("./db.json"));
        let User = f.Users;
        usr =User.find(x=>{ return x.email === email });
        console.log(usr);
 }      

    if(usr!==null && usr !== undefined)
    {

        let response = bcrypt.compareSync(password,usr.password);
        
        if(response)
            {
            try{
                jwt.verify(usr.token,process.env.SECRET);
                let JWT = jwt.sign({email:email},process.env.SECRET,{expiresIn:"60s"});
                res.cookie(email.split("@")[0],JWT,{secure:true});
                res.json({1:"User Logged In",2:true});
            }
            catch(err){ 
                let token = jwt.sign({email:email},process.env.SECRET,{expiresIn:"120s"});
                usr.token = token;
                usr.save();
                console.log(err); 
                res.json({1:"User Logged In",2:true,3:email.split("@")[0]});
            }
            }
        else{
            res.json({1:"Passwords don`t match",2:false});
        }   
    }
    else{ 
        res.json({1:"Cant Find User with Given Email",2:false}) 
    }   
 
 
     

});

login.post("/logout",(req,res)=>{
    
    let {user} = req.body;
   
    res.clearCookie(user);
    res.json("Empty")
});


module.exports = login;