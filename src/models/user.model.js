import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
        first_name: {type: String, required: true, trim: true},
        last_name: {type: String, required: true, trim: true},
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error(`Invalid email address: ${value}`);
                }
            }
        },
        phone_number: {
            unique: true,
            type: String,
            required: true,
            trim: true,
            validate(value) {
                if (!validator.isMobilePhone(value)) {
                    throw new Error(`Invalid phone number: ${value}`);
                }
            }
        },
        password: {
            type: String,
            required: true,
            trim: true,
            validate(value) {
                if (!validator.isStrongPassword(value)) {
                    throw new Error(`Weak password: ${value}. Your password must include lowercase, uppercase, digits, symbols and must be at least 8 characters`);
                }
            }
        },
        gender: {
            type: String,
            enum: ['MALE', 'FEMALE']
        },
        auth: {
            token: {
                type: String
            },
            otp: {
                type: String
            }
        },
        address: {
            type: String
        }
    }, {
        timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
        toJSON: {virtuals: true},
        toObject: {virtuals: true}
    }
);

const User = mongoose.model('User', userSchema);
export default User;