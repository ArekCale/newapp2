const Sq = require('sequelize');

const datab = {
    HOST:'localhost',
    USER:'root',
    PASSWORD:'',
    DB:'arekd',
    dialect:'mysql',
    pool:{
        max:5,
        min:0,
        acquire:'30000',
        idle:'10000'
        }
    }

const Db = new Sq(datab.DB,datab.USER,datab.PASSWORD,{
    host:datab.HOST,
    dialect:datab.dialect,
    operatorsAliases:'false',
    });


  Db.authenticate()
        .then(()=>{ console.log(`Sequeliz connected to ${datab.DB} database`) })
        .catch(err=>{ console.log(err+'-------') });
        
const User = Db.define("users",{
    password:{
        type:Sq.DataTypes.STRING,
        allowNull:false
             },
    email:{
        type:Sq.DataTypes.STRING,
        allowNull:false
          },
    token:{
        type:Sq.DataTypes.STRING,
        },
   
    });
User.sync({force:false,alter:false});

const Data = Db.define("data",{
    ip:{type:Sq.DataTypes.STRING},
    time:{type:Sq.DataTypes.BIGINT}
                            })
    
    Data.sync({force:false,alter:false});   
              

    

module.exports = {User, Data};