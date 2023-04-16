import mongoose from "mongoose";

mongoose.models = {};
mongoose.modelSchemas = {};

const chapterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Username is required"],
    },
    slug: {
      type: String,
      unique: true,
    },
    id: {
      type: Number,
      required: [true, "id is required"],
    },
    markdown: {
      type: String,
      required: [true, "markdown is required"],
    },
  },
  { timestamps: true }
);

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Username is required"],
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
    },
    instructor: {
      type: String,
      required: [true, "instructor is required"],
    },
    duration: {
      type: String,
      required: [true, "length is required"],
    },
    intro: {
      type: String,
      required: [true, "intro is required"],
    },
    chapters: [chapterSchema],
  },
  { timestamps: true }
);

export const ChapterModel = mongoose.model("Chapter", chapterSchema);
export default mongoose.model("Course", courseSchema);
