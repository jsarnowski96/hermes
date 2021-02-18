const mongoose  = require('mongoose');

const CategorySchema = new mongoose.Schema({
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
    category_type: {
        type: String,
        enum: ['team', 'project', 'task'],
        required: true,
        trim: true,
        default: ['project']
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

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;