const router = require('express').Router()

const { generateHash } = require('../modules/crypt')

const database = require('../models/UserModel')

router.get('/',(req, res)=>{
    res.render('registration',{
        title:"Registration",
        path:"/registration",
        error:"",
    })
}) 


router.post('/', async (req,res)=>{
    try{
        let {email, password, name} = req.body;
        if(!(name && email && password)) throw new Error('Fields did not filled')
        let allUsers = await database.findAlluser()
        await database.createUser(email,generateHash(password),name,allUsers.length+1)
        res.redirect('/login')
    }catch(e){
        let errorMessage=e.message;
        if(e.code==11000){
            errorMessage='This user already exist'
        }
        res.render('registration',{
            title:"Registration",
            path:'/registration',
            error:errorMessage
        })
    }
})
module.exports = {
    path:'/registration',
    router
}

