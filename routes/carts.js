const express = require("express")
const cartsRepo=require("../repositories/carts")
const prodctRepo=require("../repositories/products")
const cartShowTemplate=require("../views/carts/show")
const router=express.Router()

router.post("/cart/products",async (req,res)=>{
    let cart;
   if(!req.session.cartId){
    //We dont have a cart we need to create one and store req.session.cardId property
         cart=await cartsRepo.create({items:[]})
        req.session.cartId=cart.id
   } else {
    //We have a cart! Let's get it from the repository
     cart =await cartsRepo.getOne(req.session.cartId);
   }

   const existingItem=cart.items.find(item=>item.id === req.body.productId)
   if(existingItem){
    //Increment quantity and save cart
    existingItem.quantity++;
   } else {
    //add new product id to items array
    cart.items.push({id:req.body.productId, quantity:1})
   }
   await cartsRepo.update(cart.id,{
    items:cart.items
   })

   console.log(cart)
   res.send("Product added to cart")
})

//Receive a GET request to show all items in cart

router.get('/cart',async (req,res)=>{
  if(!req.session.cartId){
    return res.redirect("/")
  }

  const cart = await cartsRepo.getOne(req.session.cartId);

  for(let item of cart.items){
    const product= await prodctRepo.getOne(item.id) //getting all product details from product repo
    item.product=product; // adding product details to cart item with all info about product from product repo
  }

  res.send(cartShowTemplate({items:cart.items}))
})
module.exports=router;