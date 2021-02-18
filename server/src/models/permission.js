const mongoose  = require('mongoose');

const PermissionSchema = new mongoose.Schema({
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
    _create: {
        type: Boolean,
        required: true,
        default: function() {
            if(this.is_owner === true) {
                return true;
            } else {
                return false;
            }
        }
    },
    _read: {
        type: Boolean,
        required: true,
        default: function() {
            if(this.is_owner === true) {
                return true;
            } else {
                return false;
            }
        }
    },    
    _update: {
        type: Boolean,
        required: true,
        default: function() {
            if(this.is_owner === true) {
                return true;
            } else {
                return false;
            }
        }
    },
    _delete: {
        type: Boolean,
        required: true,
        default: function() {
            if(this.is_owner === true) {
                return true;
            } else {
                return false;
            }
        }
    },
    is_owner: {
        type: Boolean,
        required: true,
        default: false
    },

    can_invite: {
        type: Boolean,
        required: true,
        default: function() {
            if(this.is_owner === true) {
                return true;
            } else {
                return false;
            }
        }
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

const Permission = mongoose.model('Permission', PermissionSchema);

module.exports = Permission;