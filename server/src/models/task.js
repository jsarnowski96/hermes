const mongoose  = require('mongoose');

const TaskSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    status: {
        type: String,
        enum: ['To do', 'In progress', 'In review', 'Postponed', 'Done'],
        trim: true,
        required: true,
        default: 'To do'
    },
    dueDate: {
        type: Date,
        required: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
        default: '602d89ff870e03d188362604'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    teams: [{type: mongoose.Schema.Types.ObjectId, ref: 'Team'}],
    assigned_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: this.author
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

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;