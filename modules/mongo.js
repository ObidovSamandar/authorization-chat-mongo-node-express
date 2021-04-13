const mongoose = require('mongoose')

async function client(){
    let db = await mongoose.connect(process.env.MONGODB_URI||"mongodb://localhost/chat", {
        useNewUrlParser:true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
    return db
}

module.exports = client