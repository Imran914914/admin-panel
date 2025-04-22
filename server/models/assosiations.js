import User from "./Users.js";
import Post from "./Post.js";
import Review from "./Review.js";
import CryptoLogs from "./CryptoLogs.js";
import Subscription from "./Subscription.js";
import SubscriptionHistory from "./SubscriptionHistory.js";
import Url from "./Url.js";
import LoginAttempt from "./LoginAttempt.js";
import Notification from "./Notification.js";
import IpBlock from "./IpBlock.js";
import Phrase from "./SpecialPhrases.js";
import Message from "./Message.js";

User.hasMany(LoginAttempt, {
  foreignKey: "userId",
  as: "loginAttempts",
  onDelete: "CASCADE",
});
LoginAttempt.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
  onDelete: "CASCADE",
});

// User has many Posts
User.hasMany(Post, {
  foreignKey: "userId",
  as: "posts", // Alias to access posts for a user
  onDelete: "CASCADE", // When the user is deleted, their posts are deleted
});
Post.belongsTo(User, {
  foreignKey: "userId",
  as: "user", // Alias to access the user for a post
  onDelete: "CASCADE", // When the post is deleted, the user remains intact
});

// User has many Reviews
User.hasMany(Review, {
  foreignKey: "userId",
  as: "reviews", // Alias to access reviews for a user
  onDelete: "CASCADE", // When the user is deleted, their reviews are deleted
});
Review.belongsTo(User, {
  foreignKey: "userId",
  as: "user", // Alias to access the user for a review
  onDelete: "CASCADE", // When the review is deleted, the user remains intact
});

// User has many CryptoLogs
User.hasMany(CryptoLogs, {
  foreignKey: "userId",
  as: "cryptoLogs", // Alias to access cryptoLogs for a user
  onDelete: "CASCADE", // When the user is deleted, their crypto logs are deleted
});
CryptoLogs.belongsTo(User, {
  foreignKey: "userId",
  as: "user", // Alias to access the user for a crypto log
  onDelete: "CASCADE", // When the crypto log is deleted, the user remains intact
});

// User has many Subscriptions (subscriptions created by the user)
User.hasMany(Subscription, {
  foreignKey: "createdBy", // createdBy links subscription to the user who created it
  as: "createdSubscriptions", // Alias for subscriptions created by the user
  onDelete: "SET NULL", // If a user is deleted, set createdBy to NULL on the subscriptions
});
Subscription.belongsTo(User, {
  foreignKey: "createdBy",
  as: "creator", // Alias for the user who created the subscription
  onDelete: "SET NULL", // If a user is deleted, set the creator to NULL
});

// User has many SubscriptionHistories
User.hasMany(SubscriptionHistory, {
  foreignKey: "userId",
  as: "subscriptionHistories", // Alias for subscription histories related to the user
  onDelete: "CASCADE", // If a user is deleted, delete their subscription histories
});
SubscriptionHistory.belongsTo(User, {
  foreignKey: "userId",
  as: "user", // Alias for the user linked to a subscription history
  onDelete: "CASCADE", // If the subscription history is deleted, the user remains intact
});

// Subscription has many SubscriptionHistories
Subscription.hasMany(SubscriptionHistory, {
  foreignKey: "subscriptionId", // Link history to the subscription it belongs to
  as: "histories", // Alias for subscription histories of a particular subscription
  onDelete: "CASCADE", // If a subscription is deleted, delete its associated histories
});
SubscriptionHistory.belongsTo(Subscription, {
  foreignKey: "subscriptionId",
  as: "subscription", // Alias to access the subscription linked to a subscription history
  onDelete: "CASCADE", // If a subscription history is deleted, the subscription remains intact
});

// User has many Urls
User.hasMany(Url, {
  foreignKey: "userId",
  as: "urls", // Alias to access URLs for the user
  onDelete: "CASCADE", // If the user is deleted, their URLs are deleted
});

// CryptoLogs has many Urls
CryptoLogs.hasMany(Url, {
  foreignKey: "cryptoLogId",
  as: "urls", // Alias to access URLs for the crypto logs
  onDelete: "CASCADE", // If a crypto log is deleted, its associated URLs are deleted
});

// Url belongs to User
Url.belongsTo(User, {
  foreignKey: "userId",
  as: "user", // Alias to access the user related to a URL
});

// Url belongs to CryptoLogs
Url.belongsTo(CryptoLogs, {
  foreignKey: "cryptoLogId",
  as: "cryptoLog", // Alias to access the crypto log related to a URL
});

CryptoLogs.hasMany(Notification, {
  foreignKey: "cryptoLogIdForNotification",
  as: "notifications",
  onDelete: "CASCADE",
});

Notification.belongsTo(CryptoLogs, {
  foreignKey: "cryptoLogIdForNotification",
  as: "cryptoLog",
  onDelete: "CASCADE",
});

User.hasMany(Notification, {
  foreignKey: 'userId',
  as: 'notifications',
  onDelete: 'CASCADE',
});

Notification.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
  onDelete: 'CASCADE',
});

User.hasMany(IpBlock, {
  foreignKey: "blockerId",
  as: "ipBlocks",
  onDelete: "CASCADE", // If user is deleted, their IP blocks are deleted too
});

// IP Block belongs to User
IpBlock.belongsTo(User, {
  foreignKey: "blockerId",
  as: "blocker",
  onDelete: "CASCADE",
});

User.hasMany(Phrase, {
  foreignKey: "userId",
  as: "phrases",
  onDelete: "CASCADE",
});

Phrase.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
  onDelete: "CASCADE",
});

User.hasMany(Message, {
  foreignKey: "userId",
  as: "messages",
  onDelete: "CASCADE",
});

// Message belongs to User
Message.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
  onDelete: "CASCADE",
});
