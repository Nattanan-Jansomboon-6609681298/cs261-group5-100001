const RequestModel = require('../models/requestModel');

// Controller function to handle receiving a request submission
exports.createRequest = async (req, res) => {
    try {
        // Extract data from the request body
        const {
            fname,
            lname,
            id,
            year,
            addressNumber,
            district,
            country,
            province,
            phoneNumber,
            phoneParent,
            teacher,
            courseSection,
            courseCode,
            courseName,
            section,
            reason,
            signName,
            date,
            status
        } = req.body;

        // Validate required fields
        if (!fname || !lname || !id || !year || !reason || !signName || !date) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        // Create a new request instance
        const newRequest = new RequestModel({
            fname,
            lname,
            id,
            year,
            addressNumber,
            district,
            country,
            province,
            phoneNumber,
            phoneParent,
            teacher,
            courseSection,
            courseCode,
            courseName,
            section,
            reason,
            signName,
            date,
            status: status || 'Pending',
            createdAt: new Date()
        });

        // Save the request to the database
        await newRequest.save();

        // Send a success response
        res.status(201).json({ message: 'Request submitted successfully.', request: newRequest });
    } catch (error) {
        // Handle errors
        console.error('Error creating request:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};