'use strict'

const {Schema,model,Types} = require('mongoose');

const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'Keys'

// Declare the Schema of the Mongo model
var keyTokenSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        required:true,
        ref: 'Shop'
    },
    public_key:{
        type:String,
        required:true
    },
    refresh_token:{
        type:Array,
        default:[]
    },
},{
    collection: COLLECTION_NAME,
    timestamps: true

});

//Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);
