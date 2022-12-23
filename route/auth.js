const router=require('express').Router();
const User=require('../model/User')
const CryptoJs=require('crypto-js');
const jwt=require('jsonwebtoken');

//var encrypted = CryptoJS.AES.encrypt("Message", "Secret Passphrase");
//var decrypted = CryptoJS.AES.decrypt(encrypted, "Secret Passphrase");
//var encrypted = CryptoJS.DES.encrypt("Message", "Secret Passphrase");
//var decrypted = CryptoJS.DES.decrypt(encrypted, "Secret Passphrase");

// register
router.post('/register',async(req,res)=>{

  const newUser=new User({
    firstName:req.body.firstName,
    lastName:req.body.lastName,
    username:req.body.username,
    email:req.body.email,
    password:CryptoJs.AES.encrypt(req.body.password, process.env.PASS_SEC).toString()
  })

  try{
     const savedUser=await newUser.save();
     return res.status(201).json(savedUser)
  }
  catch(err){
   // console.log("excuted",res.status)
    return res.json('')
  }
})

// login
router.post('/login',async(req,res)=>{
console.log('hi sam')
  try{

    const user=await User.findOne({username:req.body.username});
    //console.log("user",user)
    if(!user)  return res.status(401).json("wrong credential");

    const tempPass=user.password;

    var decrypted = CryptoJs.AES.decrypt(tempPass,process.env.PASS_SEC).toString(CryptoJs.enc.Utf8);
    if(decrypted!==req.body.password) return res.status(401).json('wrong credentials');

    const accessToken = jwt.sign(
      {
        id:user._id,
        isAdmin:user.isAdmin,
      },
      process.env.JWT_SEC,
      {
        expiresIn:"10d"
      }
    )
    // returning password to user is wrong so return everything except password
    const{password, ...others}=user._doc;
    
   return res.status(200).json({...others,accessToken})
}
  catch(err){
   return  res.status(500).json(err)
  }
})

router.get('/all',async(req,res)=>{

    try{
        const user=await User.find()
       return res.send(user)
    }
    catch(err){
     return res.send(err)
    }
})
module.exports=router