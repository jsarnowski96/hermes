const mongoose  = require('mongoose');

const CompanySchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        trim: true,
        validate: /^[ążśźęćńółĄŻŚŹĘĆŃÓŁA-Za-z0-9!@#$%^&*()_+\-=,./;'\\[\]<>?:"|{} ]{1,50}$/,
        required: true,
        unique: true
    },
    description: {
        type: String,
        validate: /^.{1,150}$/,
        trim: true,
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
        validate: /^\(?([0-9]{2})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{3}?[-. ]?([0-9]{3}))$/,
        validate: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{3})$/,
        validate: /^([0-9]{9})$/,
        required: true
    },
    website: {
        type: String,
        trim: true,
        validate: /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)?/gi,
        unique: true
    },
    avatar_url: {
        type: String,
        trim: true,
        default: 'localhost:3300/images/avatars/company-default.png'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    organizations: [{type: mongoose.Schema.Types.ObjectId, ref: 'Organization'}],
    modified_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const Company = mongoose.model('Company', CompanySchema);

module.exports = Company;