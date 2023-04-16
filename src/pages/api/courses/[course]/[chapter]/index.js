import isAuthenticated from "@/middlewares/isAuthenticated";
import { connect } from "@/utils/db";
import courseModel from "@/models/courseModel";

async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Content-Type, Authorization"
  );
  try {
    await connect();

    const course = await courseModel.findOne({ slug: req.query.course }).lean();
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const chapter = course.chapters.find(
      (chapter) => chapter.slug === req.query.chapter
    );

    const index = course.chapters.findIndex((ch) => ch.id === chapter.id);

    const previousChapter = index > 0 ? course.chapters[index - 1].slug : null;

    const nextChapter =
      index < course.chapters.length - 1
        ? course.chapters[index + 1].slug
        : null;

    if (chapter === undefined) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    res.status(200).json({ chapter, previousChapter, nextChapter });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

export default isAuthenticated(handler);
