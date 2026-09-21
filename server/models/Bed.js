const mongoose = require('mongoose');

const bedSchema = new mongoose.Schema({
    bedNumber: {
        type: String,
        required: true,
        unique: true,
    },
    ward: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['available', 'occupied', 'maintenance'],
        default: 'available',
    },
    currentPatient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
},{timestamps: true});
module.exports = mongoose.model('Bed', bedSchema);