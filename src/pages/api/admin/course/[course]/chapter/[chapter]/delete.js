import { connect } from "@/utils/db";
import courseModel from "@/models/courseModel";
import isAuthenticated from "@/middlewares/isAuthenticated";

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
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" }).end();
  }

  try {
    await connect();

    const { courseId, chapterId } = req.query;

    const course = await courseModel.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const deletedChapter = course.chapters.id(chapterId).remove();

    await course.save();

    return res.status(200).json(deletedChapter);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export default isAuthenticated(handler, "moderator");
