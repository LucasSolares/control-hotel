const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const config = require('../config')

//UTIL

async function hashPassword(unHashedPassword) {
    try {
        return await bcrypt.hash(unHashedPassword, config.SALT)
    } catch (error) {
        console.error(error)
        throw error
    }
}

async function comparePassword(unHashedPassword, passwordHashed) {
    try {
        return await bcrypt.compare(unHashedPassword, passwordHashed)
    } catch (error) {
        console.error(error)
        throw error
    }
}

function generateAndSignToken(payload) {
    return jwt.sign(payload, config.SECRET, { expiresIn: '1h' })
}

function decodeToken(token) {
    try {
        const payload = jwt.verify(token, config.SECRET)
        if (!payload) {
            throw { message: 'Token invalid', code: 401 }
        }
        return payload
    } catch (error) {
        console.error(error)
        switch (error.message) {
            case 'jwt expired':
                throw { message: 'Token expired', code: 401 }

            default:
                throw error
        }
    }
}

function decodeAuthorization(req) {
    try {
        const authorization = req.headers.authorization || ''
        const token = authorization.replace(/['"]+/g, '')
        if (!token) {
            throw { message: 'You dont send any token', code: 401 }
        }
        return token
    } catch (error) {
        console.error(error)
        throw error
    }
}

module.exports = {
    hashPassword,
    comparePassword,
    decodeAuthorization,
    generateAndSignToken,
    decodeToken
}