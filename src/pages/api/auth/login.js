import { connect } from "@/utils/db";
import userModel from "@/models/userModel";

import bcryptjs from "bcryptjs";
import generateToken from "@/utils/generateJWT";
import { serialize } from "cookie";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method !== "POST") return res.status(405).end();

  try {
    await connect();
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    const user = await userModel.findOne({ email });

    if (user && bcryptjs.compareSync(password, user.password)) {
      const JWT = generateToken(user.id);

      res.setHeader(
        "Set-Cookie",
        serialize("auth", JWT, {
          maxAge: 60 * 60 * 24 * 7, // 1 week
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
        })
      );
      return res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: JWT,
      });
    } else {
      return res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
}
