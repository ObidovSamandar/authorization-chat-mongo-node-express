const jwt = require('jsonwebtoken')

const secret_word = process.env.SECRECT_WORD;

function generateToken(data){
    let token = jwt.sign(data,secret_word)
    return token
}

function confirmToken(token){
    try{
        let confirm = jwt.verify(token,secret_word)
        return confirm
    }catch(e){
        return false
    }
}


module.exports = {
    generateToken,
    confirmToken
}