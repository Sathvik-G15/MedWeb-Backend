// controllers/pharmacyController.js

const Pharmacy = require('../models/pharmacyModel');

// Create a new pharmacy
const createPharmacy = async (req, res) => {
    try {
        const { name, address, coordinates, medicines } = req.body;

        const newPharmacy = new Pharmacy({
            name,
            address,
            coordinates,
            medicines,
        });

        await newPharmacy.save();
        res.status(201).json({ message: 'Pharmacy created successfully', pharmacy: newPharmacy });
    } catch (error) {
        console.error('Error creating pharmacy:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all pharmacies
const getAllPharmacies = async (req, res) => {
    try {
        const pharmacies = await Pharmacy.find();
        res.status(200).json(pharmacies);
    } catch (error) {
        console.error('Error fetching pharmacies:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update a pharmacy
const updatePharmacy = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedPharmacy = await Pharmacy.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedPharmacy) {
            return res.status(404).json({ message: 'Pharmacy not found' });
        }
        res.status(200).json({ message: 'Pharmacy updated successfully', pharmacy: updatedPharmacy });
    } catch (error) {
        console.error('Error updating pharmacy:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete a pharmacy
const deletePharmacy = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedPharmacy = await Pharmacy.findByIdAndDelete(id);
        if (!deletedPharmacy) {
            return res.status(404).json({ message: 'Pharmacy not found' });
        }
        res.status(200).json({ message: 'Pharmacy deleted successfully' });
    } catch (error) {
        console.error('Error deleting pharmacy:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    createPharmacy,
    getAllPharmacies,
    updatePharmacy,
    deletePharmacy,
};
