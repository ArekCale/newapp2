const express = require("express");
const {User}  = require("../db");

const path = require("path")
const nodemail = require("nodemailer");
const jwt= require("jsonwebtoken");
const register = express.Router();




register.post("/register",async(req,res)=>{
    
    let {email, password} = req.body;
    
    let response = await User.findOne({where:{email:email}});
    
    
    if(response==null){
        
        let arr =[];

        for(i=0;i<10;i++){
            let num = Math.floor(Math.random() * process.env.EMAIL_STARS.length);
            arr[i]= process.env.EMAIL_STARS[num];    
        }
        
        let usr = await User.create(
            { 
                email:email,password:password,
                token:arr.join("")
            });
         
        usr.save();
        
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
            <p>Click bellow to Confirm Your Email</p>
            <a href='${process.env.HOST}
           /email_confirmation?code=${arr.join("")}&email=${email}' >Click here  to Redirect </a>
            </div>`
                }

         Mail_.sendMail(options,(err,resp)=>{ 
            
            if(err){
                console.log(err.message);
                res.json("Cant Sand Token to given Email, Please Try Again !!!");
            }
            else{ 
                res.json("Link with activation token has been send to Your email adress.  ");
            } 
            
        })
            
    }
    else{
        res.json("Email Already Exists in Database")
    }

    
});

register.get("/email_confirmation",async(req,res)=>{
    let code = req.query.code;
    let email = req.query.email;
    
    console.log(code,email);

    let response = await User.findOne({where:{token:code}});
    if(response!=null){
        
        let token = jwt.sign({email:email},process.env.SECRET,{expiresIn:'120s'})
        response.token = token;
        response.save();
        res.sendFile('register_confirmation.html',{root:path.join(__dirname+'../../public/')})
    }
    else{
        res.json('Error finding user Witch code in databae...')
    }
    
});




module.exports = register;