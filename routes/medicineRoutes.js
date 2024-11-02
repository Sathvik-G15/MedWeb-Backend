// routes/medicineRoutes.js

const express = require('express');
const Medicine = require('../models/medicineModel');
const Pharmacy = require('../models/pharmacyModel');
const router = express.Router();
// Get all medicines for a specific user
router.get('/', async (req, res) => {
    try {
        const { userId } = req.query; // Get userId from the query params
        if (!userId) return res.status(400).json({ message: 'User ID is required' });

        const medicines = await Medicine.find({ userId });
        res.status(200).json(medicines);
    } catch (err) {
        console.error('Error fetching medicines:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Add New Medicine
// POST /api/medicines/add
// Add New Medicine
// POST /api/medicines/add
router.post('/add', async (req, res) => {
    try {
        const { MedicineName, quantity,user } = req.body; // Changed name to MedicineName


        const pharmacy = await Pharmacy.findOne({ userIdentification: user });
        if (!pharmacy) {
            return res.status(404).json({ message: 'Pharmacy not found' });
        }
        console.log("MedicineName:", MedicineName);
        console.log("Quantity:", quantity);
        const newMedicine = new Medicine({
            userId:pharmacy.userId,
            MedicineName, // Changed name to MedicineName
            quantity,
        });

        await newMedicine.save();
        res.status(201).json({ message: 'Medicine added successfully', medicine: newMedicine });
    } catch (error) {
        console.error('Error adding medicine:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Update Medicine
// PUT /api/medicines/update/:id
router.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { MedicineName, quantity } = req.body; // Changed name to MedicineName

        // Find medicine by ID and update
        const updatedMedicine = await Medicine.findByIdAndUpdate(
            id,
            { MedicineName, quantity }, // Changed name to MedicineName
            { new: true, runValidators: true }
        );

        if (!updatedMedicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }

        res.status(200).json({ message: 'Medicine updated successfully', medicine: updatedMedicine });
    } catch (error) {
        console.error('Error updating medicine:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete Medicine
// DELETE medicines/:id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedMedicine = await Medicine.findByIdAndDelete(id);
        if (!deletedMedicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }

        res.status(200).json({ message: 'Medicine deleted successfully' });
    } catch (error) {
        console.error('Error deleting medicine:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
