import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    minLength: 3,
  },
  email: { type: String, trim: true, required: true, unique: true },
  avatarUrl: { type: String },
  socialOnly: { type: String, default: false },
  password: { type: String, trim: true },
  name: { type: String, trim: true, required: true },
  location: { type: String, trim: true, required: true },
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 5);
  }
});

const User = mongoose.model("User", userSchema);

export default User;
