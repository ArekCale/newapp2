const express = require("express");
const update = express.Router();
const {User, Data} = require("../db");
const nodemail = require("nodemailer");
const path = require('path');
const pug = require("pug");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let count = [];

update.post("/update",async(req,res)=>{
    
    let arr = [];

    for(i=0;i<10;i++){
        let num = Math.floor(Math.random() * process.env.EMAIL_STARS.length);
        arr[i]= process.env.EMAIL_STARS[num];    
    }

    let { email } = req.body;
    
    let usr = await User.findOne({where:{email:email}})
    

    if(usr != null){

         const Mail_ = nodemail.createTransport({
                    service:'gmail',
                    host:'smtp.gmail.com',
                    port:587,
                    secure:false,
                    auth:{
                        user:process.env.EMAIL_SERVER,
                        pass:process.env.EMAIL_SERVER_PASS
                    }
                });
        
        const options={
                    from:"Adrazor",
                    to:email,
                    subject:"Email Confirmation",
                    text:"testing",
                    html:`<div>
                    <p>Click bellow to proceed changing Your Password</p>
                    <a href='${process.env.HOST}
                   /update_password?code=${arr.join("")}&email=${email}' >Click here  to Redirect </a>
                    </div>`
                        }
        
        Mail_.sendMail(options,(err,resp)=>{ 
            
                            if(err){
                                console.log(err.message);
                                res.json("Nie Przeszło !!!");
                            }
                            else{ console.log("przeszło...") 
                                res.json("Przeszło ...");
                            } 
                        });
         usr.token = arr.join("");
         usr.save();               

    }
    else{
        res.json("User Can`t Be Find")
    }
    
  

});


update.post("/logout",(req,res)=>{
    
});

update.get("/update_password",async(req,res)=>{
    
    let U = await User.findOne({where:{email:req.query.email}});
    if(U!==null && U.token === req.query.code){

        res.render(__dirname+"../../public/update_password.pug",
        {
            code:req.query.code,
            email:req.query.email

        })
    }
    else
    {
        res.json("---");
    }
});

update.post('/write',async(req,res)=>{
   let {password,email,code} = req.body;
   let hash = bcrypt.hashSync(password,10);
   let U = await User.findOne({where:{email:email}});
    if(U!==null){
        
        let token = jwt.sign({email:email},process.env.SECRET,{expiresIn:"120s"});
        U.password = hash;
        U.token = token;
        U.save();
        res.json(true)
    }
    else
    {
        
        res.json("error");
    }
})


update.post("/counter",async(req,res)=>{
   
    let usr = await Data.findOne({ips:"::1"});
    
   let t = req.body.time - usr.time;
    console.log((t/60000).toFixed());
    

  
   res.json("ok")
    

    
});

module.exports = update;
