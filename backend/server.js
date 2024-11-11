// // backend/server.js

// const express = require('express');
// const mongoose = require('mongoose');
// const path = require('path');
// const authRoutes = require('./routes/auth');
// const storiesRoutes = require('./routes/stories');

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware to parse JSON requests
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Serve static files from the frontend directory
// app.use(express.static(path.join(__dirname, '../')));

// // Use routes
// app.use('/api/auth', authRoutes);
// app.use('/api/stories', storiesRoutes);

// // After the mongoose connection
// mongoose.connect('mongodb://localhost:27017/user', { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => {
//         console.log('MONGODB connection successful !!!');
//     })
//     .catch(err => {
//         console.error('MONGODB connection error:', err);
//     });

// // In the signup route
// app.post("/signup", async (req, res) => {
//     try {
//         const { fullName, email, password } = req.body; // Destructure from req.body
//         const user = new User({
//             fullName,
//             email,
//             password
//         });
//         await user.save();
//         console.log(user);
//         res.send("User  has successfully signed up!!");
//     } catch (error) {
//         console.error('Signup error:', error);
//         res.status(400).send("Error signing up user: " + error.message);
//     }
// });

// fetch('/signup', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//         fullName: 'John Doe',
//         email: 'john@example.com',
//         password: 'securepassword'
//     })
// })
// .then(response => response.text())
// .then(data => {
//     console.log(data);
// })
// .catch(error => {
//     console.error('Error:', error);
// });

// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, '../index.html'));
// });

// app.get("/login-signup.html", (req, res) => {
//     res.sendFile(path.join(__dirname, '../login-signup.html'));
// });

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });





const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const nodemailer = require('nodemailer');


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const path = require('path');

app.use(express.json());
app.use(express.static('public'));

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend/index.html')));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/newUser', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// User Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String
});

// User Model
const User = mongoose.model('User ', userSchema);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});


// Sign Up Route
app.post('/login-signup.html', async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    // Validate input
    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).send('All fields are required');
    }

    if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not match');
    }

    try {
        // Check if user already exists
        const existingUser  = await User.findOne({ email });
        if (existingUser ) {
            return res.status(400).send('User  already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser  = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser .save();
        res.status(201).send('User  registered successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});





app.get('/mentor.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/E-mentoring/frontend/mentor.html'));
});

app.post('/api/contact-mentor', async (req, res) => {
    try {
        const { mentorName, mentorEmail, studentName, studentEmail, message } = req.body;

        // Validate input
        if (!mentorName || !mentorEmail || !studentName || !studentEmail || !message) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Email to mentor
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: mentorEmail,
            subject: `New Mentorship Request from ${studentName}`,
            text: `
                You have received a new mentorship request:
                
                From: ${studentName}
                Email: ${studentEmail}
                
                Message:
                ${message}
                
                Please respond to the student directly at their email address.
            `
        });

        // Confirmation email to student
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: studentEmail,
            subject: 'Mentorship Request Confirmation',
            text: `
                Dear ${studentName},
                
                Your mentorship request has been sent to ${mentorName}.
                They will contact you soon at this email address.
                
                Your message:
                ${message}
                
                Best regards,
                EduMentor Team
            `
        });

        res.json({
            success: true,
            message: 'Your message has been sent successfully!'
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while sending your message'
        });
    }
});



app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});