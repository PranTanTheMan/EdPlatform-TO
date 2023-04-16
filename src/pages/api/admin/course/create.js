import { connect } from "@/utils/db";
import courseModel from "@/models/courseModel";
import isAuthenticated from "@/middlewares/isAuthenticated";
import slugify from "@/utils/slug";

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
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  try {
    await connect();
    const { title, description, instructor, duration, intro } = req.body;

    if (!title || !description || !instructor || !duration || !intro) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const slug = slugify(title);

    const course = new courseModel({
      title,
      slug,
      description,
      instructor,
      duration,
      intro,
      chapters: [],
    });

    const newCourse = await course.save();

    return res.status(201).json(newCourse);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export default isAuthenticated(handler, "moderator");
