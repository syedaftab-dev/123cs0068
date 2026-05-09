const mongoose= require('mongoose');

const vehicleSchema= new mongoose.Schema({
    vehicleNo:{
        type: String,
        required: true,
        unique: true
    },
    ownerName:{
        type: String,
        required: true
    },
    serviceDate:{
        type: Date,
        required: true
    },
    model:{
        type: String
    },
    status:{
        type: String,
        enum: ['pending', 'in-progress', 'completed', 'urgent'],
        default: 'pending'
    },
    tasks:[{
        taskName: String,
        isCompleted: { type: Boolean, default: false }
    }]
},{
    timestamps: true
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
