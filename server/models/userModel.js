

const mongoose = require("mongoose");

const codeHistorySchema = new mongoose.Schema({
  code: { type: String, required: true },
  language: { type: String, required: true },
   roomId: { type: String, required: false}, 
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },

  // 👇 history is stored here
  codeHistory: [codeHistorySchema]
});

const User = mongoose.model("User", userSchema);

module.exports = User;
