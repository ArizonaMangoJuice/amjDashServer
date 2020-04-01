let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let pageSchema = new Schema({
    title: {type: String, required: true},
    linkName: {type: String, required: true, unique: true},
    body: {type: Array},
    date: {type: Date, default: Date.now},
    pictures: Array,
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    picture: {type: String}
})

module.exports = mongoose.model('Page', pageSchema);