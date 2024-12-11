import { User } from "../models/userModel.js";
import generateToken from "../utills/generateToken.js";
import TryCatch from "../utills/Trycatch.js";
import getDataUrl from "../utills/urlGenerator.js";
import bcrypt from "bcrypt";
import cloudinary from "cloudinary";

export const registerUser = TryCatch(async (req, res) => {
    const { name, email, password, gender } = req.body;
    const file = req.file;

    if (!name || !email || !password || !gender || !file) {
        return res.status(400).json({
            message: "Please fill all the fields",
        });
    }

    let user = await User.findOne({ email });

    if (user) {
        return res.status(400).json({
            message: "User Already Exists",
        });
    }

    const fileUrl = getDataUrl(file);
    const hashPassword = await bcrypt.hash(password, 10);

    // Upload to Cloudinary and handle error
    let mycloud;
    try {
        mycloud = await cloudinary.v2.uploader.upload(fileUrl.content);
    } catch (error) {
        return res.status(500).json({
            message: "Error uploading image to Cloudinary",
            error: error.message,
        });
    }

    user = await User.create({
        name,
        email,
        password: hashPassword,
        gender,
        profilePic: {
            id: mycloud.public_id,
            url: mycloud.secure_url,
        },
    });

    generateToken(user._id, res);

    res.status(201).json({
        message: "User Registered",
        user,
    });
});

export const loginUser = TryCatch(async (req, res) => {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({
            message: "Invalid credentials",
        });
    }

    // Compare passwords
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
        return res.status(400).json({
            message: "Invalid credentials",
        });
    }

    generateToken(user._id, res);

    res.json({
        message: "User Logged In",
        user,
    });
});

export const logoutUser=TryCatch((req,res)=>{
    res.cookie("token","",{maxAge:0})
    res.json({
        message:"Log out Successfully",
    })
})