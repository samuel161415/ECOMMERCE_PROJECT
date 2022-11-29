const express=require('express')
const app=express();
const mongoose =require('mongoose')
const dotenv=require('dotenv')
const userRoot=require('./route/user')
const authRout=require('./route/auth')
const productRout=require('./route/product')
const orderRout=require('./route/order')
const cartRout=require('./route/cart')
const stripeRoute=require('./route/stripe')
const cors=require('cors')
app.use(cors())
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({
    extended: true
  }));

  // connection with mondodb atlas
try {
   mongoose.connect(
    process.env.MONGO_URL,
    { useNewUrlParser: true, 
       useUnifiedTopology: true },
    () => console.log(" Mongoose is connected")
  ); 

} catch (e) {
  console.log("could not connect");
}


app.use('/api/users',userRoot);
app.use('/api/auth',authRout);
app.use('/api/products',productRout);
app.use('/api/orders',orderRout);
app.use('/api/carts',cartRout);
app.use('/api/checkout',stripeRoute)
app.listen(process.env.PORT||5000,()=>{
    console.log("app is listning!");
})