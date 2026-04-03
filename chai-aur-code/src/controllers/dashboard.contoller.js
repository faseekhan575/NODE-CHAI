// 
import mongoose from "mongoose";
import ApiResponse from "../utils/Api_Respoonse.js";
import { ApiError } from "../utils/ApiErrors.js";
import { Video } from "../models/video.models.js";
import { asynchandler } from "../utils/asynchandler.js";

const getallchannalstats = asynchandler(async (req, res) => {
  const userid = req.user._id;

  const totalstats = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userid),
      },
    },
    {
      $lookup: {
        from: "subscriptions",   // FIX: was "subscription" - Mongoose pluralizes model names
        localField: "owner",
        foreignField: "channel",
        as: "totalsubs",
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",       // FIX: was "owner" - likes are per video _id not owner
        foreignField: "videos",
        as: "totallikes",
      },
    },
    {
      $group: {
        _id: "$owner",
        totalviews: { $sum: "$views" },
        totalvideos: { $sum: 1 },
        totalsubs: { $first: "$totalsubs" },
        totallikes: { $push: "$totallikes" },
      },
    },
    {
      $addFields: {
        totalsubs: { $size: "$totalsubs" },
        totallikes: {
          $size: {
            $reduce: {
              input: "$totallikes",
              initialValue: [],
              in: { $concatArrays: ["$$value", "$$this"] },
            },
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalviews: 1,
        totalsubs: 1,
        totallikes: 1,
        totalvideos: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, totalstats, "Channel stats fetched"));
});

const getallvideosuploded = asynchandler(async (req, res) => {
  const user = req.user._id;

  const getallvideos = await Video.find({ owner: user }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, getallvideos, "All videos fetched successfully"));
});

export {
  getallchannalstats,
  getallvideosuploded,
};