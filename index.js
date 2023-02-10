const express = require('express')
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const authRouter = require('./routes/admin/auth')
const productsRouter=require('./routes/admin/products')
const userProductsRouter=require('./routes/products')
const cartsRouter=require("./routes/carts")
const app=express();

app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended:true}))
//adding cookie session in app. 
app.use(cookieSession({
    keys:['adakdfjkfgkskdf']
}))

app.use(authRouter)
app.use(productsRouter)
app.use(userProductsRouter)
app.use(cartsRouter)

app.listen(3000,()=>{
    console.log("Listening....")
})