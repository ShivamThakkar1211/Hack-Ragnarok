import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  data: Buffer,
  size: Number,
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  pdf: fileSchema,  // ✅ Store PDF files
  ppt: fileSchema   // ✅ Store PPT files
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
