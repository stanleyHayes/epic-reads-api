import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from "../models/user.model.js";

const register = async (req, res) => {
    try {
        const {first_name, last_name, email, password, phone_number} = req.body;
        if (!first_name || !last_name || !email || !password || !phone_number) {
            return res.status(400).json({
                message: 'Missing required fields'
            });
        }
        const existingEmail = await User.findOne({email});
        if (existingEmail) {
            return res.status(400).json({
                message: `Email ${email} already exists`
            });
        }
        const existingPhoneNumber = await User.findOne({phone_number});
        if (existingPhoneNumber) {
            return res.status(400).json({
                message: `Phone number ${phone_number} already exists`
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10, null, null);
        const user = await User.create({
            first_name,
            last_name,
            email,
            password: hashedPassword,
            phone_number
        });
        const token = await jwt.sign({_id: user.id, email: user.email}, process.env.JWT_SECRET, {expiresIn: "30d"});
        user.auth.token = token;
        await user.save();
        return res.status(201).json({
            data: user,
            token,
            message: 'Account created successfully'
        });
    } catch (e) {
        res.status(500).json({message: e.message});
    }
}
// login
const login = async (req, res) => {
    try {
        const {password, phone_or_email} = req.body;
        const user = await User.findOne({
            $or: [{email: phone_or_email}, {phone_number: phone_or_email}]
        });
        if (!user) {
            return res.status(401).json({
                message: 'Authentication failed'
            });
        }
        const match = await bcrypt.compare(password, user.password, null, null);
        if (!match) {
            return res.status(401).json({
                message: 'Authentication failed'
            });
        }
        const token = await jwt.sign({_id: user.id, email: user.email}, process.env.JWT_SECRET, {expiresIn: "30d"});
        user.auth.token = token;
        await user.save();
        return res.status(200).json({
            data: user,
            token,
            message: 'logged in successfully'
        });
    } catch (e) {
        res.status(500).json({message: e.message});
    }
}

const changePassword = async (req, res) => {
    try {

    } catch (e) {

    }
}

export {register, login, changePassword};

// reset password
// forgot password
// resend otp
// verify otp
// logout
// logoutAll
// update profile
// change password
// delete profile