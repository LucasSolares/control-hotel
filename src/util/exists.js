const fs = require('fs')

exports.existsDir = (dir) => {

    return new Promise((resolve) => {
        fs.exists(dir, (exists) => {
            resolve(exists)
        })
    })

}
