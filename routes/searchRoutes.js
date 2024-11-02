const express = require('express');
const Pharmacy = require('../models/pharmacyModel');
const Medicine = require('../models/medicineModel');

const router = express.Router();

// Search for Medicines
// GET /search/shops?medicine=<name>
router.get('/shops', async (req, res) => {
    try {
        const { medicine } = req.query;

        if (!medicine) {
            return res.status(400).json({ message: 'Medicine name required' });
        }

        // Find matching medicines
        const medicines = await Medicine.find({ MedicineName: medicine });

        if (medicines.length === 0) {
            return res.status(404).json({ message: 'No medicines found' });
        }

        // Extract all unique userIds from the medicines list
        const userIds = medicines.map((med) => med.userId);

        // Find all pharmacies associated with these userIds
        const pharmacies = await Pharmacy.find({ userId: { $in: userIds } });

        if (pharmacies.length === 0) {
            return res.status(404).json({ message: 'No pharmacies found for this medicine' });
        }

        // Adjust the response to send only relevant information
        res.status(200).json({
            pharmacies: pharmacies.map((pharmacy) => ({
                name: pharmacy.pharmacyName,
                address: pharmacy.addressLine1,
                coordinates: pharmacy.coordinates,
                id:pharmacy.userId,
            })),
        });
    } catch (error) {
        console.error('Error searching for medicines:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Search for Pharmacy by ID
// GET /pharmacy/:id/details
router.get('/pharmacy/:id/details', async (req, res) => {
    try {
        const { id } = req.params; // Use req.params to get ID from URL

        if (!id) {
            return res.status(400).json({ message: 'Pharmacy ID is required' });
        }

        // Find the pharmacy by its user ID (or any identifier)
        const pharmacy = await Pharmacy.findOne({ userId: id });

        if (!pharmacy) {
            return res.status(404).json({ message: 'No Pharmacy found' });
        }

        const medicines = await Medicine.find({  userId: id });

        if (medicines.length === 0) {
            return res.status(404).json({ message: 'No medicines found' });
        }
               // Extract all unique userIds from the medicines list
        const MedicineNames = medicines.map((med) => med.MedicineName);
        const Medicinequantity = medicines.map((med) => med.quantity);

        res.status(200).json({
            pharmacy, // Corrected the typo
            MedicineNames,
            Medicinequantity
            
        });
    } catch (error) {
        console.error('Error fetching Pharmacy details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Helper function to calculate distance between two coordinates
const calculateDistance = (lat1, long1, lat2, long2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = degreesToRadians(lat2 - lat1);
    const dLong = degreesToRadians(long2 - long1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) *
              Math.sin(dLong / 2) * Math.sin(dLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
};

// Helper function to convert degrees to radians
const degreesToRadians = (degrees) => {
    return degrees * (Math.PI / 180);
};

module.exports = router;
