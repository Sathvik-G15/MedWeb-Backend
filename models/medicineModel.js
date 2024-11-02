// models/medicineModel.js

const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pharmacy',
    },

    MedicineName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
    },
});

const Medicine = mongoose.model('Medicine', medicineSchema);
module.exports = Medicine;
