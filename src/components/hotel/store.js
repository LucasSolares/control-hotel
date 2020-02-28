const Model = require('./model')

exports.addHotel = async(hotel) => {

    try {

        return await new Model(hotel).save()

    } catch (error) {
        console.error(error)
        throw error
    }

}

exports.listHotels = async(filter, options = {}) => {

    try {
        if (options.orderBy) {
            return await Model.find(filter).sort({
                [options.orderBy]: options.asc
            })
        }
        return await Model.find(filter)
    } catch (error) {
        console.error(error)
        throw error
    }

}

exports.updateHotel = async(_id, hotelToUpdate) => {

    try {
        const hotelUpdated = await Model.findByIdAndUpdate(_id, hotelToUpdate, { new: true })
        if (!hotelUpdated) {
            throw { message: `Hotel with _id ${_id} not founded`, code: 404 }
        }
        return hotelUpdated
    } catch (error) {
        console.error(error)
        throw error
    }

}

exports.deleteHotel = async(_id) => {

    try {
        const hotelDeleted = await Model.findByIdAndDelete(_id)
        if (!hotelDeleted) {
            throw { message: `Hotel with _id ${_id} not founded`, code: 404 }
        }
        return hotelDeleted
    } catch (error) {
        console.error(error)
        throw error
    }

}