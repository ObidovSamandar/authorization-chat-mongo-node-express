const client = require('../modules/mongo')
const Schema = require('mongoose').Schema

let userSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    givenId:{
        type:Number,
        required:true
    },
    message:[{
        textWritten:{
            type:String,
            default:""
        },
        writtenTimeMilliseconds:{
            type:Number,
            default:0
        },
        writtenTime:{
            type:String,
            default:""
        }
    }],
    avatarImgPath:{
        type:String,
        default:""
    }
})

async function userModel(){
    let db = await client()
    return  db.model('users',userSchema)
}

async function createUser(email, password,name, givId,messages,avatarImgPath){
    if(!(email && password)) throw new Error('Email or Password  not found')
    let model = await userModel()
    let data = await model.create({email:email, password:password, name:name, givenId:givId, message:messages, avatarImgPath:avatarImgPath})
    data.save()
}

async function findAlluser(){
    let model = await userModel()
    let allUsers = await model.find({})
    return allUsers
}
async function findParticularUser(Useremail){
    let model = await userModel();
    let particularUser =  await model.find({email:Useremail})
    return particularUser
}

async function findUserById(userId){
    let model = await userModel();
    let userInfo = await model.find({_id:userId})
    return userInfo
}

async function writeMessage(id,text,writTimeM,writTime){
    let model = await userModel();
    let upadated = await model.updateOne({_id:id},{$push:{message:{textWritten:text,writtenTimeMilliseconds:writTimeM,
    writtenTime:writTime}}},{ upsert: true, new: true })
    return upadated
}

async function saveAvatarImgPath(id,path){
    let model = await userModel();
    let imgPath= path.toString()
    let writePath = await model.updateOne({_id:id},{$set:{avatarImgPath:imgPath}},{new: true })
    return writePath
}


module.exports = {
    createUser,
    findAlluser,
    findParticularUser,
    findUserById,
    writeMessage,
    saveAvatarImgPath
}