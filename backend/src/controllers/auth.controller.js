const UserModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// REGISTER USER 
async function registerUser(req, res) {
    try {
        const { fullname: { firstname, lastname }, password, email } = req.body;

        const IsUserAlreadyExist = await UserModel.findOne({ email });
        if (IsUserAlreadyExist) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new UserModel({
            email,
            password: hashedPassword,
            fullname: {
                firstname,
                lastname
            }
        });

        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);

        // 🔥 FIXED COOKIE SETTINGS
        res.cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            sameSite: 'none',  // Cross-site ke liye zaroori hai
            secure: true       // Render pe HTTPS hai isliye true hi rakho
        });

        console.log(`User Logged In: ${user.email} (${user._id})`);

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                email: user.email,
                firstname: user.fullname.firstname,
                lastname: user.fullname.lastname
            },
            token
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

// LOGIN USER
async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);

        // 🔥 FIXED COOKIE SETTINGS
        res.cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            sameSite: 'none',  // Cross-site ke liye zaroori hai
            secure: true       // Render pe HTTPS hai isliye true hi rakho
        });

        console.log(`User Logged In: ${user.email} (${user._id})`);

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                email: user.email,
                firstname: user.fullname.firstname,
                lastname: user.fullname.lastname
            },
            token
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

// LOGOUT USER 
async function logoutUser(req, res) {
    try {
        if (req.user) {
            console.log(`User Logged Out: ${req.user.email}`);
        }

        // 🔥 LOGOUT MEIN BHI SAME SETTINGS CHAHIYE DELETE KARNE KE LIYE
        res.cookie("token", null, {
            httpOnly: true,
            expires: new Date(Date.now()),
            sameSite: 'none',
            secure: true
        });

        res.status(200).json({
            message: "Logged out successfully",
            user: req.user ? req.user.email : "Unknown"
        });

    } catch (error) {
        console.log("Logout Error:", error);
        res.status(500).json({ message: "Error logging out" });
    }
}

// UPDATE USER PROFILE 
async function updateUserProfile(req, res) {
    try {
        const userId = req.user._id;
        const { firstname, lastname, password } = req.body;

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (firstname) user.fullname.firstname = firstname;
        if (lastname) user.fullname.lastname = lastname;

        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();
        console.log(`User Updated : ${user.email}`);

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                email: user.email,
                firstname: user.fullname.firstname,
                lastname: user.fullname.lastname
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

async function sendForgotPasswordOtp(req, res) {
    try {
        const { email } = req.body;

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found with this email" });
        }

        const otp = Math.floor(1000 + Math.random() * 9000);

        user.resetPasswordOtp = otp;
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        const mailOptions = {
            from: process.env.EMAIL_USER || 'tera_email@gmail.com', // Fix: Use env if available
            to: user.email,
            subject: 'Password Reset OTP - Cortex AI',
            text: `Hello ${user.fullname.firstname},\n\nYour OTP for password reset is: ${otp}\n\nThis OTP is valid for 10 minutes.\nDo not share this with anyone.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Error sending email" });
            }
            res.status(200).json({ message: "OTP sent to your email successfully" });
        });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

async function verifyOtpAndResetPassword(req, res) {
    try {
        const { email, otp, newPassword } = req.body;

        const user = await UserModel.findOne({
            email,
            resetPasswordOtp: otp,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid OTP or OTP has expired" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetPasswordOtp = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ message: "Password reset successfully! You can now login." });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

async function getMe(req, res) {
    try {
        const user = await UserModel.findById(req.user._id).select('-password');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            user: {
                id: user._id,
                email: user.email,
                firstname: user.fullname.firstname,
                lastname: user.fullname.lastname
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}

module.exports = { 
    registerUser, 
    loginUser, 
    logoutUser, 
    updateUserProfile, 
    sendForgotPasswordOtp, 
    verifyOtpAndResetPassword, 
    getMe 
};