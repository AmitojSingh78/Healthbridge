const mongoose = require('mongoose');

const labOrderSchema = new mongoose.Schema({
    patient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Patient',
        required: true
    },
    testName:{
        type:String,
        required: true
    },
    status:{
        type:String,
        enum:['pending','completed','cancelled'],
        default:'pending'
    },
    result:{
        type:String,
        default:null
    },
    requestedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
},{timestamps: true});

module.exports = mongoose.model('LabOrder', labOrderSchema);