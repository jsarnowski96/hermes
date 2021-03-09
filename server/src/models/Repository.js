const mongoose  = require('mongoose');

const RepositorySchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true,
        default: null
    },
    repository_url: {
        type: String,
        trim: true,
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
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        default: null
    },
    teams: [{type: mongoose.Schema.Types.ObjectId, ref: 'Team'}]
});

const Repository = mongoose.model('Repository', RepositorySchema);

module.exports = Repository;