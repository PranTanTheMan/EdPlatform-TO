import { connect } from "@/utils/db";
import userModel from "@/models/userModel";
import courseModel from "@/models/courseModel";
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
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connect();

    const user = await userModel.findById(req.user._id);

    const course = await courseModel.findOne({ slug: req.query.course }).lean();

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const userProgress = user.progress.find(
      (progress) => progress.course.toString() === course._id.toString()
    );

    if (!userProgress) {
      await userModel.findOneAndUpdate(
        { _id: req.user._id },
        {
          $push: {
            progress: {
              course: course._id,
              enrolled: true,
              chaptersCompleted: [{ slug: req.query.chapter }],
            },
          },
        },
        { new: true }
      );

      return res
        .status(200)
        .json({ message: "enrolled & Chapter added to progress" });
    }

    if (
      userProgress.chaptersCompleted
        .map((chapter) => chapter.slug)
        .includes(req.query.chapter)
    ) {
      return res.status(200).json({ message: "Chapter already completed" });
    }

    userProgress.chaptersCompleted.push({ slug: req.query.chapter });

    await user.save();

    res.status(200).json({ message: "Chapter added to progress" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default isAuthenticated(handler);
