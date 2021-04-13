const router = require('express').Router()

const { compareHash } = require('../modules/crypt')

const { generateToken } = require('../modules/jwt')

const database = require('../models/UserModel')

router.get('/', async(req, res)=>{
    res.render('login',{
        title:"Login",
        path:"/login",
        error:"",
    })
}) 

router.post('/',async (req,res)=>{
    try{
        let {email, password} = req.body;
        if(!(email && password)) throw new Error('Email or Password not found')
        let user = await database.findParticularUser(email)
        if(!user[0]) throw new Error('Email not found')
        if(!compareHash(password,user[0].password)) throw new Error("Password not found")
        let user_data = {user:user[0]._id}
        res.cookie('token',generateToken(user_data)).redirect('/')
    }catch(e){
        res.render('login',{
            title:"Login",
            path:"/login",
            error:e.message
        })
    }
})

module.exports = {
    path:'/login',
    router
}
