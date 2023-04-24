const express = require('express');
const jwt = require('jsonwebtoken');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const app = express();

const SECRET="xHg8L2jFzKt6nBcQ"


app.use(express.json());


app.use("/customer/auth/*", function auth(req,res,next){
    if(req.headers['authorization']) {
        token = req.headers['authorization'].split(' ')[1];
        jwt.verify(token, SECRET,(err,user)=>{
            if(!err){
                req.user = user;
                next();
            }
            else{
                return res.status(403).json({message: "User not authenticated"})
            }
         });
     } else {
         return res.status(403).json({message: "User not logged in"})
     }

});
 
const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
