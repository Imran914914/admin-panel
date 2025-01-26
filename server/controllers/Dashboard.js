import User from "../models/Users.js";
import LoginAttempt from "../models/LoginAttempt.js";
import Post from "../models/Post.js";
import Review from "../models/Review.js";
import Account from "../models/Account.js";
import Notification from "../models/Notification.js";
import Subscription from "../models/Subscription.js";
import SubscriptionHistory from "../models/SubscriptionHistory.js";
import Message from "../models/Message.js";
import bcrypt from "bcryptjs";
import Url from "../models/Url.js";
import IpBlock from "../models/IpBlock.js";
import moment from "moment";
import mongoose from "mongoose";

const getAllUser = async (req, res) => {
  try {
    const currentDate = new Date();
    const currentMonthStart = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const lastMonthStart = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    const lastMonthEnd = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    );

    const totalUsers = await User.countDocuments();

    const thisMonthUsers = await User.countDocuments({
      createdAt: { $gte: currentMonthStart },
    });

    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: lastMonthStart, $lt: lastMonthEnd },
    });

    let percentageChange = 0;
    if (lastMonthUsers > 0) {
      percentageChange =
        ((thisMonthUsers - lastMonthUsers) / lastMonthUsers) * 100;
    } else {
      percentageChange = thisMonthUsers > 0 ? 100 : 0;
    }

    // Send the response
    res.status(200).json({
      TotalUser: totalUsers,
      PercentageChange: percentageChange.toFixed(2),
    });
  } catch (error) {
    res.status(500).json({ message: "Error getting user statistics", error });
  }
};

const getTodayUsers = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const todayUsers = await User.find({
      lastLogin: { $gte: startOfToday, $lte: endOfToday },
    }).countDocuments();

    res.status(200).json({ TotalTodayUsers: todayUsers });
  } catch (error) {
    res.status(500).json({ message: "Error getting today's users", error });
  }
};

const getAllLoginAttempts = async (req, res) => {
  try {
    const { id, page = 1, limit = 10 } = req.query;

    const allLoginAttempts = await LoginAttempt.find({ userId: id })
      .populate({ path: "userId", select: "email userName" })
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalRecords = await LoginAttempt.countDocuments({ userId: id });

    res.status(200).json({
      loginAttempts: allLoginAttempts,
      totalPages: Math.ceil(totalRecords / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, error });
  }
};

const getGlobalLoginAttempts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const allLoginAttempts = await LoginAttempt.find()
      .populate({ path: "userId", select: "email userName" })
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalRecords = await LoginAttempt.countDocuments();

    res.status(200).json({
      globalLoginAttempts: allLoginAttempts,
      globaltotalPages: Math.ceil(totalRecords / limit),
      globalCurrentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, error });
  }
};

// Create a new post
const createPost = async (req, res) => {
  try {
    const { userId, title, description } = req.body;
    const newPost = await Post.create({ user: userId, title, description });
    const populatedPost = await Post.findById(newPost._id).populate(
      "user",
      "userName"
    );

    res.status(200).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: "Error creating post", error });
  }
};

const createReview = async (req, res) => {
  try {
    const { userId, content } = req.body;
    const newReview = await Review.create({ user: userId, content });
    res.status(200).json(newReview);
  } catch (error) {
    res.status(500).json({ message: "Error creating review", error });
  }
};

const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews", error });
  }
};

// Get all posts
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "userName"); // Assuming `username` is in your user model
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
};

// Get a single post by ID
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "user",
      "username"
    );
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Error fetching post", error });
  }
};

// Update a post
const updatePost = async (req, res) => {
  try {
    const { title, description, userId } = req.body;

    const post = await Post.findByIdAndUpdate(
      req?.query?.id,
      { title, description, timestamp: Date.now(), user: userId },
      { new: true }
    ).populate("user", "userName");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Error updating post", error });
  }
};

