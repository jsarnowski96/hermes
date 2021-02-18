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
        default: '602d82fb870e03d1883625fc',
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