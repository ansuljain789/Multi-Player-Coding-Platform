// const express = require("express");
// const app = express();
// const http = require("http");
// const { Server } = require("socket.io");
// const ACTIONS = require("./Actions");
// const cors = require("cors");
// const axios = require("axios");
// const server = http.createServer(app);
// require("dotenv").config();

// const languageConfig = {
//   python3: { versionIndex: "3" },
//   java: { versionIndex: "3" },
//   cpp: { versionIndex: "4" },
//   nodejs: { versionIndex: "3" },
//   c: { versionIndex: "4" },
//   ruby: { versionIndex: "3" },
//   go: { versionIndex: "3" },
//   scala: { versionIndex: "3" },
//   bash: { versionIndex: "3" },
//   sql: { versionIndex: "3" },
//   pascal: { versionIndex: "2" },
//   csharp: { versionIndex: "3" },
//   php: { versionIndex: "3" },
//   swift: { versionIndex: "3" },
//   rust: { versionIndex: "3" },
//   r: { versionIndex: "3" },
// };

// // Enable CORS
// app.use(cors());

// // Parse JSON bodies
// app.use(express.json());

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//   },
// });

// const userSocketMap = {};
// const getAllConnectedClients = (roomId) => {
//   return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
//     (socketId) => {
//       return {
//         socketId,
//         username: userSocketMap[socketId],
//       };
//     }
//   );
// };

// io.on("connection", (socket) => {
//   // console.log('Socket connected', socket.id);
//   socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
//     userSocketMap[socket.id] = username;
//     socket.join(roomId);
//     const clients = getAllConnectedClients(roomId);
//     // notify that new user join
//     clients.forEach(({ socketId }) => {
//       io.to(socketId).emit(ACTIONS.JOINED, {
//         clients,
//         username,
//         socketId: socket.id,
//       });
//     });
//   });

//   // sync the code
//   socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
//     socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
//   });
//   // when new user join the room all the code which are there are also shows on that persons editor
//   socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
//     io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
//   });

//   // leave room
//   socket.on("disconnecting", () => {
//     const rooms = [...socket.rooms];
//     // leave all the room
//     rooms.forEach((roomId) => {
//       socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
//         socketId: socket.id,
//         username: userSocketMap[socket.id],
//       });
//     });

//     delete userSocketMap[socket.id];
//     socket.leave();
//   });
// });

// app.post("/compile", async (req, res) => {
//   const { code, language } = req.body;

//   try {
//     const response = await axios.post("https://api.jdoodle.com/v1/execute", {
//       script: code,
//       language: language,
//       versionIndex: languageConfig[language].versionIndex,
//       clientId: process.env.jDoodle_clientId,
//       clientSecret: process.env.kDoodle_clientSecret,
//     });

//     res.json(response.data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to compile code" });
//   }
// });

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`Server is runnint on port ${PORT}`));





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

// 🔹 Compile API (protected with JWT)
app.post("/compile", jwtAuthMiddleware, async (req, res) => {
  const { code, language } = req.body;
  console.log(code);
  console.log(language);
  
  try {
    const response = await axios.post("https://api.jdoodle.com/v1/execute", {
      script: code,
      language: language,
      versionIndex: languageConfig[language].versionIndex,
      clientId: process.env.jDoodle_clientId,
      clientSecret: process.env.kDoodle_clientSecret,
    });

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
  const token = socket.handshake.auth.token; // frontend must send token
  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new Error("Authentication error: Invalid token"));
    }
    socket.user = decoded; // attach decoded user to socket
    next();
  });
});

const userSocketMap = {};
const getAllConnectedClients = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => ({
      socketId,
      email: userSocketMap[socketId] || "UNKNOWN",
    })
  );
};

io.on("connection", (socket) => {
 
     console.log("✅ User connected:", socket.user.email);
   

  socket.on(ACTIONS.JOIN, ({ roomId, email}) => {

  const userEmail = email || socket.user.email;

    console.log("user email is",userEmail);
    
    userSocketMap[socket.id] = userEmail;
    socket.join(roomId);

    const clients = getAllConnectedClients(roomId);

    // Notify everyone in the room
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        email,
        socketId: socket.id,
      });
    });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });

    delete userSocketMap[socket.id];
    socket.leave();
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`✅ Server is running on port ${PORT}`)
);