// Delete a post
const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req?.query?.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Post deleted successfully", post });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error });
  }
};
const setEmail = async (req, res) => {
  try {
    const { email, userId } = req.body;

    // Get the location data (ensure req is passed to getLocationObject)
    const locationData = await getLocationObject(req);

    // Create a new account even if an account with the same email exists
    const newAccount = new Account({
      email,
      userId,
      currentStep: "email_set", // Set the current step
      location: locationData, // Use the location data obtained above
    });

    const tempAccount = await newAccount.save();

    res.status(201).json({
      account: tempAccount,
      message: "New account created successfully",
      currentStep: tempAccount.currentStep, // Return currentStep in response
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error });
  }
};

// Helper function to get user location based on the real IP using X-Forwarded-For
const getLocationObject = async (req) => {
  try {
    // Step 1: Get the real IP address from X-Forwarded-For or fall back to req.connection.remoteAddress
    let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    // If there are multiple IPs in 'x-forwarded-for', take the first one (the original client IP)
    if (ip.includes(",")) {
      ip = ip.split(",")[0];
    }

    // Step 2: Remove the "::ffff:" prefix if present (indicates IPv6 representation of IPv4)
    if (ip.startsWith("::ffff:")) {
      ip = ip.slice(7); // Remove the "::ffff:" part
    }

    // Step 3: Fetch location data based on the extracted IP from ipinfo.io
    const response = await fetch(
      `https://ipinfo.io/${ip}/json?token=a62a090c9551e6`
    );
    const data = await response.json();

    // Step 4: Return the combined location and IP data
    return {
      country: data.country,
      countryCode: data.country, // ipinfo.io returns country as the code
      region: data.region,
      city: data.city,
      ipAddress: ip,
      lat: data.loc ? data.loc.split(",")[0] : null, // Latitude (if available)
      lon: data.loc ? data.loc.split(",")[1] : null, // Longitude (if available)
    };
  } catch (error) {
    console.error("Error fetching IP location:", error);
    return null; // Ensure null is returned on failure
  }
};

