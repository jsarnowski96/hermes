const mongoose  = require('mongoose');

const ProjectUserSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    project_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now()
    }
});

const ProjectUser = mongoose.model('ProjectUser', ProjectUserSchema);

module.exports = ProjectUser;