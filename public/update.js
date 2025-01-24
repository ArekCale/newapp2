
let p = new URLSearchParams(window.location.search);
const EMAIL = p.get("email");


const input = (event) =>{
    
    let {value} = event.target;
    
    let regex = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/;

    if(regex.test(value))
        { document.getElementById("btn").disabled = false; }
    else{ document.getElementById("btn").disabled = true;  }

    
}


const check = async(e,path)=>{ 

    let info = await fetch(path,{ 
        method:"POST",
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({password:e.target.value})
    })
    .then(x=>{ return x.json() })
    .catch(err=>{ return err.json() })    
    
    if(info===true
        && document.getElementById("password_").value
        === document.getElementById("repeat_").value
    ){ document.getElementById("snd_").disabled = false; }
    else{ document.getElementById("snd_").disabled = true; }
      
 }

const send_data = async(e)=>{

    let data = document.getElementById("pass").value;

    let info = await fetch("/route1",{
        
        method:"POST",
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({data:data,email:EMAIL})
    }).then(x=>{ return x.json() })
    .catch(err=>{ console.log(err) })
    

   
}

const snd = async()=>{
    
    let password = document.getElementById("password_").value;
    let email = document.getElementById("data1_").innerHTML;
    let code = document.getElementById("data2_").innerHTML;

    let info = await fetch("/write",{
        method:"POST",
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({password:password,email:email,code:code})
    }).then(x=>{ return x.json() })
    .catch(err=>{ console.log(err) })

}