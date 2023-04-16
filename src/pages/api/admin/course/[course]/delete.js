import { connect } from "@/utils/db";
import courseModel from "@/models/courseModel";
import isAuthenticated from "@/middlewares/isAuthenticated";
import { ChapterModel } from "@/models/courseModel";

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

    const courseSlug = req.query.course;

    const deletedChapters = await ChapterModel.deleteMany({ courseSlug });

    const deletedCourse = await courseModel.findOneAndDelete({
      slug: courseSlug,
    });

    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json(deletedCourse);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export default isAuthenticated(handler, "admin");
