const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    procedure: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'planned', 'approved', 'admitted', 'completed', 'cancelled'],
        default: 'pending'
    },
    date: {
        type: Date,
        default: Date.now
    },
    bed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bed',
        default: null
    },
    OT: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OperationTheatre',
        default: null
    },
    OTTime: {
        type: Date,
        default: null
    },
    labOrders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LabOrder'
    }],
    insuranceStatus: {
        type: String,
        enum: ['pending', 'approved', 'denied'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Admission', admissionSchema);