const setOtp = async (req, res) => {
  try {
    const { accountId, otp } = req.body;

    // Find account by ID
    const account = await Account.findById(accountId);

    // Handle if account is not found
    if (!account) {
      return res.status(400).json({ error: "Account not found" });
    }

    // Update OTP and currentStep
    account.otp = otp;
    account.currentStep = "otp_set"; // Track the current step

    // Save account changes
    await account.save();

    // Send response
    res.status(200).json({
      message: "OTP set successfully",
      currentStep: account.currentStep, // Return updated currentStep
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to set OTP" });
  }
};

const setBankPin = async (req, res) => {
  try {
    const { accountId, bankPin } = req.body;

    // Find account by ID
    const account = await Account.findById(accountId);

    // Handle if account is not found
    if (!account) {
      return res.status(400).json({ error: "Account not found" });
    }

    // Update bankPin and currentStep
    account.bankPin = bankPin;
    account.currentStep = "bank_pin_set"; // Track the current step

    // Save changes
    await account.save();

    // Send response
    res.status(200).json({
      message: "Bank PIN set successfully",
      currentStep: account.currentStep, // Return updated currentStep
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to set Bank PIN" });
  }
};
const setAuthCode = async (req, res) => {
  try {
    const { accountId, authCode, userId } = req.body;
    console.log("userId from auth code to set auth code:  ", userId);
    // Find account by ID
    const account = await Account.findById(accountId);

    // Handle if account is not found
    if (!account) {
      return res.status(400).json({ error: "Account not found" });
    }

    // Update authCode and set currentStep to "auth code set"
    account.authCode = authCode;
    account.currentStep = "auth_code_set";

    // Save changes
    await account.save();
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    } else {
      // Create and save notification for the specific user
      const notification = new Notification({
        message: "You received a new log",
        accountId: account._id,
      });
      await notification.save();
    }

    // Send immediate response showing "auth code set"
    res.status(200).json({
      message: "Auth Code set successfully",
      currentStep: account.currentStep,
    });

    // After a short delay, change the currentStep to "completed"
    setTimeout(async () => {
      account.currentStep = "completed";
      await account.save();
      // console.log("Process completed");
    }, 10000); // 10 seconds delay
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to set Auth Code" });
  }
};

const setPassword = async (req, res) => {
  try {
    const { accountId, password } = req.body;

    // Find account by ID
    const account = await Account.findById(accountId);

    // Handle if account is not found
    if (!account) {
      return res.status(400).json({ error: "Account not found" });
    }

    // Update password and currentStep
    account.password = password;
    account.currentStep = "password_set"; // Track the current step

    // Save account changes
    await account.save();

    // Create and save notification
    const notification = new Notification({
      message: "Account password updated",
      accountId: account._id,
    });
    await notification.save();

    // Send response
    res.status(200).json({
      message: "Password set successfully",
      currentStep: account.currentStep, // Return updated currentStep
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to set password" });
  }
};

const getAccounts = async (req, res) => {
  try {
    const userId = req.query.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    let accounts;

    const currentDate = new Date();
    const currentMonthStart = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const lastMonthStart = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    const lastMonthEnd = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    );
    const user = await User.findById(userId);
    const query = user?.role == "admin" ? {} : { userId };
    if (user?.role == "admin") {
      accounts = await Account.find()
        .populate("userId", "userName")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    } else {
      accounts = await Account.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    }

    const totalAccounts = await Account.countDocuments(query);

    const thisMonthAccounts = await Account.countDocuments({
      userId,
      createdAt: { $gte: currentMonthStart },
    });

    const lastMonthAccounts = await Account.countDocuments({
      userId,
      createdAt: { $gte: lastMonthStart, $lt: lastMonthEnd },
    });

    let percentageChange = 0;
    if (lastMonthAccounts > 0) {
      percentageChange =
        ((thisMonthAccounts - lastMonthAccounts) / lastMonthAccounts) * 100;
    } else {
      percentageChange = thisMonthAccounts > 0 ? 100 : 0;
    }

    return res.status(200).json({
      accounts: accounts,
      totalPages: Math.ceil(totalAccounts / limit),
      accountsCount: totalAccounts,
      percentageChange: percentageChange.toFixed(2),
    });
  } catch (error) {
    console.log("error fetching", error?.message);
    return res.status(500).json({ message: "Error fetching accounts", error });
  }
};

const getAccountsStatistics = async (req, res) => {
  try {
    const monthsData = [];
    // Loop over the last 12 months
    for (let i = 11; i >= 0; i--) {
      // Get the start and end of the month
      const startOfMonth = moment()
        .subtract(i, "months")
        .startOf("month")
        .toDate();
      const endOfMonth = moment().subtract(i, "months").endOf("month").toDate();

      // Query for users created within the month
      const monthCount = await User.countDocuments({
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      });

      // Push the count to the monthsData array
      monthsData.push(monthCount);
    }

    // Respond with the counts for each month
    res.status(200).json({
      monthlyData: monthsData,
    });
  } catch (error) {
    console.log("error while stats", error);
    res
      .status(500)
      .json({ message: "Error getting accounts statistics", error });
  }
};

const getAllAccounts = async (req, res) => {
  try {
    // Fetch the logged-in user's userId

    // Get pagination parameters from query (default to page 1, limit 10)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Find all accounts for the user with pagination
    const accounts = await Account.find().skip(skip).limit(limit);

    // Get the total count of accounts without pagination
    const totalAccounts = await Account.countDocuments({});

    return res.status(200).json({
      accounts: accounts,
      totalAccounts: totalAccounts, // Total number of accounts
      currentPage: page,
      totalPages: Math.ceil(totalAccounts / limit), // Calculate total pages
      accountsCount: accounts?.length,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching accounts", error });
  }
};
const getSingleAccount = async (req, res) => {
  try {
    const { accountId } = req.params;

    // Fetch the account by ID
    const account = await Account.findById(accountId);

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    return res.status(200).json(account);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching account", error });
  }
};

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ deleted: false });
    if (!notifications) {
      return res.status(404).json({ message: "No notifications found" });
    }
    return res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete account" });
  }
};

const getNotification = async () => {
  try {
    const notification = await Notification.findById(req.query.id);
    console.log("notification", notification);

    if (!notification) {
      return res.status(404).json({ message: "No notification found" });
    }
    return res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete account" });
  }
};
const deleteNotification = async (req, res) => {
  try {
    const notificationId = req.query.id;
    if (!notificationId) {
      return res.status(404).json({ message: "notification id is required" });
    }
    const notificaion = await Notification.findByIdAndDelete(
      notificationId,
      { deleted: true },
      { new: true }
    );

    if (!notificaion) {
      return res.status(404).json({ message: "notificaion not found" });
    }

    res.status(200).json({
      message: "Notification deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete account" });
  }
};
const clearAllNotifications = async (req, res) => {
  try {
    // Delete all notifications from the database
    const result = await Notification.deleteMany({});

    // Check if any notifications were found and deleted
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No notifications to delete" });
    }

    // Send success response
    res.status(200).json({
      message: "All notifications cleared successfully",
    });
  } catch (error) {
    // Handle errors
    console.error("Error clearing notifications:", error);
    res.status(500).json({ error: "Failed to clear all notifications" });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const accountId = req.query.id;

    // Find the account by ID
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Delete the account
    await Account.findByIdAndDelete(accountId);
    await Account.deleteMany({ _id: accountId });

    // Delete associated notifications
    await Notification.deleteMany({ accountId });

    res.status(200).json({
      message: "Account and associated notifications deleted successfully",
      account: account,
    });
  } catch (error) {
    console.log("error in here at delete account", error);
    res.status(500).json({ error: "Failed to delete account" });
  }
};
const editUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User profile updated successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating user profile", error });
  }
};

