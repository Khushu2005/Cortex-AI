const UserModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function registerUser(req, res) {
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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY)
    res.cookie("token", token);

    res.status(201).json({
        message: "User registered successfully", user: {
            id: user._id,
            email: user.email,
            firstname: user.fullname.firstname,
            lastname: user.fullname.lastname

        }
    });
}

async function loginUser(req, res) {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY)
    res.cookie("token", token);

    res.status(200).json({
        message: "Login successful", user: {
            id: user._id,
            email: user.email,
            firstname: user.fullname.firstname,
            lastname: user.fullname.lastname
        }
    });
}

module.exports = { registerUser, loginUser };