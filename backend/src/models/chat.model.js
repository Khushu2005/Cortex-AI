const moongoose = require('mongoose');

const chatSchema = new moongoose.Schema({
    user:
    {
        type: moongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },

    title: {
        type: String,
        required: true

    },
    lastActivity: {
        type: Date,
        default: Date.now
    }
},
    { timestamps: true }
);


const chatModel = moongoose.model('Chat', chatSchema);

module.exports = chatModel;