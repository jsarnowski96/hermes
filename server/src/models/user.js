const mongoose  = require('mongoose');

const UserSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {
        type: String,
        trim: true,
        required: true,
        validate: /^[a-zA-Z0-9\-_.]{1,20}$/,
        unique: true
    },
    firstname: {
        type: String,
        trim: true,
        validate: /^[ążśźęćńółĄŻŚŹĘĆŃÓŁa-zA-Z\- ]{1,20}$/,
        required: true
    },
    lastname: {
        type: String,
        trim: true,
        validate:/^[ążśźęćńółĄŻŚŹĘĆŃÓŁa-zA-Z\- ]{1,20}$/,
        required: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        select: false
    },
    position: {
        type: String,
        trim: true,
        validate: /^[ążśźęćńółĄŻŚŹĘĆŃÓŁa-zA-Z\- ]{1,30}$/,
        required: true
    },
    email: {
        type: String,
        trim: true,
        validate: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
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
        required: true
    },
    avatar_url: {
        type: String,
        trim: true,
        default: 'localhost:3300/images/avatars/default.png'
    },
    modified_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
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