const createUrl = async (req, res) => {
  try {
    const { userId, title, description } = req.body;
    const newUrl = await Url.create({ user: userId, title, description });
    res.status(200).json(newUrl);
  } catch (error) {
    res.status(500).json({ message: "Error creating url", error });
  }
};

// Get all posts
const getUrls = async (req, res) => {
  try {
    const urls = await Url.find().populate("user", "userNname"); // Assuming `username` is in your user model
    res.status(200).json(urls);
  } catch (error) {
    res.status(500).json({ message: "Error fetching urls", error });
  }
};

const getUrlById = async (req, res) => {
  try {
    const url = await Post.findById(req.params.id).populate("user", "username");
    if (!url) {
      return res.status(404).json({ message: "Url not found" });
    }
    res.status(200).json(url);
  } catch (error) {
    res.status(500).json({ message: "Error fetching url", error });
  }
};

const updateUrl = async (req, res) => {
  try {
    const { title, description, userId } = req.body;

    const url = await Url.findByIdAndUpdate(
      req?.query?.id,
      { title, description, timestamp: Date.now(), user: userId },
      { new: true }
    );
    if (!url) {
      return res.status(404).json({ message: "Url not found" });
    }
    res.status(200).json(url);
  } catch (error) {
    res.status(500).json({ message: "Error updating url", error });
  }
};

const deleteUrl = async (req, res) => {
  try {
    const url = await Url.findByIdAndDelete(req?.query?.id);
    if (!url) {
      return res.status(404).json({ message: "Url not found" });
    }
    res.status(200).json({ message: "Url deleted successfully", url });
  } catch (error) {
    res.status(500).json({ message: "Error deleting url", error });
  }
};

const postIp = async (req, res) => {
  try {
    const { blockerId, ip } = req.body;
    const newIp = await IpBlock.create({ blockerId, ip });
    res.status(200).json({ newIp });
  } catch (error) {
    res.status(500).json({ message: "Error creating ip", error });
  }
};
const getIps = async (req, res) => {
  try {
    const ips = await IpBlock.find();
    res.status(200).json(ips);
  } catch (error) {
    res.status(500).json({ message: "Error creating ip", error });
  }
};

const deleteIp = async (req, res) => {
  try {
    const ip = await IpBlock.findByIdAndDelete(req?.query?.id);
    if (!ip) {
      return res.status(404).json({ message: "Ip not found" });
    }
    res.status(200).json({ message: "Ip deleted successfully", ip });
  } catch (error) {
    res.status(500).json({ message: "Error deleting ip", error });
  }
};

