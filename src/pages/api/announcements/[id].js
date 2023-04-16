// pages/api/announcements/[id].js
import { connect,disconnect } from "@/utils/db";
//import userModel from "@/models/userModel";
import Announcement from "@/models/announcements"

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  await connect();

  switch (method) {
    case 'GET':
      try {
        const announcement = await Announcement.findById(id);
        if (!announcement) {
          res.status(404).end(`Announcement with id ${id} not found`);
          return;
        }
        res.status(200).json(announcement);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
      break;

    case 'PUT':
      try {
        const updatedAnnouncement = await Announcement.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!updatedAnnouncement) {
          res.status(404).end(`Announcement with id ${id} not found`);
          return;
        }
        res.status(200).json(updatedAnnouncement);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
      break;

    case 'DELETE':
      try {
        const deletedAnnouncement = await Announcement.findByIdAndDelete(id);
        if (!deletedAnnouncement) {
          res.status(404).end(`Announcement with id ${id} not found`);
          return;
        }
        res.status(204).json({});
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
      break;

    default:
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  await disconnect();
}