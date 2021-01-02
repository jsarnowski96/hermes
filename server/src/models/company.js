const mongoose  = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        validate: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    website: {
        type: String,
        trim: true,
        unique: true
    },
    avatar_url: {
        type: String,
        trim: true,
        default: 'localhost:3300/images/avatars/company-default.png'
    },
    owner_id: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now.toString()
    }
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;