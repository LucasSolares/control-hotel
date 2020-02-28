const Model = require('./model')

exports.addUser = async(user) => {

    try {

        return await new Model(user).save()

    } catch (error) {
        console.error(error)
        throw error
    }

}

exports.listUsers = async(filter) => {

    try {
        return await Model.find(filter)
    } catch (error) {
        console.error(error)
        throw error
    }

}

exports.updateUser = async(_id, userToUpdate) => {

    try {
        const userUpdated = await Model.findByIdAndUpdate(_id, userToUpdate, { new: true })
        if (!userUpdated) {
            throw { message: `user with _id ${_id} not founded`, code: 404 }
        }
        return userUpdated
    } catch (error) {
        console.error(error)
        throw error
    }

}

exports.deleteUser = async(_id) => {

    try {
        const userDeleted = await Model.findByIdAndDelete(_id)
        if (!userDeleted) {
            throw { message: `user with _id ${_id} not founded`, code: 404 }
        }
        return userDeleted
    } catch (error) {
        console.error(error)
        throw error
    }

}