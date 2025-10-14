const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const axios = require("axios");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Import local files
const connectDB = require("./utils/db");   // ✅ Connect DB
const ACTIONS = require("./Actions");
const authRoutes = require("./routes/authRoutes");
const jwtAuthMiddleware = require("./middleware/jwtAuth");
const history = require("./routes/history");
const Room = require("./models/Room");  // import model
const User = require("./models/userModel");

const server = http.createServer(app);

const languageConfig = {
  python3: { versionIndex: "3" },
  java: { versionIndex: "3" },
  cpp: { versionIndex: "4" },
  nodejs: { versionIndex: "3" },
  c: { versionIndex: "4" },
  ruby: { versionIndex: "3" },
  go: { versionIndex: "3" },
  scala: { versionIndex: "3" },
  bash: { versionIndex: "3" },
  sql: { versionIndex: "3" },
  pascal: { versionIndex: "2" },
  csharp: { versionIndex: "3" },
  php: { versionIndex: "3" },
  swift: { versionIndex: "3" },
  rust: { versionIndex: "3" },
  r: { versionIndex: "3" },
};

connectDB();

// Enable CORS & JSON parsing
app.use(cors());
app.use(express.json());

// 🔹 Auth routes
app.use("/auth", authRoutes);
app.use("/history", history);

// 🔹 Compile API (protected with JWT)
app.post("/compile", jwtAuthMiddleware, async (req, res) => {
  const { code, language } = req.body;
  

  try {
    const response = await axios.post(process.env.jDoodle_Link, {
      script: code,
      language: language,
      versionIndex: languageConfig[language].versionIndex,
      clientId: process.env.jDoodle_clientId,
      clientSecret: process.env.kDoodle_clientSecret,
    });
    console.log(response.data );
    

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to compile code" });
  }
});

// 🔹 Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// ✅ Authenticate socket connections with JWT
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Authentication error: No token provided"));

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next(new Error("Authentication error: Invalid token"));
    socket.user = decoded; // attach decoded user to socket
    next();
  });
});

const userSocketMap = {};
const getAllConnectedClients = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => ({
    socketId,
    email: userSocketMap[socketId] || "UNKNOWN",
  }));
};

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.user.email);

  // 🔹 Join room
  socket.on(ACTIONS.JOIN, async ({ roomId, email }) => {
    const userEmail = email || socket.user.email;
    userSocketMap[socket.id] = userEmail;
    socket.join(roomId);

    let room = await Room.findOne({ roomId });
    const user = await User.findOne({ email: userEmail });

    if (!room) {
      room = new Room({ roomId, editor: user._id, members: [user._id] });
    } else if (!room.members.includes(user._id)) {
      room.members.push(user._id);
    }
    await room.save();

    const clients = getAllConnectedClients(roomId);

    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username: userEmail,
        socketId: socket.id,
        admin: room.editor?.toString() === user._id.toString(),
      });
    });
  });

  // 🔹 Code change broadcast
  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  // 🔹 Sync code with a specific socket
  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  // 🔹 Request edit permission
  socket.on(ACTIONS.REQUEST_EDIT, async ({ roomId }) => {
    const room = await Room.findOne({ roomId }).populate("editor");
    if (room?.editor) {
      const editorSocketId = Object.keys(userSocketMap).find(
        (id) => userSocketMap[id] === room.editor.email
      );
      if (editorSocketId) {
        io.to(editorSocketId).emit(ACTIONS.REQUEST_EDIT, {
          requesterEmail: userSocketMap[socket.id],
        });
      }
    }
  });

  // 🔹 Grant edit access
  socket.on(ACTIONS.GRANT_EDIT, async ({ roomId, newEditorEmail }) => {
    const room = await Room.findOne({ roomId });
    const newEditor = await User.findOne({ email: newEditorEmail });

    if (room && newEditor) {
      room.editor = newEditor._id;
      await room.save();

      const clients = getAllConnectedClients(roomId);
      clients.forEach(({ socketId }) => {
        io.to(socketId).emit(ACTIONS.EDITOR_CHANGED, {
          editorId: room.editor.toString(),
          editorEmail: newEditor.email,
        });
      });
    }
  });

  // 🔹 Deny edit access (optional)
  socket.on(ACTIONS.DENY_EDIT, ({ roomId, requesterEmail }) => {
    const roomClients = getAllConnectedClients(roomId);
    const requesterSocket = Object.keys(userSocketMap).find(
      (id) => userSocketMap[id] === requesterEmail
    );
    if (requesterSocket) io.to(requesterSocket).emit(ACTIONS.DENY_EDIT);
  });

  // 🔹 Disconnect handling
  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Server is running on port ${PORT}`));
