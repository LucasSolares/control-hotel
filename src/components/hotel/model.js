const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({

    name: String,
    email: String,
    password: String,
    country: String,
    direction: String,
    price: Number,
    availability: Schema.Types.Date,
    imageURL: { required: true, default: 'https://www.plazapublica.com.gt/sites/default/files/hotel_radisson.jpg', type: String },
    qualification: { type: Number, required: false, default: 0 },

})

module.exports = mongoose.model('hotel', schema)