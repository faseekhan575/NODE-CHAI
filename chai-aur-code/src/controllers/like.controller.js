// 
import { likes } from "../models/likes.model.js";
import ApiResponse from "../utils/Api_Respoonse.js";
import { ApiError } from "../utils/ApiErrors.js";
import { asynchandler } from "../utils/asynchandler.js";
// FIX: removed wrong "import { comment } from 'postcss'" - that was a bug crashing the whole file

const likeonvideo = asynchandler(async (req, res) => {
  const { videoid } = req.params;
  const userid = req.user._id;

  const checklike = await likes.findOne({
    videos: videoid,   // FIX: model field is "videos" not "video"
    likeby: userid,
  });

  if (checklike) {
    await likes.findByIdAndDelete(checklike._id);
    return res.status(200).json(new ApiResponse(200, null, "Video unliked"));
  } else {
    const likeby = await likes.create({
      videos: videoid,  // FIX: model field is "videos"
      likeby: userid,
    });

    if (!likeby) {
      return res.status(500).json(new ApiError(500, "Failed to like video"));
    }

    return res.status(200).json(new ApiResponse(200, likeby, "Video liked"));
  }
});

const togglecommentlike = asynchandler(async (req, res) => {
  const { commentId } = req.params;
  const userid = req.user._id;

  const checkcommentlike = await likes.findOne({
    comment: commentId,  // model field is "comment" - correct
    likeby: userid,
  });

  if (checkcommentlike) {
    await likes.findByIdAndDelete(checkcommentlike._id);
    return res.status(200).json(new ApiResponse(200, null, "Comment unliked"));
  } else {
    const likeby = await likes.create({
      comment: commentId,
      likeby: userid,
    });

    if (!likeby) {
      return res.status(500).json(new ApiError(500, "Failed to like comment"));
    }

    return res.status(200).json(new ApiResponse(200, likeby, "Comment liked"));
  }
});

const toggletweettlike = asynchandler(async (req, res) => {
  const { tweetId } = req.params;
  const userid = req.user._id;

  const checktweetlike = await likes.findOne({
    tweet: tweetId,
    likeby: userid,
  });

  if (checktweetlike) {
    await likes.findByIdAndDelete(checktweetlike._id);
    return res.status(200).json(new ApiResponse(200, null, "Tweet unliked"));
  } else {
    const likeby = await likes.create({
      tweet: tweetId,
      likeby: userid,
    });

    if (!likeby) {
      return res.status(500).json(new ApiError(500, "Failed to like tweet"));
    }

    return res.status(200).json(new ApiResponse(200, likeby, "Tweet liked"));
  }
});

const getalllikedvideos = asynchandler(async (req, res) => {
  const userid = req.user._id;

  // FIX: populate "videos" field so frontend gets full video data (thumbnail, title etc.)
  const likedvideo = await likes
    .find({ likeby: userid, videos: { $exists: true, $ne: null } })
    .populate({
      path: "videos",
      select: "title thumbnail duration views createdAt",
      populate: {
        path: "owner",
        select: "username fullname avatar",
      },
    });

  return res
    .status(200)
    .json(new ApiResponse(200, likedvideo, "Liked videos fetched"));
});

export {
  likeonvideo,
  togglecommentlike,
  toggletweettlike,
  getalllikedvideos,
};