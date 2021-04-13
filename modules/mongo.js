const mongoose = require('mongoose')

async function client(){
    let db = await mongoose.connect("mongodb://localhost/chat", {
        useNewUrlParser:true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
    return db
}

module.exports = client