const mongoose  = require('mongoose');

const RoleSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    permission: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        default: '60410b6d09e427156be2067b',
        ref: 'Permission'
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

const Role = mongoose.model('Role', RoleSchema);

module.exports = Role;