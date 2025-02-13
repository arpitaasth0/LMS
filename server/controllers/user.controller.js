import {User} from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const {name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                    success: false,
                    message: "All fields are required."
                }
            )}
     
      const user = await User.findOne({email});
      if(user){
        return res.status(400).json({
            success:false,
            message:"user already exist with this email."
        })
      }
      
      const hashedPassword = await bcrypt.hash(password,10);
      await User.create({
        name,
        email,
        password:hashedPassword
      });

      return res.status(201).json({
        success:true,
        message:"account created successfully"
      })
    } catch (error) {
        console.error("Registration Error:", error); // Log error in the console
        return res.status(500).json({
            success: false,
            message: "Failed to register",
            error: error.message, // Send the error message for debugging
        });
    }
    }



export const login = async (req,res) => {
    try{
        const {email,password} = req.body;

        if ( !email || !password) {
            return res.status(400).json({
                    success: false,
                    message: "All fields are required."
                }
            )}

            const user =  await User.findOne({email});
            if(!user){
                return res.status(400).json({
                    success:false,
                    message:"incorrect email or password"
                })
            }

            const isPasswordMatch = await bcrypt.compare(password,user.password);
             if(!isPasswordMatch){
                return res.status(400).json({
                    success:false,
                    message:"incorrect email or password"
                })
             }

             generateToken(res,user,`Welcome back ${user.name}`);

    }catch (error) {
        console.error("Login Error:", error); // Log the actual error for debugging
        return res.status(500).json({
            success: false,
            message: "Failed to login",
            error: error.message // Send the error message for debugging
        });
    }
}

export const logout = async (_,res) => {
    try {
        return res.status(200).cookie("token", "", {maxAge:0}).json({
            message:"Logged out successfully.",
            success:true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to logout"
        }) 
    }
}


export const getUserProfile = async (req,res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).select("-password").populate("enrolledCourses");
        if(!user){
            return res.status(404).json({
                message:"Profile not found",
                success:false
            })
        }
        return res.status(200).json({
            success:true,
            user
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to load user"
        })
    }
}




export const updateProfile = async (req, res) => {
    try {
        const userId = req.id; // Fix: Get user ID from req.user
        const { name } = req.body;
        const profilePhoto = req.file;

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        let photoUrl = user.photoUrl; // Default to existing photo URL

        // Delete old image from Cloudinary if a new one is uploaded
        if (profilePhoto) {
            if (user.photoUrl) {
                const publicId = user.photoUrl.split("/").pop().split(".")[0];
                await deleteMediaFromCloudinary(publicId); // Ensure this function is `await`ed
            }

            // Upload new photo
            const cloudResponse = await uploadMedia(profilePhoto.path);
            photoUrl = cloudResponse.secure_url;
        }

        // Update user data
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, photoUrl },
            { new: true }
        ).select("-password");

        return res.status(200).json({
            success: true,
            user: updatedUser,
            message: "Profile updated successfully."
        });

    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update profile"
        });
    }
};
