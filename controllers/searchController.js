// controllers/searchController.js

const Pharmacy = require('../models/pharmacyModel');

// Function to search for medicines
const searchMedicines = async (req, res) => {
    try {
        const { medicine, location } = req.query;

        if (!medicine || !location) {
            return res.status(400).json({ message: 'Medicine name and location are required' });
        }

        // Parse location
        const [lat, long] = location.split(',').map(Number);

        // Find pharmacies with available medicines
        const pharmacies = await Pharmacy.find({
            'medicines.name': medicine
        });

        // Filter pharmacies based on proximity (example: within 5 km radius)
        const nearbyPharmacies = pharmacies.filter(pharmacy => {
            const distance = calculateDistance(lat, long, pharmacy.coordinates.lat, pharmacy.coordinates.long);
            return distance <= 5; // distance in kilometers
        });

        res.status(200).json(nearbyPharmacies);
    } catch (error) {
        console.error('Error searching for medicines:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

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

module.exports = { searchMedicines };
