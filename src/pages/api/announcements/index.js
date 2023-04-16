// pages/api/announcements/index.js
import { connect,disconnect } from "@/utils/db";
//import userModel from "@/models/userModel";
import Announcement from "@/models/announcements"

export default async function handler(req, res) {
  await connect();

  switch (req.method) {
    case 'GET':
      const announcements = await Announcement.find({});
      res.status(200).json(announcements);
      break;

    case 'POST':
      const newAnnouncement = new Announcement(req.body);
      await newAnnouncement.save();
      res.status(201).json(newAnnouncement);
      break;

    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  await disconnect();
}