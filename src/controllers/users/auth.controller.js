import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import otpGenerator from 'otp-generator';
import validator from "validator";

import User from "../../models/user.model.js";
import moment from "moment";
import {sendEmail} from "../../utils/emails.js";


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
        if(!validator.isStrongPassword(password)){
            res.status(400).json({
                message: `Weak password: ${password}. Your password must include lowercase, uppercase, digits, symbols and must be at least 8 characters`
            })
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
        if(!user.permissions.authentication.login){
            return res.status(401).json({
                message: 'You are not allowed to access this route. Contact admin'
            });
        }
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
        const otp = otpGenerator.generate(4, {
            digits: true, lowerCaseAlphabets: false, specialChars: false, upperCaseAlphabets: false
        });
        const expiresIn = moment().add(10, 'minutes');
        user.auth.otp = {code: otp, expires_in: expiresIn};
        await user.save();
        const text = `
        Dear ${user.first_name},

            To ensure the security of your account, we need to verify your identity. Please use the One-Time Password (OTP) provided below to complete your verification process.
            
            Your OTP Code: ${otp}
            
            This code is valid for the next 10 minutes. Please do not share this code with anyone.
            
            If you did not request this verification, please contact our support team immediately at support@epicreads.com.
            
            Thank you for helping us keep your account secure.
            
            Best regards,
            
            Epic Reads Support Team
        `;
        const subject = 'Your Verification Code for Secure Access';
        await sendEmail(user.email, subject, text);
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
        const {new_password, current_password} = req.body;
        if (!current_password || !new_password) {
            return res.status(400).json({
                message: 'Missing required fields'
            });
        }
        const matches = await bcrypt.compare(current_password, req.user.password, null, null);
        if (!matches) {
            return res.status(401).json({
                message: 'Authentication failed'
            });
        }
        req.user.password = await bcrypt.hash(new_password, 10, null, null);
        await user.save();
        return res.status(200).json({
            message: 'Password changed successfully'
        })
    } catch (e) {
        res.status(500).json({message: e.message});
    }
}

const verifyEmail = async (req, res) => {}

const verifyPhoneNumber = async (req, res) => {}

export {register, login, changePassword, verifyEmail, verifyPhoneNumber};

// verify email
// verify phone number
// reset password
// forgot password
// resend otp
// verify otp
// logout
// logoutAll
// update profile
// delete profile