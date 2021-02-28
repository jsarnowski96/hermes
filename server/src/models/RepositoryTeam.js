const mongoose  = require('mongoose');

const RepositoryTeamSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    repository: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Repository',
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

const RepositoryTeam = mongoose.model('RepositoryTeam', RepositoryTeamSchema);

module.exports = RepositoryTeam;