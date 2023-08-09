const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
    conversationId: {
        type: String,
        required: true
    },
    productId: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    receiver: {
        type: String,
        required: true
    },
    message: {
        type: String,
    }
},{ timestamps: true});

const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;