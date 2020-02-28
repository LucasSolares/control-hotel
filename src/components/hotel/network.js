const express = require('express')
const router = express.Router()

const response = require('../../network/response')
const Controller = require('./controller')
const Secure = require('./secure')

router.post('/', async(req, res) => {

    const { name, email, password, country, direction, price, availability } = req.body

    try {
        const hotelAdded = await Controller.addHotel(name, email, password, country, direction, price, availability)
        response.success(res, hotelAdded, 201)
    } catch (error) {
        console.error(error)
        response.error(res, error.code)
    }
})

router.get('/', Secure.checkAuth('list'), async(req, res) => {

    const { orderBy, asc } = req.query
    const { _id, startDate, finalDate, qualification } = req.body

    try {
        let ascNumber = asc ? parseInt(asc) : undefined
        const hotelsFinded = await Controller.listHotel(_id, startDate, finalDate, qualification, orderBy, ascNumber)
        response.success(res, hotelsFinded)
    } catch (error) {
        console.error(error)
        response.error(res, error.code)
    }
})

router.put('/', Secure.checkAuth('updateOrDelete'), async(req, res) => {
    const { _id, name, email, password, country, direction, price, availability } = req.body
    try {

        const hotelUpdated = await Controller.updateHotel(_id, name, email, password, country, direction, price, availability)
        response.success(res, hotelUpdated)
    } catch (error) {
        console.error(error)
        response.error(res, error.code)
    }
})

router.delete('/', Secure.checkAuth('updateOrDelete'), async(req, res) => {
    const { _id } = req.body
    try {

        const hotelDeleted = await Controller.deleteHotel(_id)
        response.success(res, hotelDeleted)

    } catch (error) {
        console.error(error)
        response.error(res, error.code)
    }
})

router.post('/signin', async(req, res) => {
    const { email, password } = req.body
    try {
        const token = await Controller.signIn(email, password)
        response.success(res, token)
    } catch (error) {
        console.error(error)
        response.error(res, error.code)
    }
})

router.put('/qualify', Secure.checkAuth('list'), async(req, res) => {
    const { _id, qualification } = req.body

    try {
        let qualificationInt = qualification ? parseInt(qualification) : undefined
        const hotelQualified = await Controller.qualifyHotel(_id, qualificationInt)
        response.success(res, hotelQualified)
    } catch (error) {
        console.error(error)
        response.error(res, error.code)
    }
})

router.post('/report', Secure.checkAuth('list'), async(req, res) => {
    const { _id } = req.body

    try {
        const reportURL = await Controller.generateReport(_id)
        response.success(res, reportURL)
    } catch (error) {
        console.error(error)
        response.error(res, error.code)
    }
})

module.exports = router