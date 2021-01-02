const mongoose  = require('mongoose');

const PermissionSchema = new mongoose.Schema({
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
    read: {
        type: Boolean,
        required: true,
        default: true
    },
    write: {
        type: Boolean,
        required: true,
        default: true
    },
    modify: {
        type: Boolean,
        required: true,
        default: false
    },
    canInvitePeople: {
        type: Boolean,
        required: true,
        default: function() {
            if(this.modify === true) {
                return true;
            } else {
                return false;
            }
        }
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now.toString()
    }
});

const Permission = mongoose.model('Permission', PermissionSchema);

module.exports = Permission;