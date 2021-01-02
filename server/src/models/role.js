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
    permission_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Permission'
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now.toString()
    }
});

const Role = mongoose.model('Role', RoleSchema);

module.exports = Role;