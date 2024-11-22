import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

// Utility function to create a JWT token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Utility function for sending error responses
const sendErrorResponse = (res, message, status = 400) => {
    res.status(status).json({ success: false, message });
};

// Route for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return sendErrorResponse(res, "User doesn't exist");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = createToken(user._id);
            res.json({ success: true, token });
        } else {
            sendErrorResponse(res, "Invalid credentials");
        }
    } catch (error) {
        console.log(error);
        sendErrorResponse(res, error.message, 500);
    }
};

// Route for user register
const registerUser = async (req, res) => {
    try {
        console.log("Incoming request body:", req.body)
        const { name, email, password } = req.body;

        // Check if user already exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            return sendErrorResponse(res, "User already exists");
        }

        // Validate email format and password strength
        if (!validator.isEmail(email)) {
            return sendErrorResponse(res, "Please enter a valid email");
        }
        if (!validator.isStrongPassword(password)) {
            return sendErrorResponse(res, "Password must include at least 8 characters, a number, and a special character");
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
        });

        const user = await newUser.save();
        const token = createToken(user._id);

        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        sendErrorResponse(res, error.message, 500);
    }
};

// Route for admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });
            res.json({ success: true, token });
        } else {
            sendErrorResponse(res, "Invalid credentials");
        }
    } catch (error) {
        console.log(error);
        sendErrorResponse(res, error.message, 500);
    }
};

export { loginUser, registerUser, adminLogin };
