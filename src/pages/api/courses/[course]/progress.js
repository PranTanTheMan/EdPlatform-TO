import userModel from "@/models/userModel";
import courseModel from "@/models/courseModel";
import { connect } from "@/utils/db";
import isAuthenticated from "@/middlewares/isAuthenticated";

const handler = async (req, res) => {
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
    const user = await userModel.findById(req.user._id);

    if (!user.progress) {
      return res.status(200).json([]);
    }

    const course = await courseModel.findOne({ slug: req.query.course });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const userCourseProgress = user.progress.find(
      (progress) => progress.course.toString() === course._id.toString()
    );

    if (!userCourseProgress) {
      return res.status(200).json({ progress: 0 });
    }

    const completedChapters = userCourseProgress.chaptersCompleted;
    console.log(completedChapters);

    res.status(200).json({ completedChapters });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default isAuthenticated(handler);
