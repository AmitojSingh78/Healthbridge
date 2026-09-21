const mongoose = require('mongoose');

const procedureProtocolSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    department:{
        type: String,
        required: true,
    },
    requiredBedType:{
        type: String,
        required: true,
    },
    requiredTests:{
        type: [String],
        default: [],
    },
    otDurationMinutes:{
        type: Number,
        required: true,
    }
},{timestamps: true});
module.exports = mongoose.model('ProcedureProtocol', procedureProtocolSchema);