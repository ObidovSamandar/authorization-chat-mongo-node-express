const bcrypt = require('bcrypt')


function generateHash(data){
    let saltRoundedHash = bcrypt.genSaltSync(10)
    let hash = bcrypt.hashSync(data, saltRoundedHash)
    return hash
}

function compareHash(data, hash){
    return bcrypt.compareSync(data,hash)
}

module.exports = {
    compareHash,
    generateHash
}