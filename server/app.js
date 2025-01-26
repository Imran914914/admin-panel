// import express from "express";
// import authentication from "./routes/authentication.js";
// import dashboard from "./routes/dashboard.js";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import cors from "cors";
// import fs from "fs";
// import https from "https";

// dotenv.config();
// const port = process.env.PORT || 8443; // Common HTTPS port
// const MONGODB_URI = process.env.MONGODB_URI;

// // Load SSL/TLS certificates (ensure these paths are correct)


// // Initialize Express app
// const server = express();
// server.use(cors());
// server.use(express.json());
// server.set("trust proxy", true); // Trust proxy headers (important for X-Forwarded-For)

// // MongoDB connection
// const connectToMongoDB = async () => {
//   try {
//     await mongoose.connect(MONGODB_URI, {});
//     console.log(`Connected to MongoDB `);
//   } catch (err) {
//     console.error("Failed to connect to MongoDB", err);
//     setTimeout(connectToMongoDB, 5000); // Retry after 5 seconds
//   }
// };
// connectToMongoDB();


// // Example custom API route
// server.get("/api/custom", (req, res) => {
//   res.json({ message: "Hello from HTTPS server!" });
// });

// // Add routes
// server.use("/auth", authentication);
// server.use("/dashboard", dashboard);

// server.listen(port, () => {
//   console.log(`Server running on http://localhost:${port} and on uri ${MONGODB_URI}`);
// });


// // Create and start the HTTPS server
// // https.createServer(httpsOptions, server).listen(port, (err) => {
// //   if (err) throw err;
// //   console.log(`Server running securely on https://localhost:${port}`);
// // });

// import express from "express";
// import authentication from "./routes/authentication.js";
// import dashboard from "./routes/dashboard.js";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import cors from "cors";

// import https from "https";

// dotenv.config();
// const port = process.env.PORT || 8443; // Common HTTPS port
// const MONGODB_URI = process.env.MONGODB_URI;

// // Initialize Express app
// const server = express();
// server.use(cors());
// server.use(express.json());
// server.set("trust proxy", true); // Trust proxy headers (important for X-Forwarded-For)

// // Middleware to log the real client IP
// server.use((req, res, next) => {
//   const realIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
//   const normalizedIP = realIP.startsWith("::ffff:") ? realIP.substring(7) : realIP; // Strip "::ffff:" if present
//   // console.log(`Real client IP: ${normalizedIP}`);
//   next();
// });

// // MongoDB connection
// const connectToMongoDB = async () => {
//   try {
//     await mongoose.connect(MONGODB_URI, {});
//     console.log(`Connected to MongoDB `);
//   } catch (err) {
//     console.error("Failed to connect to MongoDB", err);
//     setTimeout(connectToMongoDB, 5000); // Retry after 5 seconds
//   }
// };
// connectToMongoDB();

// // Example custom API route
// server.get("/api/custom", (req, res) => {
//   res.json({ message: "Hello from HTTPS server!" });
// });

// server.get("/", (req, res) => {
//   const realIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
//   const normalizedIP = realIP.startsWith("::ffff:") ? realIP.substring(7) : realIP;
//   res.json({ clientIP: normalizedIP });
// });

// // Add routes
// server.use("/auth", authentication);
// server.use("/dashboard", dashboard);

// server.listen(port, () => {
//   console.log(`Server running on http://localhost:${port} and on uri ${MONGODB_URI}`);
// });

// // Create and start the HTTPS server
// // https.createServer(httpsOptions, server).listen(port, (err) => {
// //   if (err) throw err;
// //   console.log(`Server running securely on https://localhost:${port}`);
// // });  

// import express from "express";
// import authentication from "./routes/authentication.js";
// import dashboard from "./routes/dashboard.js";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import cors from "cors";

// import speakeasy from "speakeasy";
// import qrcode from "qrcode";

// dotenv.config();
// const port = process.env.PORT || 8443; // Common HTTPS port
// const MONGODB_URI = process.env.MONGODB_URI;

// // Initialize Express app
// const server = express();
// server.use(cors());
// server.use(express.json());
// server.set("trust proxy", true); // Trust proxy headers (important for X-Forwarded-For)

// // Middleware to log the real client IP
// server.use((req, res, next) => {
//   const realIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
//   const normalizedIP = realIP.startsWith("::ffff:") ? realIP.substring(7) : realIP; // Strip "::ffff:" if present
//   next();
// });

// // MongoDB connection
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

// // Example custom API route
// server.get("/api/custom", (req, res) => {
//   res.json({ message: "Hello from HTTPS server!" });
// });

// server.get("/", (req, res) => {
//   const realIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
//   const normalizedIP = realIP.startsWith("::ffff:") ? realIP.substring(7) : realIP;
//   res.json({ clientIP: normalizedIP });
// });


// server.post("/google-auth/setup", async (req, res) => {
//   const {username} = req.body
//   try {
//     const secret = speakeasy.generateSecret({
//       name: `${username}`,
//       length: 16,
//     });

//     const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);
//     res.json({
//       secret: secret.base32,
//       otpauth_url: secret.otpauth_url,
//       qrCodeUrl,
//     });
//   } catch (err) {
//     console.error("Error generating setup:", err);
//     res.status(500).json({ error: "Failed to generate setup." });
//   }
// });

// server.post("/google-auth/verify", (req, res) => {
//   const { token, secret } = req.body;
//   const verified = speakeasy.totp.verify({
//     secret,
//     encoding: "base32",
//     token,
//     window: 1,
//   });

//   if (verified) {
//     res.json({ success: true, message: "Token is valid." });
//   } else {
//     res.status(400).json({ success: false, message: "Invalid token." });
//   }
// });

// // Add routes
// server.use("/auth", authentication);
// server.use("/dashboard", dashboard);

// server.listen(port, () => {
//   console.log(`Server running on http://localhost:${port} and on uri ${MONGODB_URI}`);
// });

// // Create and start the HTTPS server
// // https.createServer(httpsOptions, server).listen(port, (err) => {
// //   if (err) throw err;
// //   console.log(`Server running securely on https://localhost:${port}`);
// // });


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

dotenv.config();
const port = process.env.PORT || 8443;
const MONGODB_URI = process.env.MONGODB_URI;

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());
app.set("trust proxy", true);

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
