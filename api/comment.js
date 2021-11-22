const mongoose = require('mongoose');

const userCommentSchema = new mongoose.Schema({

    article: {
        required: true,
        type: Number,
    },

    name: {
        require: true,
        type: String
    },
    comment: {
        require: true,
        type: String
    },
    date: {
        require: true,
        type: Number,
    }
});


userCommentSchema.virtual('id').get( function() {
    return this._id.toHexString();
});

userCommentSchema.set('toJSON', {
    virtuals: true,
});



exports.userComment = mongoose.model('user-comments', userCommentSchema);

