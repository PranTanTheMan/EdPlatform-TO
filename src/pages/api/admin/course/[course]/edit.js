import isAuthenticated from "@/middlewares/isAuthenticated";
import slugify from "@/utils/slug";
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
  const { slug } = req.query;
  const { title, description, instructor, duration, intro, chapters } =
    req.body;

  const newSlug = slugify(title);

  try {
    await connect();
    const course = await courseModel.findOneAndUpdate(
      { slug },
      {
        title,
        description,
        instructor,
        duration,
        intro,
        chapters,
        slug: newSlug,
      },
      { new: true }
    );
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }
    res.status(200).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

export default isAuthenticated(handler, "moderator");
