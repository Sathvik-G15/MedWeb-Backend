// models/pharmacyModel.js
const mongoose = require('mongoose');
// Pharmacy Schema
const pharmacySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    userIdentification:{
        type: String,
        required: true,
    },
    pharmacyName: {
        type: String,
        required: true,
    },
    
    contactDetails: {
        type: String,
        required: true,
    },

    addressLine1: {
        type: String,
        required: true,
    },
    addressLine2: {
        type: String,
    },

    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    zipCode: {
        type: String,
        required: true,
    },

    country: {
        type: String,
        required: true,
    },

    coordinates: {
        type: {
            type: String,
            enum: ['Point'], // 'Point' for geospatial index
            required: true,
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
        },
    },

});

// Create geospatial index for coordinates
pharmacySchema.index({ coordinates: '2dsphere' });
const Pharmacy = mongoose.model('Pharmacy', pharmacySchema);

module.exports = Pharmacy;
