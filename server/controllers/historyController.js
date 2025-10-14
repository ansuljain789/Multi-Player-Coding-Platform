// controllers/historyController.js
const User = require("../models/userModel");
const Room = require("../models/Room");

// Save code snippet to history
exports.saveHistory = async (req, res) => {
  const { code, language, roomId } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.codeHistory.push({ code, language, roomId });
    await user.save();

    res.json({ success: true, history: user.codeHistory });
  } catch (err) {
    console.error("Error saving code history:", err);
    res.status(500).json({ error: "Failed to save code history" });
  }
};

// Fetch all code history
exports.getAllHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ history: user.codeHistory });
  } catch (err) {
    console.error("Error fetching code history:", err);
    res.status(500).json({ error: "Failed to fetch code history" });
  }
};

// Fetch all rooms
exports.getAllRooms = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId, "codeHistory.roomId");

    if (!user || !user.codeHistory) {
      return res.status(200).json({ message: "No rooms found yet", rooms: [] });
    }

    const roomIds = user.codeHistory
      .map(h => h.roomId)
      .filter(roomId => roomId && roomId.trim() !== "");

    const uniqueRooms = [...new Set(roomIds)];
    res.json({ rooms: uniqueRooms });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch single history by ID
exports.getHistoryById = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("codeHistory");
    if (!user) return res.status(404).json({ error: "User not found" });

    const item = user.codeHistory.id(req.params.id);
    if (!item) return res.status(404).json({ error: "History not found" });

    res.json(item);
  } catch (err) {
    console.error("Error fetching single history:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Fetch history for specific room
exports.getRoomHistory = async (req, res) => {
  try {
    const { roomId } = req.params;
    const user = await User.findById(req.user.id);
    const roomHistory = user.codeHistory.filter(h => h.roomId === roomId);
    res.json({ history: roomHistory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch room history" });
  }
};

// Check if room exists
exports.checkRoomExist = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findOne({ roomId });
    res.json({ exists: !!room });
  } catch (err) {
    console.error(err);
    res.status(500).json({ exists: false });
  }
};

// Fetch latest code for room
exports.getLatestCodeForRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const users = await User.find({ "codeHistory.roomId": roomId }, { codeHistory: 1 });

    let latestCode = null;
    users.forEach((user) => {
      user.codeHistory.forEach((h) => {
        if (h.roomId === roomId) {
          if (!latestCode || h.createdAt > latestCode.createdAt) {
            latestCode = h;
          }
        }
      });
    });

    res.json({ code: latestCode ? latestCode.code : "" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: "" });
  }
};
