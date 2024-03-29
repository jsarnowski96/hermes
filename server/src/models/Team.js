const mongoose  = require('mongoose');

const TeamSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        validate: /^[ążśźęćńółĄŻŚŹĘĆŃÓŁA-Za-z0-9!@#$%^&*()_+\-=,./;'\\[\]<>?:"|{} ]{1,50}$/,
        trim: true,
        required: true,
        unique: true
    },
    description: {
        type: String,
        validate: /^.{1,500}$/gm,
        trim: true,
        required: true
    },
    avatar_url: {
        type: String,
        trim: true,
        default: 'localhost:3300/images/avatars/team-default.png'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        default: '602d8a48870e03d188362605',
        ref: 'Category',
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
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
    }
});

const Team = mongoose.model('Team', TeamSchema);

module.exports = Team;