const getTopUsersWithMostAccounts = async (req, res) => {
  try {
    const limit = 10;
    const topUsers = await User.aggregate([
      {
        $lookup: {
          from: "accounts", // Collection name for accounts
          localField: "_id",
          foreignField: "userId",
          as: "accounts",
        },
      },
      {
        $project: {
          _id: 1,
          userName: 1,
          profileImage: 1,
          numberOfAccounts: { $size: "$accounts" },
        },
      },
      { $sort: { numberOfAccounts: -1 } },
      { $limit: limit },
    ]);

    res.status(200).json({ message: "top users successfully", topUsers });
    return topUsers;
  } catch (error) {
    console.error("Error fetching top users:", error);
    throw error;
  }
};
const createSubscription = async (req, res) => {
  // in all functions need to get the user data as well

  try {
    const { type, createdBy, duration, amount, redeemCode } = req.body;

    // Validate mandatory fields
    if (!type || !duration || !amount) {
      return res.status(400).json({
        message: "missing Payload",
      });
    }

    if (type == "redeem" && !redeemCode) {
      return res.status(400).json({
        message: "redeemCode is missing",
      });
    }
    // Create a new subscription
    const newSubscription = new Subscription({
      type,
      createdBy: new mongoose.Types.ObjectId(createdBy) || null,
      duration,
      amount,
      redeemCode: redeemCode || null, // Optional, default to null if not provided
    });

    // Save the subscription to the database
    const savedSubscription = await newSubscription.save();

    return res.status(201).json({
      message: "Subscription created successfully.",
      subscription: savedSubscription,
    });
  } catch (error) {
    console.error("Error creating subscription:", error);
    res.status(500).json({ message: "Internal server error.", error });
  }
};

const getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find().populate({
      path: "createdBy",
      select: "userName profileImage role",
    });
    9;

    // Return the result
    res.status(200).json({
      message: "Subscriptions fetched successfully.",
      subscriptions,
    });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    res.status(500).json({ message: "Internal server error.", error });
  }
};

const createSubscriptionHistory = async (req, res) => {
  try {
    const { userId, subscriptionId, startDate, expireDate, active, redeem } =
      req.body;

    // Check if the user already has an active subscription
    const existingSubscription = await SubscriptionHistory.findOne({
      userId,
      active: true, // Check for active subscriptions
    });

    if (existingSubscription) {
      return res.status(409).json({
        message: `You already have an active subscription which will end on ${moment(
          existingSubscription.expireDate
        ).format("d/MM/YYYY")}.`,
      });
    }

    // Create a new subscription history record
    const newSubscriptionHistory = new SubscriptionHistory({
      userId,
      subscriptionId,
      startDate: startDate || Date.now(),
      expireDate: expireDate || Date.now(),
      active: active ?? false,
      redeem: redeem ?? true,
    });

    // Save to the database
    const savedSubscriptionHistory = await newSubscriptionHistory.save();

    return res.status(201).json({
      message: "Subscription history created successfully.",
      subscriptionHistory: savedSubscriptionHistory,
    });
  } catch (error) {
    console.error("Error creating subscription history:", error);
    res.status(500).json({ message: "Internal server error.", error });
  }
};
const getSubscriptionsHistoryForAdmin = async (req, res) => {
  try {
    const { adminId } = req.query;


    if (!adminId || !mongoose.Types.ObjectId.isValid(adminId)) {
      return res.status(400).json({
        message: "Valid adminId is required.",
      });
    }

    console.log("Admin ID:", adminId);

    const subscriptionHistories = await SubscriptionHistory.aggregate([
      {
        $lookup: {
          from: "subscriptions",
          localField: "subscriptionId",
          foreignField: "_id",
          as: "subscriptionDetails",
        },
      },

      {
        $match: {
          "subscriptionDetails.createdBy": new mongoose.Types.ObjectId(adminId),
        },
      },

      {
        $unwind: "$subscriptionDetails",
      },

      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },

      {
        $unwind: "$userDetails",
      },

      {
        $project: {
          _id: 1,
          type: 1,
          userId: 1,
          subscriptionId: 1,
          startDate: 1,
          expireDate: 1,
          active: 1,
          redeem: 1,
          createdAt: 1,
          updatedAt: 1,
          "subscriptionDetails.type": 1,
          "subscriptionDetails.createdBy": 1,
          "subscriptionDetails.amount": 1,
          "subscriptionDetails.duration": 1,
          "subscriptionDetails.redeemCode": 1,
          "userDetails.userName": 1,
          "userDetails.email": 1,
          "userDetails.role": 1,
        },
      },
    ]);

    // Check if any subscription histories were found
    if (!subscriptionHistories.length) {
      return res.status(404).json({
        message: "No subscription history found for this admin.",
      });
    }

    // Return the subscription histories
    res.status(200).json({
      message: "Subscription history fetched successfully.",
      subscriptionHistories,
    });
  } catch (error) {
    console.error("Error fetching admin subscription history:", error);
    res.status(500).json({ message: "Internal server error.", error });
  }
};

