const mongoose=require('mongoose');

const notificationSchema=new mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    originalId:{
        type: String,
        unique: true,
        sparse: true
    },
    title:{
        type: String,
        required: true
    },
    message:{
        type: String,
        required: true
    },
    type:{
        type: String,
        enum: ['info','reminder','success','error'],
        default: 'info'
    },
    isRead:{
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);
