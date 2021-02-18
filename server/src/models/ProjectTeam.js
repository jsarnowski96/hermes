const mongoose  = require('mongoose');

const ProjectTeamSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
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

const ProjectTeam = mongoose.model('ProjectTeam', ProjectTeamSchema);

module.exports = ProjectTeam;