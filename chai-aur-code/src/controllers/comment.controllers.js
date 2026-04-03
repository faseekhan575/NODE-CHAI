// 

import { comment } from "../models/comments.models.js";
import { asynchandler } from "../utils/asynchandler.js";
import ApiResponse from "../utils/Api_Respoonse.js";
import { ApiError } from "../utils/ApiErrors.js";

// FIX: was "usernamen" (typo) - now correctly populates username + avatar + fullname
// So comment owner is clickable and shows avatar/name in frontend
const getallvideocomments = asynchandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const allcomments = await comment
    .find({ videos: videoId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .populate({
      path: "owner",
      select: "username avatar fullname", // FIX: was "usernamen" (typo)
    });

  // Return empty array instead of 404 so frontend handles it gracefully
  return res
    .status(200)
    .json(new ApiResponse(200, allcomments, "Comments fetched successfully"));
});

const addacomment = asynchandler(async (req, res) => {
  const { content } = req.body;
  const { videoId } = req.params;

  if (!content || !content.trim()) {
    return res.status(400).json(new ApiError(400, "Please add a comment first"));
  }

  const addcomment = await comment.create({
    content: content.trim(),
    videos: videoId,
    owner: req.user._id,
  });

  if (!addcomment) {
    return res.status(500).json(new ApiError(500, "Server error: failed to post comment"));
  }

  // Populate owner so frontend immediately gets username + avatar
  const populated = await comment
    .findById(addcomment._id)
    .populate({
      path: "owner",
      select: "username avatar fullname",
    });

  return res.status(200).json(new ApiResponse(200, populated, "Comment added successfully"));
});

const updateacomment = asynchandler(async (req, res) => {
  const { content } = req.body;
  const { commentId } = req.params;

  if (!content || !content.trim()) {
    return res.status(400).json(new ApiError(400, "Please provide comment content"));
  }

  const updatecomment = await comment.findByIdAndUpdate(
    commentId,
    { $set: { content: content.trim() } },
    { new: true }
  ).populate({
    path: "owner",
    select: "username avatar fullname",
  });

  if (!updatecomment) {
    return res.status(404).json(new ApiError(404, "Comment not found"));
  }

  return res.status(200).json(new ApiResponse(200, updatecomment, "Comment updated successfully"));
});

const deleteacomment = asynchandler(async (req, res) => {
  const { commentId } = req.params;

  const deleted = await comment.findByIdAndDelete(commentId);

  if (!deleted) {
    return res.status(404).json(new ApiError(404, "Comment not found"));
  }

  return res.status(200).json(new ApiResponse(200, deleted, "Comment deleted successfully"));
});

export {
  addacomment,
  updateacomment,
  deleteacomment,
  getallvideocomments,
};