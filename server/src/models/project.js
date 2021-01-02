const mongoose  = require('mongoose');

const ProjectSchema = new mongoose.Schema({
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
    owner_id: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    requirements: {
        type: String,
        required: true
    },
    due_date: {
        type: Date,
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