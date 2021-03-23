const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({



    method:{
        type:String,
        required:true
    },

    url:{
        type:String,
        required:true
    },
    created: {
        type: Date,
        default: Date.now
    },

});


module.exports = mongoose.model('Request', requestSchema);
