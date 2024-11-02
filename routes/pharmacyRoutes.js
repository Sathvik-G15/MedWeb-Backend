// routes/pharmacyRoutes.js

const express = require('express');
const Pharmacy = require('../models/pharmacyModel');
const User = require('../models/userModel');

const router = express.Router();

// Get Pharmacies
// GET /api/pharmacies
router.get('/', async (req, res) => {
    const { userIdentification } = req.query; // Get userIdentification from query parameters

    try {
        const pharmacies = await Pharmacy.find({ userIdentification });

        if (!pharmacies.length) {
            return res.status(404).json({ message: 'No pharmacies found' });
        }

        res.status(200).json(pharmacies);
    } catch (error) {
        console.error('Error fetching pharmacies:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Add New Pharmacy Address
// POST /api/pharmacies/address
router.post('/address', async (req, res) => {
    const {
        userIdentification,
        pharmacyName,
        contactDetails,
        addressLine1,
        addressLine2,
        city,
        state,
        zipCode,
        coordinates,
        country,
    } = req.body; // Destructure request body

    try {
        const parsedCoordinates = coordinates.split(',').map(coord => parseFloat(coord.trim()));

        if (parsedCoordinates.length !== 2 || isNaN(parsedCoordinates[0]) || isNaN(parsedCoordinates[1])) {
            return res.status(400).json({ message: 'Invalid coordinates format' });
        }

        const [lng, lat] = parsedCoordinates; // Ensure correct order: [longitude, latitude]
        const user = await User.findOne({ email: userIdentification }); // Fetch user by email

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newPharmacy = new Pharmacy({
            userId: user._id,
            userIdentification,
            pharmacyName,
            contactDetails,
            addressLine1,
            addressLine2,
            city,
            state,
            zipCode,
            country,
            coordinates: {
                type: 'Point',
                coordinates: [lng, lat], // Store coordinates in GeoJSON format
            },
        });

        await newPharmacy.save();
        res.status(201).json({ message: 'Pharmacy Address registered successfully' });
    } catch (error) {
        console.error('Error registering Pharmacy Address:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update Pharmacy
// PUT /api/pharmacies/:id
router.put('/:id', async (req, res) => {
    const { id } = req.params; // Get pharmacy ID from params
    const updates = req.body; // Get updates from request body

    try {
        const updatedPharmacy = await Pharmacy.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedPharmacy) {
            return res.status(404).json({ message: 'Pharmacy not found' });
        }

        res.status(200).json({ message: 'Pharmacy updated successfully', pharmacy: updatedPharmacy });
    } catch (error) {
        console.error('Error updating pharmacy:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete Pharmacy
// DELETE /api/pharmacies/:id
router.delete('/:id', async (req, res) => {
    const { id } = req.params; // Get pharmacy ID from params

    try {
        const deletedPharmacy = await Pharmacy.findByIdAndDelete(id);

        if (!deletedPharmacy) {
            return res.status(404).json({ message: 'Pharmacy not found' });
        }

        res.status(200).json({ message: 'Pharmacy deleted successfully' });
    } catch (error) {
        console.error('Error deleting pharmacy:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
