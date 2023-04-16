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
  if (req.method !== "PUT")
    return res.status(405).json({ message: "Method not allowed" }).end();

  try {
    await connect();

    const courseSlug = req.query.course;
    const chapterSlug = req.query.chapter;
    const { title, id, markdown } = req.body;
    const slug = slugify(title);

    const course = await courseModel.findOne({ slug: courseSlug });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const chapterIndex = course.chapters.findIndex(
      (chapter) => chapter.slug === chapterSlug
    );

    if (chapterIndex === -1) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    course.chapters[chapterIndex].title = title;
    course.chapters[chapterIndex].id = id;
    course.chapters[chapterIndex].markdown = markdown;
    course.chapters[chapterIndex].slug = slug;

    const updatedCourse = await course.save();

    return res.status(200).json(updatedCourse);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export default isAuthenticated(handler, "moderator");
