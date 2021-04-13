const router = require('express').Router()

const { confirmToken } = require('../modules/jwt');


let  moment = require('moment');

const database = require('../models/UserModel')

router.get('/', async (req, res)=>{
    try{
        let user;
        if(req.cookies.token){
            user = confirmToken(req.cookies.token)
        }else{
            throw new Error('Cookie yoq')
        }
        if(user){
            user = await database.findUserById(user.user)
            if(!user[0]) throw new Error('User yoq')
        }
        let userInfo={
            name:user[0]?.name || "",
            email:user[0]?.email || ""
        }
        let allUsers = await database.findAlluser()
        res.render('index',{
            title:"Home",
            path:"/",
            message:allUsers,
            error:"",
            userInfo
        })
    }
    catch(e){
        res.redirect('/registration')
    }
        
}) 

router.post('/', async (req, res)=>{
    let user;
    let users;
    try{
        let { message } = req.body;
        user = confirmToken(req.cookies.token)
        user =await database.findUserById(user.user)
        if(message.length==0) throw new Error('Please write message')
         await database.writeMessage(user[0]._id,message,moment().unix(),moment().format())
        res.redirect('/')
    }catch(e){
        users = await database.findAlluser()
         res.render('index',{
            title:"Home",
            path:"/",
            userInfo:{
                name:user[0]?.name || "",
                email:user[0]?.email || ""
            },
            message:users,
            error:e.message
        })
    }
})

module.exports = {
    path:'/',
    router
}