const cookieParser = require('cookie-parser')
const express = require('express')
const glob = require('glob')
const app = express()
require('dotenv').config()

const PORT = process.env.PORT || 4000;



app.listen(PORT, ()=> console.log(`SERVER RUNNING ON ${PORT}`))

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.set("view engine","ejs")
app.use(cookieParser())


// Routes
glob('./routes/*.js', (err,files)=>{
    files.forEach(innerFile => {
        let reqInnnerFile = require(innerFile)
        app.use(reqInnnerFile.path,reqInnnerFile.router)
    })
})
