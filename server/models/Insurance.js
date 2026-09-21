const mongoose = require('mongoose');

const insuranceSchema = new mongoose.Schema({
    patient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    provider:{
        type:String,
        required: true
    },
    status:{
        type:String,
        enum:['active','inactive','expired'],
        default:'active'
    },
    coverage:{
        type:Number,
        required: true
    },
    preAuthorizationRequired:{
        type:Boolean,
        default:false
    },
    preAuthorizationStatus:{
        type:String,
        enum:['pending','approved','denied'],
        default:'pending'
    },
},{timestamps: true});

module.exports = mongoose.model('Insurance', insuranceSchema);