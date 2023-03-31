const mongoose = require('mongoose');
const Schema = mongoose.Schema

const PostSchema = new Schema({
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        require: true,
         max: 50,
        unique: true,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female','Other']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
})

module.exports = mongoose.model('posts', PostSchema)