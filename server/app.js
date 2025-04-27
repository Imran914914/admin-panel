import express from "express";
import http from "http"; // For server creation
import { Server as SocketServer } from "socket.io"; // Import Socket.IO
import authentication from "./routes/authentication.js";
import dashboard from "./routes/dashboard.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import Message from "./models/Message.js";
import BlockedUserAgent from "./models/blockedAgent.js";
import sequelize from "./sequelize.js";
import User from "./models/Users.js";
import { Op } from "sequelize";

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("All models were synchronized successfully.");
  })
  .catch((err) => {
    console.error("Error syncing models:", err);
  });

dotenv.config();
const port = process.env.PORT || 8443;
const MONGODB_URI = process.env.MONGODB_URI;

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());
app.set("trust proxy", true);

app.delete("/os-blocker/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Attempt to delete the record by ID
    const deletedCount = await BlockedUserAgent.destroy({
      where: { id },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ error: "User agent not found" });
    }

    res.json({ message: "User agent deleted successfully", id });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

testConnection();

app.get("/blocker", async (req, res, next) => {
  try {
    const userAgent = req.headers["user-agent"] || "";

    // Fetch all blocked user agents from MySQL
    const blockedAgents = await BlockedUserAgent.findAll();

    // Check if any blocked agent string is found in current User-Agent
    const isBlocked = blockedAgents.some((entry) =>
      userAgent.includes(entry.userAgent)
    );

    if (isBlocked) {
      return res.status(504).json({
        error: "The server took too long to respond. Please try again later.",
        blockedAgents: blockedAgents, // You can map if you want only userAgent strings
      });
    }

    res.status(200).json({
      message: "Access granted",
      blocked: false,
      blockedAgents: blockedAgents,
    });

    next();
  } catch (error) {
    console.error("Blocker check failed:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/os-blocker", async (req, res) => {
  const { blockedUserAgents } = req.body;

  if (!Array.isArray(blockedUserAgents)) {
    return res.status(400).json({ error: "Invalid data format" });
  }

  try {
    // Step 1: Get already existing user agents
    const existingAgents = await BlockedUserAgent.findAll({
      where: {
        userAgent: {
          [Op.in]: blockedUserAgents,
        },
      },
    });

    const existingValues = existingAgents.map((ua) => ua.userAgent);

    // Step 2: Filter out only new ones
    const newBlockedUAs = blockedUserAgents
      .filter((ua) => !existingValues.includes(ua))
      .map((ua) => ({ userAgent: ua }));

    // Step 3: Bulk insert new entries (if any)
    if (newBlockedUAs.length > 0) {
      await BlockedUserAgent.bulkCreate(newBlockedUAs);
    }

    // Step 4: Return all blocked user agents
    const updatedList = await BlockedUserAgent.findAll();

    res.json({
      message: "Blocked user agents updated",
      blockedUserAgents: updatedList.map((ua) => ua.userAgent),
    });
  } catch (error) {
    console.error("Error updating blocked user agents:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Middleware to log the real client IP
// app.use((req, res, next) => {
//   const realIP = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
//   const normalizedIP = realIP.startsWith("::ffff:") ? realIP.substring(7) : realIP;
//   next();
// });

// MongoDB connection
// const connectToMongoDB = async () => {
//   try {
//     await mongoose.connect(MONGODB_URI, {});
//     console.log(`Connected to MongoDB`);
//   } catch (err) {
//     console.error("Failed to connect to MongoDB", err);
//     setTimeout(connectToMongoDB, 5000); // Retry after 5 seconds
//   }
// };
// connectToMongoDB();

// Example custom API route
app.get("/api/custom", (req, res) => {
  res.json({ message: "Hello from HTTPS server!" });
});

// Google Auth setup route
app.post("/google-auth/setup", async (req, res) => {
  const { username } = req.body;
  try {
    const secret = speakeasy.generateSecret({
      name: `${username}`,
      length: 16,
    });

    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);
    res.json({
      secret: secret.base32,
      otpauth_url: secret.otpauth_url,
      qrCodeUrl,
    });
  } catch (err) {
    console.error("Error generating setup:", err);
    res.status(500).json({ error: "Failed to generate setup." });
  }
});

// Google Auth verify route
app.post("/google-auth/verify", (req, res) => {
  const { token, secret } = req.body;
  const verified = speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token,
    window: 1,
  });

  if (verified) {
    res.json({ success: true, message: "Token is valid." });
  } else {
    res.status(400).json({ success: false, message: "Invalid token." });
  }
});

// Add routes
app.use("/auth", authentication);
app.use("/dashboard", dashboard);

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: "*", // Replace with your frontend origin
    methods: ["GET", "POST"],
  },
});

// const userSocketMap = new Map(); // Map to store user-to-socket connections

// Real-time chat logic
// io.on("connection", async(socket) => {
//   const userId = socket.handshake.query.userId
//   socket.id = userId;
//   // console.log(`User connected: ${socket.id}`);
//   try {
//     const messages = await Message.find().sort({ timestamp: -1 }).limit(10); // Get the latest 10 messages
//     socket.emit("chat:initial", messages);
//   } catch (err) {
//     console.error("Error fetching messages:", err);
//   }
//   // Listen for new messages and store them in the database
//   socket.on("chat:message", (messageData) => {
//     const newMessage = new Message({
//       username: messageData.username,
//       content: messageData.content
//     });

//     newMessage.save()
//       .then(savedMessage => {
//         // Broadcast the new message to all connected clients
//         io.emit("chat:newMessage", savedMessage);
//       })
//       .catch(err => {
//         console.error("Error saving message:", err);
//       });
//   });

//   // Handle message removal
//   socket.on("removeMessage", (messageId) => {
//     // Remove message from the database
//     Message.findByIdAndDelete(messageId)
//       .then(() => {
//         // Broadcast the message removal to all clients
//         io.emit("messageRemoved", messageId);
//       })
//       .catch(err => {
//         console.error("Error removing message:", err);
//       });
//   });

//   // socket.on("disconnect", () => {
//   //   // Handle cleanup if necessary
//   //   const userId = [...userSocketMap.entries()]
//   //     .find(([, socketId]) => socketId === socket.id)?.[0];
//   //   if (userId) {
//   //     userSocketMap.delete(userId);
//   //     // console.log(`User ${userId} disconnected.`);
//   //   }
//   // });

//   // Handle disconnection
//   socket.on("disconnect", () => {
//     // console.log(`User disconnected: ${socket.id}`);
//   });
// });

io.on("connection", async (socket) => {
  const userId = socket.handshake.query.userId;
  // console.log("userId in socket:  ",userId)
  socket.id = userId;

  try {
    // Get latest 10 messages with user info
    const messages = await Message.findAll({
      order: [["createdAt", "DESC"]],
      limit: 10,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "userName", "email"],
        },
      ],
    });

    socket.emit("chat:initial", messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
  }

  // Listen for new messages
  socket.on("chat:message", async (messageData) => {
    try {
      const { userId, content, username } = messageData;
      // console.log("userId in socket: 2  ",userId)
      // Optionally validate user exists
      const user = await User.findByPk(userId);
      if (!user) {
        return socket.emit("chat:error", "User not found.");
      }

      // Create and save the message
      const newMessage = await Message.create({
        username,
        content,
        userId,
      });

      // Fetch with user info for broadcast
      const messageWithUser = await Message.findByPk(newMessage.id, {
        include: {
          model: User,
          as: "user",
          attributes: ["id", "userName"],
        },
      });

      // Broadcast to all clients
      io.emit("chat:newMessage", messageWithUser);
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  // Handle message deletion
  socket.on("removeMessage", async (messageId) => {
    try {
      const deleted = await Message.destroy({ where: { id: messageId } });

      if (deleted) {
        io.emit("messageRemoved", messageId);
      } else {
        socket.emit("chat:error", "Message not found.");
      }
    } catch (err) {
      console.error("Error removing message:", err);
    }
  });

  // On disconnect
  socket.on("disconnect", () => {
    // console.log(`User disconnected: ${socket.id}`);
  });
});

// Start server
server.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${port}`);
});

import "./models/assosiations.js";