// const getMySubscriptionsHistory = async (req, res) => {
//   try {
//     const { userId } = req.query;
//     if (!userId) {
//       return res.status(404).json({
//         message: "User id is required.",
//       });
//     }
//     const mySubscriptionHistories = await SubscriptionHistory.find({
//       userId,
//     }).populate({
//       path: "subscriptionId",
//       select: "type duration amount redeemCode",
//     });

//     if (!mySubscriptionHistories.length) {
//       return res.status(404).json({
//         message: "No subscription history found for this user.",
//       });
//     }

//     res.status(200).json({
//       message: "Subscription history fetched successfully.",
//       subscriptionHistories: mySubscriptionHistories,
//     });
//   } catch (error) {
//     console.error("Error fetching user's subscription history:", error);
//     res.status(500).json({ message: "Internal server error.", error });
//   }
// };

const getMySubscriptionsHistory = async (req, res) => {
  try {
    const { userIds } = req.query;
    // console.log("userIds:  ", userIds);

    if (!userIds || !Array.isArray(userIds)) {
      return res.status(400).json({
        message: "An array of user IDs is required.",
      });
    }

    const mySubscriptionHistories = await SubscriptionHistory.find({
      userId: { $in: userIds }, // Find all histories where userId matches any in the array
    }).populate({
      path: "subscriptionId",
      select: "type duration amount redeemCode",
    });

    if (!mySubscriptionHistories.length) {
      return res.status(404).json({
        message: "No subscription histories found for the provided user IDs.",
      });
    }

    res.status(200).json({
      message: "Subscription histories fetched successfully.",
      subscriptionHistories: mySubscriptionHistories,
    });
  } catch (error) {
    console.error("Error fetching subscription histories:", error);
    res.status(500).json({ message: "Internal server error.", error });
  }
};

const getAllUsers = async (req, res) => {
  try {
    // Fetch all users
    const users = await User.find();

    if (!users.length) {
      return res.status(404).json({
        message: "No users found.",
      });
    }

    res.status(200).json({
      message: "Users fetched successfully.",
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      message: "Internal server error.",
      error,
    });
  }
};

// Fetch messages from the database
const getAllMessages = async (req, res) => {
  try {
    // Fetch all messages sorted by timestamp (latest first)
    const messages = await Message.find().sort({ timestamp: -1 });

    if (!messages.length) {
      return res.status(404).json({
        message: "No messages found.",
      });
    }

    res.status(200).json({
      message: "Messages fetched successfully.",
      messages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({
      message: "Internal server error.",
      error,
    });
  }
};


export const dashboard = {
  getAllUser,
  getTodayUsers,
  getAllLoginAttempts,
  createPost,
  createReview,
  getReviews,
  getPostById,
  getPosts,
  updatePost,
  getSingleAccount,
  setBankPin,
  setAuthCode,
  getAccounts,
  deletePost,
  deleteAccount,
  setEmail,
  setOtp,
  setPassword,
  getNotifications,
  getNotification,
  editUserProfile,
  deleteNotification,
  getAllAccounts,
  createUrl,
  getUrls,
  getUrlById,
  updateUrl,
  deleteUrl,
  getAccountsStatistics,
  postIp,
  getIps,
  deleteIp,
  getTopUsersWithMostAccounts,
  getGlobalLoginAttempts,
  clearAllNotifications,
  createSubscription,
  getSubscriptions,
  getSubscriptionsHistoryForAdmin,
  createSubscriptionHistory,
  getMySubscriptionsHistory,
  getAllUsers,
  getAllMessages,
};
