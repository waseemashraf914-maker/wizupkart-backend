require('dotenv').config();
const express=require('express');
const app=express();
app.get('/',(req,res)=>res.json({status:'running'}));
app.listen(process.env.PORT||5000);