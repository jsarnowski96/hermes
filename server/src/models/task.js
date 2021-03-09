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
        enum: ['todo', 'in progress', 'in review', 'postponed', 'completed'],
        default: 'todo',
        required: true
    },
    dueDate: {
        type: Date,
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
    assigned_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        default: this.author
    }
});

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;