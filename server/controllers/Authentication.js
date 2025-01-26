import bcrypt from "bcryptjs";
import User from "../models/Users.js";
import LoginAttempt from "../models/LoginAttempt.js";
import { generateToken, getCountryFromIp } from "../helper/index.js";
import nodemailer from "nodemailer";

// Sign-Up Function
const SignUp = async (req, res) => {
  const { userName, email, password, rememberMe } = req.body;

  try {
    const userLocation = await getCountryFromIp();
    const locationObject = {
      country: userLocation?.country,
      countryCode: userLocation?.countryCode,
      region: userLocation?.regionName,
      city: userLocation?.city,
      ipAddress: userLocation?.ipAddress,
      lat: userLocation?.lat,
      lon: userLocation?.lon,
    };
    if (userName && email && password) {
      // const user = await User.findOne({ email });
      const user = await User.findOne({
        $or: [{ email: email }, { userName: userName }],
      });
      if (user) {
        return res.status(400).json({
          message: "User with the given Email/UserName already exist",
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        userName,
        email,
        password: hashedPassword,
        location: locationObject,
      });

      const token = generateToken(newUser?._id, rememberMe);
      await newUser.save();
      res.status(200).json({ user: newUser, token });
    } else {
      res.status(400).json({ message: "ALL three fields are required" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating user", error });
  }
};

// Sign-In Function
const SignIn = async (req, res) => {
  const { emailOrUsername, email, password, rememberMe } = req.body;
  let failUser, LocationObject;
  console.log("emailOrUsername:  ", emailOrUsername);
  console.log("password:  ", password)
  try {
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { userName: emailOrUsername }],
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    failUser = user;

    // Get the real IP address from the X-Forwarded-For header
    let realIp =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.connection.remoteAddress;

    // If the IP is in IPv6 format with ::ffff: prefix, remove it
    if (realIp.startsWith("::ffff:")) {
      realIp = realIp.substring(7); // Remove the "::ffff:" prefix
    }

    // Get user location based on the real IP address
    const userLocation = await getCountryFromIp(realIp);

    // Handle case where location data might be missing or incomplete
    const locationObject = userLocation
      ? {
          country: userLocation?.country,
          countryCode: userLocation?.countryCode,
          region: userLocation?.regionName,
          city: userLocation?.city,
          ipAddress: realIp, // Use the real IP here
          lat: userLocation?.lat,
          lon: userLocation?.lon,
        }
      : {};

    LocationObject = locationObject;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Record failed login attempt with incomplete locationObject in case of failure
      await new LoginAttempt({
        status: "failed",
        description: "Invalid credentials",
        location: locationObject,
        userId: user._id,
        userName: user.userName,
        email: user.email,
      }).save();
      return res.status(401).json({ message: "Invalid credentials" });
    }

    await new LoginAttempt({
      status: "success",
      description: "Login successful",
      location: locationObject,
      userId: user._id,
      userName: user.userName,
      email: user.email,
    }).save();

    // Generate JWT token
    user.location = locationObject;
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id, rememberMe); // Ensure this function is well-implemented
    res.status(200).json({ token, user });
  } catch (error) {
    // Handle unexpected errors gracefully
    await new LoginAttempt({
      status: "failed",
      description: error.message,
      location: LocationObject,
      userId: failUser?._id,
      userName: failUser?.userName,
      email: failUser?.email,
    }).save();
    res.status(500).json({ message: "An error occurred", error });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Set OTP expiration time (e.g., 10 minutes from now)
    const otpExpiration = Date.now() + 10 * 60 * 1000;
    // Update the user's record with the OTP and expiration time
    user.otp = otp;
    user.otpExpiration = otpExpiration;
    await user.save();

    // Set up nodemailer to send the OTP with HTML content
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "jawadulhassan18@gmail.com", // your email
        pass: "txdp pyrp ysnb vbiy", // your email password
      },
    });

    const mailOptions = {
      from: "adeebasajid4506@gmail.com",
      to: user.email,
      subject: "Password Reset OTP",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              padding: 20px;
            }
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            }
            h2 {
              color: #333333;
            }
            p {
              color: #666666;
              line-height: 1.5;
            }
            .otp {
              font-size: 24px;
              font-weight: bold;
              color: #e94e77;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 12px;
              color: #999999;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <h2>Password Reset Request</h2>
            <p>Dear User,</p>
            <p>You have requested to reset your password. Please use the following OTP code to proceed:</p>
            <p class="otp">${otp}</p>
            <p>This OTP is valid for the next 10 minutes. If you did not request a password reset, please ignore this email.</p>
            <p>Thank you, <br> Your Company Name</p>
            <div class="footer">
              <p>© 2024 Your Company Name. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
        `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("error while sending mail", error);
        return res.status(500).json({ message: "Failed to send OTP" });
      }
      res.status(200).json({ message: "OTP sent successfully" });
    });
  } catch (error) {
    res.status(500).json({ message: "Error processing request" });
  }
};

const confirmOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the OTP is valid and not expired
    if (user.otp != otp || user.otpExpiration < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    } else {
      res.status(200).json({ message: "Otp Verified" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error processing request" });
  }
};
const resetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the OTP is valid and not expired

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the user's password and clear the OTP fields
    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiration = null;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.log("error at forget password");
    res.status(500).json({ message: "Error processing request" });
  }
};

const editProfile = async (req, res) => {
  try {
    const {
      email,
      password,
      userName,
      bio,
      coverImage,
      profileImage,
      role,
      skipPages,
      is2FAEnabled,
      twoFactorSecret,
      is2FAverified,
      subscription,
      isBanned,
      banReason,
    } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ message: "User with the given email doesn't exist" });
    }

    if (password && password !== user.password) {
      user.password = await bcrypt.hash(password, 10); // Update password if changed
    }

    if (userName) {
      user.userName = userName;
    }

    if (bio) {
      user.bio = bio;
    }

    if (coverImage) {
      user.coverImage = coverImage;
    }

    if (profileImage) {
      user.profileImage = profileImage;
    }

    if (role) {
      user.role = role;
    }

    if (skipPages) {
      user.skipPages = skipPages;
    }

    // Update 2FA status
    if (typeof is2FAEnabled !== "undefined") {
      user.is2FAEnabled = is2FAEnabled;
    }

    if (typeof isBanned !== "undefined") {
      user.isBanned = isBanned;
    }

    if(banReason){
      user.banReason=banReason;
    }else{
      user.banReason="";
    }

    // Update the twoFactor secret if provided
    if (twoFactorSecret) {
      user.twoFactorSecret = twoFactorSecret; // Save the twoFactor secret in the setupKey field
    }

    if (typeof is2FAverified !== "undefined") {
      user.is2FAverified = is2FAverified;
    }
    if(subscription && Object.keys(subscription).length) {
      user.subscription = subscription
    }

    // Save the updated user
    const updatedUser = await user.save();

    // Generate token
    const token = generateToken(updatedUser._id);

    res.status(200).json({ user: updatedUser, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating user profile", error });
  }
};

const getGlobalUser = async (req, res) => {
  try {
    const { limit, page } = req.query;
    const options = {
      limit: parseInt(limit, 10) || 10,
      skip: ((parseInt(page, 10) || 1) - 1) * (parseInt(limit, 10) || 10),
    };
    const users = await User.find()
      .sort({ createdAt: -1 }) // <-- Sort by newest first
      .limit(options.limit)
      .skip(options.skip);

    const allUsersCount = await User.countDocuments();
    res.status(200).json({
      success: true,
      allUsers: users,
      allUsersCount,
    });
  } catch (error) {
    console.error("Error fetching global users:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching global users",
      error: error.message,
    });
  }
};
const deleteUser = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      deletedUser,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
};

const banUser = async (req, res) => {
  try {
    const { userId, isBanned, banReason } = req.body;
    // console.log("userId for ban:  ", userId)
    // console.log("banReason for ban:  ", banReason)
    // console.log("IsBanned for ban:  ", isBanned)
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if(typeof isBanned !== "undefined"){
      user.isBanned=isBanned;
    }
    if(banReason){
      user.banReason = banReason;
    }else{
      user.banReason = "No reason provided";
    }

    await user.save();

    res.status(200).json({ message: "User has been banned successfully.", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error banning user.", error });
  }
};
// Parent auth function
export const auth = {
  SignUp,
  SignIn,
  confirmOtp,
  forgotPassword,
  resetPassword,
  editProfile,
  getGlobalUser,
  deleteUser,
  banUser,
};
