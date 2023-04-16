// models/Announcement.js
import mongoose from 'mongoose';
import { defineModel } from "../utils/db";

const AnnouncementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Announcement = defineModel("Announcement", AnnouncementSchema);

export default Announcement;