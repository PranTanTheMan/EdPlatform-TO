import isAuthenticated from "@/middlewares/isAuthenticated";

import { connect } from "@/utils/db";
import courseModel from "@/models/courseModel";

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
  const { course } = req.query;

  try {
    await connect();
    const courseData = await courseModel.findOne({ slug: course });
    if (!courseData) {
      res.status(404).json({ message: "Course not found" });
      return;
    }
    res.status(200).json(courseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default isAuthenticated(handler);
