const express=require('express')
const {handleErrors}=require("./middlewares")
const userRepo = require('../../repositories/users')
const signupTemplate = require('../../views/admin/auth/signup')
const singinTemplate=require('../../views/admin/auth/signin')
const {check,validationResult}=require('express-validator')
const {requireEmail,requirePassword,requirePasswordConfirmation,requireEmailExists,requireValidPasswordForUser}=require('./validators')
const router = express.Router()
//route handler 1
router.get('/signup',(req,res)=>{
    res.send(signupTemplate({req}))
})
//Route Handler 2
//There are 3 parameters to post method (url,validationLogic,callback function)
router.post('/signup',
[requireEmail,requirePassword,requirePasswordConfirmation],handleErrors(signupTemplate),
async (req,res)=>{
    
   const {email,password}=req.body;
   //Checking if the user exists in the json file.
    //Create a user in user repo to represent this person
   const user=await userRepo.create({email,password})
   //Store the id of that user inside the users cookie
   req.session.userId=user.id;
    res.redirect("/admin/products")

})
//Route Handler 3
router.get('/signout',(req,res)=>{
    req.session=null; 
    res.send('You are logged out')
})

//Route Handler 4
router.get('/signin',(req,res)=>{
    res.send(singinTemplate({/*Empty Object to avoid issues  */}))
})
//Route Handler 5
router.post('/signin',[requireEmailExists,requireValidPasswordForUser],handleErrors(singinTemplate),async (req,res)=>{
    const {email}=req.body;
    const user=await userRepo.getOneBy({email})
    if(!user){
        throw new Error("User Does not exisit")
    } else {
    req.session.userId=user.id;
    res.redirect("/admin/products")
    }
    
})

module.exports=router;