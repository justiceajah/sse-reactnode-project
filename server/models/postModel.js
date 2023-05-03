const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    photo: { type: String, required: true },
    likes: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

const PostModel = mongoose.model("post", PostSchema);

module.exports = PostModel;
