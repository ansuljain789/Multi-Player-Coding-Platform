// const express = require("express");
// const router = express.Router();
// const User = require("../models/userModel")
// const jwtAuthMiddleware = require("../middleware/jwtAuth");
// const Room = require("../models/Room");

// // Save code snippet to history
// router.post("/", jwtAuthMiddleware, async (req, res) => {
//   const { code, language ,roomId} = req.body;

//     console.log(roomId);
    
//   try {
//     const user = await User.findById(req.user.id);
//     if (!user) return res.status(404).json({ error: "User not found" });

//     user.codeHistory.push({ code, language,roomId });
//     await user.save();
//      console.log(user.codeHistory);
    

//     res.json({ success: true, history: user.codeHistory });
//   } catch (err) {
//     console.error("Error saving code history:", err);
//     res.status(500).json({ error: "Failed to save code history" });
//   }
// });

// // Fetch all code history
// router.get("/", jwtAuthMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);
//     if (!user) return res.status(404).json({ error: "User not found" });

//     res.json({ history: user.codeHistory });
//   } catch (err) {
//     console.error("Error fetching code history:", err);
//     res.status(500).json({ error: "Failed to fetch code history" });
//   }
// });

// //fethc all rooms
// router.get("/rooms",jwtAuthMiddleware, async (req, res) => {
//   try {
//     // current logged-in user id from jwtAuthMiddleware
//     const userId = req.user.id;
//     console.log(userId);
    
//     const user = await User.findById(userId, "codeHistory.roomId");

//     if (!user || !user.codeHistory) {
//       return res.status(200).json({ message: "No rooms found yet", rooms: [] });
//     }

//     // Extract this user’s roomIds
//     const roomIds = user.codeHistory
//       .map(h => h.roomId)
//       .filter(roomId => roomId && roomId.trim() !== "");

//     const uniqueRooms = [...new Set(roomIds)];

//     res.json({ rooms: uniqueRooms });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// //fetch all code history for a specific id
// router.get("/:id", jwtAuthMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("codeHistory");
//     if (!user) return res.status(404).json({ error: "User not found" });

//     const item = user.codeHistory.id(req.params.id);
//     if (!item) return res.status(404).json({ error: "History not found" });

//     res.json(item);
//   } catch (err) {
//     console.error("Error fetching single history:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });


// // GET /history/room/:roomId
// router.get("/rooms/:roomId", jwtAuthMiddleware,async (req, res) => {
//   try {
//     const { roomId } = req.params;
//     const user = await User.findById(req.user.id);
//     const roomHistory = user.codeHistory.filter(h => h.roomId === roomId);
//     res.json({ history: roomHistory });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to fetch room history" });
//   }
// });

// // GET /rooms/:roomId/exist
// router.get("/rooms/:roomId/exist", async (req, res) => {
//   try {
//     const { roomId } = req.params;

//     // Check if the room exists in the Room collection
//     const room = await Room.findOne({ roomId });

//     res.json({ exists: !!room }); // true if found, false if not
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ exists: false });
//   }
// });

// // GET /rooms/:roomId/latest
// router.get("/rooms/:roomId/latest", jwtAuthMiddleware, async (req, res) => {
//   try {
//     const { roomId } = req.params;

//     // Find all users who have saved code for this room
//     const users = await User.find(
//       { "codeHistory.roomId": roomId },
//       { codeHistory: 1 }
//     );

//     let latestCode = null;

//     // Loop through users and their histories to find latest code for this room
//     users.forEach((user) => {
//       user.codeHistory.forEach((h) => {
//         if (h.roomId === roomId) {
//           if (!latestCode || h.createdAt > latestCode.createdAt) {
//             latestCode = h;
//           }
//         }
//       });
//     });

//     res.json({ code: latestCode ? latestCode.code : "" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ code: "" });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const jwtAuthMiddleware = require("../middleware/jwtAuth");
const historyController = require("../controllers/historyController");

// Save code snippet
router.post("/", jwtAuthMiddleware, historyController.saveHistory);

// Fetch all history
router.get("/", jwtAuthMiddleware, historyController.getAllHistory);

// Fetch all rooms
router.get("/rooms", jwtAuthMiddleware, historyController.getAllRooms);

// Fetch history by ID
router.get("/:id", jwtAuthMiddleware, historyController.getHistoryById);

// Fetch history for a specific room
router.get("/rooms/:roomId", jwtAuthMiddleware, historyController.getRoomHistory);

// Check if room exists
router.get("/rooms/:roomId/exist", historyController.checkRoomExist);

// Fetch latest code for a room
router.get("/rooms/:roomId/latest", jwtAuthMiddleware, historyController.getLatestCodeForRoom);

module.exports = router;
