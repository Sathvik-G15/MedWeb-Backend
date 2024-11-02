const express = require('express');
const multer = require('multer'); // For handling file uploads
const path = require('path');
const User = require('../models/userModel');
const Pharmacy = require('../models/pharmacyModel');
const router = express.Router();

// Configure Multer for profile picture uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save files in the 'uploads' directory
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });

// // User Registration Route
// router.post('/register', upload.single('profilePicture'), async (req, res) => {
//     try {
//         const { name, email, password, coordinates, formattedAddress, pharmacyName  } = req.body; // Include address and coordinates
//         const profilePicture = req.file ? req.file.filename : '../uploads/Default_pfp.jpg';

//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: 'User already exists' });
//         }
//         let parsedCoordinates = coordinates.split(',').map(coord => parseFloat(coord.trim()));

//         if (parsedCoordinates.length !== 2 || isNaN(parsedCoordinates[0]) || isNaN(parsedCoordinates[1])) {
//           return res.status(400).json({ message: 'Invalid coordinates format' });
//         }
    
//         // Ensure correct order: [longitude, latitude]
//         const [lat, lng] = parsedCoordinates;
//         parsedCoordinates = [lng, lat];
    
//         const newUser = new User({
//             name,
//             email,
//             password,
//             formattedAddress,
//             pharmacyName,
//             profilePicture,
//             coordinates: {
//                 type: 'Point', // Set type to 'Point'
//                 coordinates: parsedCoordinates // Parse coordinates from string to array
//             }
//         });

//         await newUser.save();
//         res.status(201).json({ message: 'User registered successfully' });
//     } catch (error) {
//         console.error('Error registering user:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

// User Registration Route
router.post('/register', upload.single('profilePicture'), async (req, res) => {
    try {
        const { name, email, password } = req.body; // Include address and coordinates
        const profilePicture = req.file ? req.file.filename : 'Default_pfp.jpg';

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
    
        const newUser = new User({
            name,
            email,
            password,
            profilePicture
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// User Login Route
// POST /auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Verify password (assuming direct comparison for now)
        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        let userIdentification =email;
        // Check if pharmacy details exist for the user
        const pharmacy = await Pharmacy.findOne({ userIdentification });
        // Set session
        req.session.userId = user._id;

        // Return email along with success message and pharmacy details status
        res.status(200).json({ 
            message: 'Login successful', 
            email: user.email,
            hasPharmacyDetails: !!pharmacy, // True if pharmacy exists, false otherwise
            profile:user.profilePicture,
            newUser:user,
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



// User Logout Route
// POST /auth/logout
router.post('/logout', (req, res) => {
    req.session = null; // Destroy session
    res.status(200).json({ message: 'Logout successful' });
});

module.exports = router;
