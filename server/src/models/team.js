const mongoose  = require('mongoose');

const TeamSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    category: {
        type: String,
        trim: true,
        required: true
    },
    avatar_url: {
        type: String,
        trim: true,
        default: 'localhost:3300/images/avatars/team-default.png'
    },
    owner_id: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    org_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now.toString()
    }
});

const Team = mongoose.model('Team', TeamSchema);

module.exports = Team;