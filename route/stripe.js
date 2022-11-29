const router=require('express').Router()
const stripe=require('stripe')('sk_test_51Ljk6xFst8SiIJX3ovLsnrMinmNEUovGds95dzM5CIviPxZZFfJQPOxPMaEKsYdb8su7mM894wAJO9vUtLUiPH1Z00Lb6I9VRH')

router.post('/payment', (req,res)=>{
    console.log("hi stripe");

   // console.log('token',req.body.tokenId);
    //console.log('amount',req.body.amount);
    stripe.charges.create({
        source:req.body.tokenId,
        amount:req.body.amount, 
        currency:"usd"
    },(stripeErr,stripeRes)=>{
        if(stripeErr){
            res.status(500).json(stripeErr);
        }
        else{
            res.status(200).json(stripeRes);
        }
    })
})
module.exports=router;