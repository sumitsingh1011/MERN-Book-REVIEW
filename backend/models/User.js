// src/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // Add this import

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  profilePicture: {
    type: String,
    default: "",
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
  ],
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
   tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  lastActive: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// // Hash password before saving
// userSchema.pre("save", async function (next) {
//   const user = this;
//   if (user.isModified("password")) {
//     user.password = await bcrypt.hash(user.password, 8);
//   }
//   next();
// });

// // Generate auth token
// userSchema.methods.generateAuthToken = async function () {
//   const user = this;
//   const token = jwt.sign(
//     { _id: user._id.toString() },
//     process.env.JWT_SECRET || "your-fallback-secret"
//   );
//   user.tokens = user.tokens.concat({ token });
//   await user.save();
//   return token;
// };

// // Validate password
// userSchema.methods.validatePassword = async function (password) {
//   return bcrypt.compare(password, this.password);
// };

// // Remove sensitive info when converting to JSON
// userSchema.methods.toJSON = function () {
//   const user = this.toObject();
//   delete user.password;
//   delete user.tokens;
//   return user;
// };

const User = mongoose.model("User", userSchema);
module.exports = User;
