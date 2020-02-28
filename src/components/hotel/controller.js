const Store = require('./store')
const Auth = require('../../auth')

const HotelTemplate = require('../../templates/hotelTemplate')

async function addHotel(name = '', email = '', password = '', country = '', direction = '', price = 0, availability = '', ) {

    let hotelToAdd;
    try {
        name = name.trim()
        email = email.toLowerCase().trim()
        password = password.trim()
        country = country.trim()
        direction = direction.trim()
        availability = availability.trim()
        if (!(name && email && password && country && direction && price && availability)) {
            throw { message: 'Missing data something like name, email, password, country, direction, price or availability', code: 400 }
        }
        availability = new Date(availability)
        hashedPassword = await Auth.hashPassword(password)
        hotelToAdd = { name, email, password: hashedPassword, country, direction, price, availability, }
        return await Store.addHotel(hotelToAdd)

    } catch (error) {
        console.error(error)
        throw error
    }

}

async function listHotel(_id, startDate = '', finalDate = '', qualification = 0, orderBy = '', asc = 1) {

    let filter = {}
    let options = {}
    try {

        startDate = startDate ? new Date(startDate) : Date.now()
        finalDate = finalDate ? new Date(finalDate) : Date.now()
        if (orderBy) {
            options.orderBy = orderBy;
            console.log(asc)
            console.log((asc !== 1 && asc !== -1))
            if (typeof asc !== 'number' || (asc !== 1 && asc !== -1)) {
                throw { message: 'asc parameter bad formated', code: 400 }
            }
            options.asc = asc
            return await Store.listHotels(filter, options)
        }
        if (startDate > finalDate) {
            throw { message: "Sorry your specified start date is later than the final date", code: 400 }
        } else {
            if (_id) {
                filter = { _id }
            } else if (qualification) {
                filter = { qualification }
            } else {
                filter = { availability: { $gte: startDate, $lte: finalDate } }
            }
        }
        return await Store.listHotels(filter)

    } catch (error) {
        console.error(error)
        throw error
    }

}

async function updateHotel(_id, name = '', email = '', password = '', country = '', direction = '', price = 0, availability = '') {
    let hotelToUpdate = {}
    try {
        name = name.trim()
        email = email.toLowerCase().trim()
        password = password.trim()
        country = country.trim()
        direction = direction.trim()
        availability = availability.trim()

        if (_id) {

            if (name) {
                hotelToUpdate.name = name
            }
            if (email) {
                hotelToUpdate.email = email
            }
            if (password) {
                hotelToUpdate.password = Auth.hashPassword(password)
            }
            if (country) {
                hotelToUpdate.country = country
            }
            if (direction) {
                hotelToUpdate.direction = direction
            }
            if (price) {
                hotelToUpdate.price = price
            }
            if (availability) {
                availability = new Date(availability)
            }
            if (Object.keys(hotelToUpdate).length !== 0) {
                return await Store.updateHotel(_id, hotelToUpdate)
            }
        }
        throw { message: 'Missing something like _id, name, email, password, country, direction, price or availability' }

    } catch (error) {
        console.error(error)
        throw error
    }
}

async function deleteHotel(_id) {
    try {
        return await Store.deleteHotel(_id)
    } catch (error) {
        console.error(error)
        throw error
    }
}

async function signIn(email = '', password = '') {
    try {
        email = email.toLowerCase().trim()
        password = password.trim()

        if (!(email && password)) {
            throw { message: 'Missing data something like email or password', code: 400 }
        }

        const hotel = (await Store.listHotels({ email })).pop()
        if (!hotel) {
            throw { message: `There was no hotel with email: ${email}`, code: 400 }
        }
        const passwordCorrect = await Auth.comparePassword(password, hotel.password)
        if (!passwordCorrect) {
            throw { message: 'Password incorrect', code: 400 }
        }
        return Auth.generateAndSignToken({ sub: hotel.id })
    } catch (error) {
        console.error(error)
        throw error
    }
}

async function qualifyHotel(_id, qualification = 0) {

    try {
        if (!(_id && qualification)) {
            throw { message: 'Missing data something like _id or qualify', code: 400 }
        }
        if (qualification > 5) {
            throw { message: 'You only can puntuate 0 - 5', code: 400 }
        }
        return await Store.updateHotel(_id, { qualification })
    } catch (error) {
        console.error(error)
        throw error
    }

}

async function generateReport(_id) {

    try {
        const hotelFind = (await Store.listHotels({ _id })).pop()
        if (!hotelFind) {
            throw { message: `Hotel with id ${_id} not finded` }
        }
        return await HotelTemplate.generateReport(hotelFind)
    } catch (error) {
        console.error(error)
        throw error
    }

}

module.exports = {
    addHotel,
    listHotel,
    updateHotel,
    deleteHotel,
    signIn,
    qualifyHotel,
    generateReport
}