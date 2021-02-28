const mongoose  = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        validate: /^[ążśźęćńółĄŻŚŹĘĆŃÓŁA-Za-z0-9!@#$%^&*()_+\-=,./;'\\[\]<>?:"|{} ]{1,50}$/,
        trim: true,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    requirements: {
        type: String,
        validate: /^.{1,500}$/,
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
    default_role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        default: function() {
            if(this.restricted_access === true && this.restricted_access !== null) {
                return null
            } else {
                return '602d82fb870e03d1883625fc'
            }
        },
        required: true,
    },
    restricted_access: {
        type: Boolean,
        default: false,
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
    }
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;