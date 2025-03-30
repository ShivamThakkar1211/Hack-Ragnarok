import mongoose from "mongoose";

const pdfSchema = new mongoose.Schema({
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
  pdf: pdfSchema // ✅ Add PDF schema field
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
