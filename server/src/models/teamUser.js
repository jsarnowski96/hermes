const mongoose  = require('mongoose');

const TeamUserSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    team_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now.toString()
    }
});

const TeamUser = mongoose.model('TeamUser', TeamUserSchema);

module.exports = TeamUser;