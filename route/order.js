const router=require('express').Router();
const CryptoJs= require('crypto-js');
const Order = require('../model/Order');
const {verifyToken,verifyTokenAndAuthorization, verifyTokenAndAdmin}= require('./verifyToken');


// CREATE : anyone that has account can create order

router.post("/",verifyToken,async(req,res)=>{
   
    const newOrder=new Order(req.body);
    try{
      const savedOrder= await newOrder.save();
      return res.status(200).json(savedOrder);
    }
    catch(err){
      return res.status(500).json(err);
    }
})

   // UPDATE ORDER
router.put('/:id',verifyTokenAndAdmin,async(req,res)=>{
      
      try{  
          const updatedOrder= await Order.findByIdAndUpdate(
            req.params.id,
            {
               $set:req.body,
            },{
               new:true
            })
           
            return res.status(200).json(updatedOrder)
      }
      catch(err){
         return res.status(500).json(err)
      }
    
})


//    // DELETE ORDER

   router.delete('/:id',verifyTokenAndAdmin,async(req,res)=>{
      try{
          await Order.findByIdAndDelete(req.params.id)
          return res.status(200).json('Cart is deleted...')
      }
      catch(err){
         return res.status(500).json(err)
      }
   })
      // GET USER ORDERS
   router.get('/find/:userId',verifyTokenAndAuthorization, async(req,res)=>{
      try{
         const order= await Order.find({userId:req.params.userId})
         return res.status(200).json(order)
      }
      catch(err){
         return res.status(500).json(err)
      }
   })

      // GET ALL ORDERS : only allowed to admin

  router.get('/',verifyTokenAndAdmin,async(req,res)=>{
    
    try{
         const orders=await Order.find();
         return res.status(200).json(orders);
    }
    catch(err){
      return  res.status(500).json(err);
    }
  }) 
        
           // GET MONTHLY INCOME
           router.get('/income',verifyTokenAndAdmin,async(req,res)=>{
            //console.log("orders")
            const productId = req.query.pid;
            //console.log("productId",productId)
             const date = new Date();
             const lastMonth= new Date(date.setMonth(date.getMonth()-1));
             const prevMonth= new Date(new Date().setMonth(lastMonth.getMonth()-1));
           
              try{
                const income=await Order.aggregate([
                    {$match:{
                     createdAt:{$gte:prevMonth},...(productId&&{products:{$elemMatch:{productId}}})}},
                    {
                        $project:{
                        month:{$month:"$createdAt"},
                        sales:"$amount",
                     } 
                    },
                     {
                        $group:{
                            _id:"$month",
                            total:{$sum:"$sales"}
                        }
                     }

                    
                ])
                //console.log("income",income)
                console.log("income",income)
                return res.status(200).json(income)
              }
              catch(err){
               return res.status(500).json(err)
;              }
            })
   module.exports=router