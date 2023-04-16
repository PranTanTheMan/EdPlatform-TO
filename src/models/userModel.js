import mongoose from "mongoose";

mongoose.models = {};
mongoose.modelSchemas = {};

const userProgressSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    chaptersCompleted: [
      {
        slug: String,
      },
    ],
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Username is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    progress: [userProgressSchema],
  },
  { timestamps: true }
);

export const userProgessModel = mongoose.model(
  "UserProgress",
  userProgressSchema
);

export default mongoose.model("User", userSchema);
