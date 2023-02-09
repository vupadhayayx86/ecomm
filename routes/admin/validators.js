const {check}=require('express-validator')
const userRepo=require('../../repositories/users')

module.exports={
    requireTitle:check('title')
    .trim()
    .isLength({min:5, max:40})
    .withMessage("Must be between 5 and 40 characters"),
    requirePrice:check('price')
    .trim()
    .toFloat()
    .isFloat({min:1})
    .withMessage("Must be number greater than 1")
    ,

    
    requireEmail:check('email').trim().normalizeEmail().isEmail().withMessage('Must be a valid email').custom(async (email)=>{
        const existingUser=await userRepo.getOneBy({email})
        if(existingUser){
            throw new Error('Email in use')
        }
    }),

    requirePassword: check('password').trim().isLength({min:4,max:20}).withMessage('Must be between 4 and 20 characters'),
    requirePasswordConfirmation: check('passwordConfirmation').trim().isLength({min:4,max:20}).withMessage('Must be between 4 and 20 characters').custom((passwordConfirmation,{req})=>{
        if(passwordConfirmation!==req.body.password){
            throw new Error('Passwords must match')
        }
    }),
    requireEmailExists: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must provide a valid email')
    .custom(async (email)=>{
        const user=await userRepo.getOneBy({email})
        if(!user){
            throw new Error('Email not Found')
        }
    
    }),
    requireValidPasswordForUser: check('password')
    .trim()
    .custom(async (password,{req})=>{
        const user=await userRepo.getOneBy({email:req.body.email})
        if(!user){
            throw new Error('User does not exisit')
        }
        const validPassword=await userRepo.comparePasswords(user.password,password)
        if(!validPassword){
        throw new Error("Invalid Password")
    }
    })
}