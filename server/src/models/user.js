const mongoose  = require('mongoose');

const UserSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {
        type: String,
        trim: true,
        required: true,
        validate: /^[a-zA-Z0-9\-_.]+$/,
        unique: true
    },
    firstname: {
        type: String,
        trim: true,
        validate: /^[a-zA-Z_ ]+$/,
        required: true
    },
    lastname: {
        type: String,
        trim: true,
        validate: /^[a-zA-Z_ ]+$/,
        required: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        select: false
    },
    role: {
        type: mongoose.Types.ObjectId,
        default: null
    },
    position: {
        type: String,
        trim: true,
        validate: /^[a-zA-Z_ ]+$/,
        required: true
    },
    company: {
        type: String,
        trim: true,
        validate: /^[a-zA-Z0-9\-_.]+$/,
        required: true
    },
    avatar_url: {
        type: String,
        trim: true,
        default: 'localhost:3300/images/avatars/default.png'
    },
    email: {
        type: String,
        trim: true,
        validate: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        trim: true,
        validate: /^\+?([0-9]{2})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{3}?[-. ]?([0-9]{3}))$/,
        validate: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{3})$/,
        validate: /^([0-9]{9})$/,
        required: true,
        unique: true
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    }
}, {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.password;
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;