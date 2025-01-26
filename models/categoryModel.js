const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    color: {
        type: String,
        required: false
    },
    icon: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});


const Category = mongoose.model('Category', categorySchema);

module.exports = Category;