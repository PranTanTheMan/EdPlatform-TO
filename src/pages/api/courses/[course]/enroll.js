import isAuthenticated from "@/middlewares/isAuthenticated";
import userModel from "@/models/userModel";
import courseModel from "@/models/courseModel";
import { connect } from "@/utils/db";

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
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connect();

    const course = await courseModel.findOne({ slug: req.query.course });
    const userProgress = await userModel.findOneAndUpdate(
      { _id: req.user._id, "progress.course": course._id },
      { $set: { "progress.$.enrolled": true } },
      { new: true }
    );

    if (!userProgress) {
      await userModel.findOneAndUpdate(
        { _id: req.user._id },
        { $push: { progress: { course: course._id, enrolled: true } } },
        { new: true }
      );
    }
    return res.status(200).json({ message: "Enrollment updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
export default isAuthenticated(handler);
