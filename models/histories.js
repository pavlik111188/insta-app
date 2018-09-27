var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// set up a mongoose model
var HistoriesSchema = new Schema({
    sender: {
        type: String,
        required: true
    },
    getter: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('Histories', HistoriesSchema);