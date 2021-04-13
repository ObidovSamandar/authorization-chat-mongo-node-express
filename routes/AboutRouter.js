const router = require('express').Router()
const fs = require('fs').promises
const {confirmToken} = require('../modules/jwt')
const fileUpload = require('express-fileupload');

const fsOld = require('fs')
const path = require('path')

const database = require('../models/UserModel')

router.get('/',async (req,res)=>{
    try{
        let user;
        if(req.cookies.token){
            user = confirmToken(req.cookies.token)
        }
        if(user){
            user = await database.findUserById(user.user)
            if(!user[0]) throw new Error('User yoq')
        }
    
        let photosFolderPath = path.join(__dirname,"..","public","photos",`${user[0].givenId}.jpg`)
        let exist = fsOld.existsSync(photosFolderPath)
        if(exist){
            await database.saveAvatarImgPath(user[0]._id,photosFolderPath)
        }else{
            photosFolderPath = ""
            await database.saveAvatarImgPath(user[0]._id,photosFolderPath)
        }
        let userInfo={
            name:user[0]?.name || "",
            email:user[0]?.email || "",
            id: user[0]?.givenId || "userqaysidir",
            photo: exist ? `/photos/${user[0].givenId}.jpg`: 'https://picsum.photos/400'
        }
        res.render('about',{
            title:"About Page",
            path:"/about",
            userInfo
        })  
    }catch(e){
        res.redirect('/registration')
    }
})

router.get('/:name', async (req,res)=>{
    try{
        let user;
        let users = await database.findAlluser()
        user = users.find(user2=> req.params.name.toLowerCase()==user2.name.toLowerCase())
        if(!user) throw new Error('User yoq')
        let photosFolderPath = path.join(__dirname,"..","public","photos",`${user.givenId}.jpg`)
        let exist = fsOld.existsSync(photosFolderPath)
        userInfo={
            name:user?.name || "",
            email:user?.email || "",
            id: user?.givenId || "userqaysidir",
            photo: exist ? `/photos/${user.givenId}.jpg`: 'https://picsum.photos/400'
        }
        res.render('about',{
            title:"About Page",
            path:"/about",
            userInfo
        })
    }
    catch(e){
        res.send('User not Found')
    }
})

router.post('/photo',fileUpload(), async (req,res)=>{
    let user;
    let users = await database.findAlluser()
    if(req.cookies.token){
        user = confirmToken(req.cookies.token)
    }else{
        throw new Error('Cookie yoq')
    }
    if(user){
        user = users.find(user2=> user.user==user2._id)
        if(!user) throw new Error('User yoq')
    }
    let userInfo={
        name:user?.name || "",
        email:user?.email || "",
        id: user?.givenId || "userqaysidir",
    }

    if(req?.files?.photo && (req?.files?.photo?.mimetype=='image/jpeg'||req?.files?.photo?.mimetype=='image/png')){
        let photosFolderPath = path.join(__dirname,"..","public","photos",userInfo.id+'.jpg')
        await fs.writeFile(photosFolderPath, req?.files?.photo?.data)
    }else{
        res.send({
            ok:false
        })
        return 0
    }
    res.send({
        ok:true
    })
})

module.exports = {
    path:'/about',
    router
}