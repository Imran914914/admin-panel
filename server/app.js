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
    const deletedAgent = await BlockedUserAgent.findByIdAndDelete(id);

    if (!deletedAgent) {
      return res.status(404).json({ error: "User agent not found" });
    }

    res.json({ message: "User agent deleted successfully", id });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/blocker", async (req, res, next) => {
  try {
    const userAgent = req.headers["user-agent"] || "";

    // Fetch all blocked user agents from the database
    const blockedAgents = await BlockedUserAgent.find();

    // Check if the current userAgent is in the blocked list
    if (blockedAgents.some((entry) => userAgent.includes(entry.userAgent))) {
      return res.status(504).json({
        error: "The server took too long to respond. Please try again later.",
        blockedAgents:blockedAgents
      });
    }
    res.status(200).json({
      message: "Access granted",
      blocked: false,
      blockedAgents: blockedAgents, // Send all blocked agents
    });
    next();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/os-blocker", async (req, res) => {
  const { blockedUserAgents } = req.body;

  if (!Array.isArray(blockedUserAgents)) {
    return res.status(400).json({ error: "Invalid data format" });
  }

  try {
    const newBlockedUAs = [];

    for (const ua of blockedUserAgents) {
      const exists = await BlockedUserAgent.findOne({ userAgent: ua });
      if (!exists) {
        newBlockedUAs.push({ userAgent: ua });
      }
    }
    if (newBlockedUAs.length > 0) {
      await BlockedUserAgent.insertMany(newBlockedUAs);
    }
    
    const updatedList = await BlockedUserAgent.find();

    res.json({
      message: "Blocked user agents updated",
      blockedUserAgents: updatedList.map((ua) => ua.userAgent),
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Middleware to log the real client IP
app.use((req, res, next) => {
  const realIP = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const normalizedIP = realIP.startsWith("::ffff:") ? realIP.substring(7) : realIP;
  next();
});

// MongoDB connection
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {});
    console.log(`Connected to MongoDB`);
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    setTimeout(connectToMongoDB, 5000); // Retry after 5 seconds
  }
};
connectToMongoDB();

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
io.on("connection", async(socket) => {
  const userId = socket.handshake.query.userId
  socket.id = userId;
  // console.log(`User connected: ${socket.id}`);
  try {
    const messages = await Message.find().sort({ timestamp: -1 }).limit(10); // Get the latest 10 messages
    socket.emit("chat:initial", messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
  }
  // Listen for new messages and store them in the database
  socket.on("chat:message", (messageData) => {
    const newMessage = new Message({ 
      username: messageData.username, 
      content: messageData.content 
    });

    newMessage.save()
      .then(savedMessage => {
        // Broadcast the new message to all connected clients
        io.emit("chat:newMessage", savedMessage);
      })
      .catch(err => {
        console.error("Error saving message:", err);
      });
  });

  // Handle message removal
  socket.on("removeMessage", (messageId) => {
    // Remove message from the database
    Message.findByIdAndDelete(messageId)
      .then(() => {
        // Broadcast the message removal to all clients
        io.emit("messageRemoved", messageId);
      })
      .catch(err => {
        console.error("Error removing message:", err);
      });
  });

  // socket.on("disconnect", () => {
  //   // Handle cleanup if necessary
  //   const userId = [...userSocketMap.entries()]
  //     .find(([, socketId]) => socketId === socket.id)?.[0];
  //   if (userId) {
  //     userSocketMap.delete(userId);
  //     // console.log(`User ${userId} disconnected.`);
  //   }
  // });

  // Handle disconnection
  socket.on("disconnect", () => {
    // console.log(`User disconnected: ${socket.id}`);
  });
});



// Start server
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port} and on uri ${MONGODB_URI}`);
});
