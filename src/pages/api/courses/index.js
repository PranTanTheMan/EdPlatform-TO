import isAuthenticated from "@/middlewares/isAuthenticated";
import courseModel from "@/models/courseModel";
import { connect } from "@/utils/db";
import userModel from "@/models/userModel";

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

    const courses = await courseModel.find({});

    const user = await userModel.findById(req?.user?._id);
    const userProgress = user?.progress;

    if (!userProgress) {
      return res.status(200).json(courses);
    }

    console.log(userProgress);

    const coursesWithProgress = courses.map((course) => {
      const courseExists = userProgress.find(
        (progress) => progress?.course?.toString() === course?._id?.toString()
      );

      if (!courseExists) {
        return {
          ...course.toObject(),
          enrolled: false,
          progress: 0,
        };
      }

      const enrolled = true;

      const progress = (
        (courseExists.chaptersCompleted.length / course?.chapters?.length) *
        100
      ).toFixed(0);

      console.log(progress);

      return {
        ...course.toObject(),
        enrolled,
        progress,
      };
    });

    res.status(200).json(coursesWithProgress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export default isAuthenticated(handler);
