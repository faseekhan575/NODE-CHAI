// import { asynchandler } from "../utils/asynchandler.js";
// import { ApiError } from "../utils/ApiErrors.js";
// import User from "../models/user.models.js";
// import ApiResponse from "../utils/Api_Respoonse.js";
// import uplodeImage from "../models/cloudniary.js";
// import jwt from "jsonwebtoken";
// import mongoose from "mongoose";

// // ✅ FIX 1: Auto-create public/temp folder on server start
// import fs from "fs";
// import path from "path";
// const tempDir = path.join(process.cwd(), "public/temp");
// if (!fs.existsSync(tempDir)) {
//   fs.mkdirSync(tempDir, { recursive: true });
// }

// // ─────────────────────────────────────────────
// // REGISTER
// // ─────────────────────────────────────────────
// const registerUser = asynchandler(async (req, res) => {
//   const { username, fullname, email, passward } = req.body;

//   console.log("req.files:", req.files);
//   console.log("req.body:", req.body);

//   // ✅ FIX 2: Also check passward in required fields
//   if (!username || !fullname || !email || !passward) {
//     return res.status(400).json({
//       message: "Please fill all required fields",
//     });
//   }

//   const findinguser = await User.findOne({
//     $or: [{ username }, { email }],
//   });

//   if (findinguser) {
//     throw new ApiError(409, "User with this email already exists");
//   }

//   const avatarPath = req.files?.avatar?.[0]?.path;
//   const coverPath = req.files?.coverImage?.[0]?.path;

//   // ✅ FIX 3: Only avatar is required, cover is optional
//   if (!avatarPath) {
//     throw new ApiError(400, "Please upload avatar file");
//   }

//   const avatar = await uplodeImage(avatarPath);

//   // ✅ FIX 4: Upload cover only if provided
//   let coverIamges = null;
//   if (coverPath) {
//     coverIamges = await uplodeImage(coverPath);
//   }

//   if (!avatar) {
//     throw new ApiError(400, "Failed to upload avatar to Cloudinary");
//   }

//   const users = await User.create({
//     fullname,
//     avatar: avatar.url,
//     coverImages: coverIamges?.url || "", // ✅ FIX 5: safe fallback
//     email,
//     passward,
//     username: username.toLowerCase(), // ✅ FIX 6: store lowercase
//     tokens: 0,
//   });

//   const createuser = await User.findById(users._id).select("-passward -tokens");

//   if (!createuser) {
//     throw new ApiError(500, "Error while saving user, please try again");
//   }

//   // ✅ FIX 7: Return ApiResponse correctly (not nested in message)
//   return res.status(201).json(new ApiResponse(201, createuser, "User created successfully"));
// });

// // ─────────────────────────────────────────────
// // GENERATE ACCESS & REFRESH TOKEN
// // ─────────────────────────────────────────────
// const GenrateAccessandRefershToken = async (UserId) => {
//   try {
//     const user = await User.findById(UserId);
//     const accesstoken = user.generateAccessToken();
//     const refreshtoken = user.generateRefreshToken();

//     user.refreshtoken = refreshtoken;
//     await user.save({ validateBeforeSave: false });

//     return { accesstoken, refreshtoken };
//   } catch (error) {
//     throw new ApiError(500, "Something went wrong while generating tokens");
//   }
// };

// // ─────────────────────────────────────────────
// // LOGIN
// // ─────────────────────────────────────────────
// const LoginUser = asynchandler(async (req, res) => {
//   const { username, email, passward } = req.body;

//   if (!(username || email) || !passward) {
//     // ✅ FIX 8: return to stop execution
//     return res.status(401).json({
//       message: "Please enter username/email and password",
//     });
//   }

//   const checkUser = await User.findOne({
//     $or: [{ username }, { email }],
//   });

//   if (!checkUser) {
//     // ✅ FIX 9: return to stop execution
//     return res.status(401).json({
//       message: "Username or email doesn't exist",
//     });
//   }

//   const passwardValidation = await checkUser.isPasswordCorrect(passward);

//   if (!passwardValidation) {
//     // ✅ FIX 10: return to stop execution
//     return res.status(401).json({
//       message: "Incorrect password",
//     });
//   }

//   const { accesstoken, refreshtoken } = await GenrateAccessandRefershToken(checkUser._id);

//   checkUser.tokens = checkUser.tokens
//     ? [...checkUser.tokens, refreshtoken]
//     : [refreshtoken];
//   await checkUser.save();

//   const LoggedinUser = await User.findById(checkUser._id).select("-passward -tokens");

//   // ✅ FIX 11: Use secure:true on production (Railway uses HTTPS)
//   const options = {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//   };

//   return res
//     .status(200)
//     .cookie("accesstoken", accesstoken, options)
//     .cookie("refreshtoken", refreshtoken, options)
//     .json(
//       new ApiResponse(200, { user: LoggedinUser, accesstoken, refreshtoken }, "User logged in successfully")
//     );
// });

// // ─────────────────────────────────────────────
// // LOGOUT
// // ─────────────────────────────────────────────
// const LogoutUser = asynchandler(async (req, res) => {
//   await User.findByIdAndUpdate(
//     req.user._id,
//     { $set: { refreshtoken: null } },
//     { new: true }
//   );

//   const options = {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//   };

//   return res
//     .status(200)
//     .clearCookie("accesstoken", options)
//     .clearCookie("refreshtoken", options)
//     .json({ success: true, message: "User logged out successfully" });
// });

// // ─────────────────────────────────────────────
// // REFRESH TOKEN
// // ─────────────────────────────────────────────
// export const generateRefreshToken = asynchandler(async (req, res) => {
//   const genratingrefreshtoken = req.cookies?.refreshtoken || req.body.refreshtoken;

//   if (!genratingrefreshtoken) {
//     throw new ApiError(401, "Unauthorized user access");
//   }

//   const verifyrefreshtoken = jwt.verify(genratingrefreshtoken, process.env.REFRESH_TOKEN);

//   if (!verifyrefreshtoken) {
//     throw new ApiError(401, "Unmatched token");
//   }

//   const finduser = await User.findById(verifyrefreshtoken._id);

//   if (!finduser) {
//     throw new ApiError(401, "User not found");
//   }

//   if (!finduser.tokens.includes(genratingrefreshtoken)) {
//     throw new ApiError(401, "Token is expired");
//   }

//   const options = {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//   };

//   const { accesstoken, refreshtoken } = await GenrateAccessandRefershToken(finduser._id);

//   return res
//     .cookie("accesstoken", accesstoken, options)
//     .cookie("refreshtoken", refreshtoken, options)
//     .json(new ApiResponse(200, { accesstoken, refreshtoken }, "Refresh token done"));
// });

// // ─────────────────────────────────────────────
// // RESET PASSWORD
// // ─────────────────────────────────────────────
// export const resetpasswardss = asynchandler(async (req, res) => {
//   const { oldapassward, newpassward, conform_passward } = req.body;

//   const finduser = await User.findById(req.user?._id);
//   const checkpassward = await finduser.isPasswordCorrect(oldapassward);

//   if (!checkpassward) {
//     throw new ApiError(400, "Invalid old password"); // ✅ FIX 12: was missing "new"
//   }

//   if (!(newpassward === conform_passward)) {
//     throw new ApiError(400, "New password and confirm password don't match"); // ✅ FIX 13: same
//   }

//   finduser.passward = newpassward;
//   await finduser.save({ validateBeforeSave: false });

//   return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
// });

// // ─────────────────────────────────────────────
// // GET CURRENT USER
// // ─────────────────────────────────────────────
// export const getcurrentuser = asynchandler(async (req, res) => {
//   return res.status(200).json(new ApiResponse(200, req.user, "Current user fetched successfully"));
// });

// // ─────────────────────────────────────────────
// // UPDATE EMAIL / NAME / FULLNAME
// // ─────────────────────────────────────────────
// const Updateemailandnameandfullname = asynchandler(async (req, res) => {
//   const { username, email, fullname } = req.body;

//   if (!(username || email || fullname)) {
//     throw new ApiError(400, "Please provide username, email, or fullname to update");
//   }

//   const user = await User.findByIdAndUpdate(
//     req.user._id,
//     { $set: { username, email, fullname } },
//     { new: true }
//   ).select("-passward");

//   if (!user) {
//     throw new ApiError(404, "User not found");
//   }

//   res.status(200).json(new ApiResponse(200, user, "User updated successfully"));
// });

// // ─────────────────────────────────────────────
// // UPDATE AVATAR
// // ─────────────────────────────────────────────
// const updateprofilepicture = asynchandler(async (req, res) => {
//   const avatar = req.file;

//   if (!avatar) {
//     throw new ApiError(400, "Avatar file not found");
//   }

//   const uplodedavatar = await uplodeImage(avatar.path);

//   if (!uplodedavatar) {
//     throw new ApiError(400, "Failed to upload image to Cloudinary");
//   }

//   const saveingimage = await User.findByIdAndUpdate(
//     req.user._id,
//     { $set: { avatar: uplodedavatar.url } },
//     { new: true }
//   ).select("-passward");

//   if (!saveingimage) {
//     throw new ApiError(400, "Error while updating avatar image");
//   }

//   return res.status(200).json(new ApiResponse(200, saveingimage, "Avatar updated successfully"));
// });

// // ─────────────────────────────────────────────
// // UPDATE COVER IMAGE
// // ─────────────────────────────────────────────
// const updatecoverimage = asynchandler(async (req, res) => {
//   const coverimage = req.file;

//   if (!coverimage) {
//     throw new ApiError(400, "Cover image file not found");
//   }

//   const coverimageuplode = await uplodeImage(coverimage.path);

//   if (!coverimageuplode) {
//     throw new ApiError(400, "Failed to upload image to Cloudinary");
//   }

//   const savingcoverimage = await User.findByIdAndUpdate(
//     req.user._id,
//     { $set: { coverImages: coverimageuplode.url } },
//     { new: true }
//   ).select("-passward");

//   if (!savingcoverimage) {
//     throw new ApiError(400, "Error while updating cover image");
//   }

//   return res.status(200).json(new ApiResponse(200, savingcoverimage, "Cover image updated successfully"));
// });

// // ─────────────────────────────────────────────
// // GET CHANNEL PROFILE
// // ─────────────────────────────────────────────
// export const getuserchannalprofile = asynchandler(async (req, res) => {
//   const { username } = req.params;

//   if (!username?.trim()) {
//     throw new ApiError(400, "Username is missing");
//   }

//   const channel = await User.aggregate([
//     { $match: { username: username?.toLowerCase() } },
//     {
//       $lookup: {
//         from: "subscriptions",
//         localField: "_id",
//         foreignField: "channel",
//         as: "subscribers",
//       },
//     },
//     {
//       $lookup: {
//         from: "subscriptions",
//         localField: "_id",
//         foreignField: "subscriber",
//         as: "subcribedTO",
//       },
//     },
//     {
//       $addFields: {
//         subcriberscount: { $size: "$subscribers" },
//         channelSubcribedtocount: { $size: "$subcribedTO" },
//         issubcsribed: {
//           $cond: {
//             if: { $in: [req.user?._id, "$subscribers.subscriber"] },
//             then: true,
//             else: false,
//           },
//         },
//       },
//     },
//     {
//       $project: {
//         fullname: 1,
//         username: 1,
//         subcriberscount: 1,
//         channelSubcribedtocount: 1,
//         avatar: 1,
//         coverImages: 1,
//         email: 1,
//       },
//     },
//   ]);

//   if (!channel?.length) {
//     throw new ApiError(404, "Channel does not exist");
//   }

//   return res.status(200).json(new ApiResponse(200, channel[0], "User channel fetched successfully"));
// });

// // ─────────────────────────────────────────────
// // GET WATCH HISTORY
// // ─────────────────────────────────────────────
// export const get_watchedhistory = asynchandler(async (req, res) => {
//   const user = await User.aggregate([
//     { $match: { _id: new mongoose.Types.ObjectId(req.user._id) } },
//     {
//       $lookup: {
//         from: "videos",
//         localField: "watchedhistory",
//         foreignField: "_id",
//         as: "watchedhistory",
//         pipeline: [
//           {
//             $lookup: {
//               from: "users", // ✅ FIX 14: was "User", should be lowercase "users"
//               localField: "owner",
//               foreignField: "_id",
//               as: "owner",
//               pipeline: [
//                 { $project: { fullname: 1, username: 1, avatar: 1 } },
//               ],
//             },
//           },
//           { $addFields: { owner: { $first: "$owner" } } },
//         ],
//       },
//     },
//   ]);

//   return res
//     .status(200)
//     .json(new ApiResponse(200, user[0].watchedhistory, "Watch history fetched successfully")); // ✅ FIX 15: was watchhistory (typo)
// });

// // ─────────────────────────────────────────────
// // PRACTICE
// // ─────────────────────────────────────────────
// export const createproduct = asynchandler(async (req, res) => {
//   if (!req.body.name) {
//     return res.status(400).json({ message: "Missing name to create product" });
//   }
//   return res.status(201).json({ message: "Product created successfully" });
// });

// // ─────────────────────────────────────────────
// // EXPORTS
// // ─────────────────────────────────────────────
// export default registerUser;
// export { LoginUser };
// export { GenrateAccessandRefershToken };
// export { LogoutUser };
// export { Updateemailandnameandfullname };
// export { updateprofilepicture };
// export { updatecoverimage };
import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import User from "../models/user.models.js";
import ApiResponse from "../utils/Api_Respoonse.js";
import uplodeImage from "../models/cloudniary.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// ─────────────────────────────────────────────
// REGISTER
// ─────────────────────────────────────────────
const registerUser = asynchandler(async (req, res) => {
  const { username, fullname, email, passward } = req.body;

  console.log("req.files:", req.files);
  console.log("req.body:", req.body);

  if (!username || !fullname || !email || !passward) {
    return res.status(400).json({ message: "Please fill all required fields" });
  }

  const findinguser = await User.findOne({ $or: [{ username }, { email }] });

  if (findinguser) {
    throw new ApiError(409, "User with this email already exists");
  }

  // ✅ FIXED: .buffer instead of .path
  const avatarBuffer = req.files?.avatar?.[0]?.buffer;
  const coverBuffer = req.files?.coverImage?.[0]?.buffer;

  if (!avatarBuffer) {
    throw new ApiError(400, "Please upload avatar file");
  }

  const avatar = await uplodeImage(avatarBuffer);

  let coverIamges = null;
  if (coverBuffer) {
    coverIamges = await uplodeImage(coverBuffer);
  }

  if (!avatar) {
    throw new ApiError(400, "Failed to upload avatar to Cloudinary");
  }

  const users = await User.create({
    fullname,
    avatar: avatar.url,
    coverImages: coverIamges?.url || "",
    email,
    passward,
    username: username.toLowerCase(),
    tokens: 0,
  });

  const createuser = await User.findById(users._id).select("-passward -tokens");

  if (!createuser) {
    throw new ApiError(500, "Error while saving user, please try again");
  }

  return res.status(201).json(new ApiResponse(201, createuser, "User created successfully"));
});

// ─────────────────────────────────────────────
// GENERATE ACCESS & REFRESH TOKEN
// ─────────────────────────────────────────────
const GenrateAccessandRefershToken = async (UserId) => {
  try {
    const user = await User.findById(UserId);
    const accesstoken = user.generateAccessToken();
    const refreshtoken = user.generateRefreshToken();

    user.refreshtoken = refreshtoken;
    await user.save({ validateBeforeSave: false });

    return { accesstoken, refreshtoken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

// ─────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────
const LoginUser = asynchandler(async (req, res) => {
  const { username, email, passward } = req.body;

  if (!(username || email) || !passward) {
    return res.status(401).json({ message: "Please enter username/email and password" });
  }

  const checkUser = await User.findOne({ $or: [{ username }, { email }] });

  if (!checkUser) {
    return res.status(401).json({ message: "Username or email doesn't exist" });
  }

  const passwardValidation = await checkUser.isPasswordCorrect(passward);

  if (!passwardValidation) {
    return res.status(401).json({ message: "Incorrect password" });
  }

  const { accesstoken, refreshtoken } = await GenrateAccessandRefershToken(checkUser._id);

  checkUser.tokens = checkUser.tokens
    ? [...checkUser.tokens, refreshtoken]
    : [refreshtoken];
  await checkUser.save();

  const LoggedinUser = await User.findById(checkUser._id).select("-passward -tokens");

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  return res
    .status(200)
    .cookie("accesstoken", accesstoken, options)
    .cookie("refreshtoken", refreshtoken, options)
    .json(new ApiResponse(200, { user: LoggedinUser, accesstoken, refreshtoken }, "User logged in successfully"));
});

// ─────────────────────────────────────────────
// LOGOUT
// ─────────────────────────────────────────────
const LogoutUser = asynchandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $set: { refreshtoken: null } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  return res
    .status(200)
    .clearCookie("accesstoken", options)
    .clearCookie("refreshtoken", options)
    .json({ success: true, message: "User logged out successfully" });
});

// ─────────────────────────────────────────────
// REFRESH TOKEN
// ─────────────────────────────────────────────
export const generateRefreshToken = asynchandler(async (req, res) => {
  const genratingrefreshtoken = req.cookies?.refreshtoken || req.body.refreshtoken;

  if (!genratingrefreshtoken) {
    throw new ApiError(401, "Unauthorized user access");
  }

  const verifyrefreshtoken = jwt.verify(genratingrefreshtoken, process.env.REFRESH_TOKEN);

  if (!verifyrefreshtoken) {
    throw new ApiError(401, "Unmatched token");
  }

  const finduser = await User.findById(verifyrefreshtoken._id);

  if (!finduser) {
    throw new ApiError(401, "User not found");
  }

  if (!finduser.tokens.includes(genratingrefreshtoken)) {
    throw new ApiError(401, "Token is expired");
  }

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  const { accesstoken, refreshtoken } = await GenrateAccessandRefershToken(finduser._id);

  return res
    .cookie("accesstoken", accesstoken, options)
    .cookie("refreshtoken", refreshtoken, options)
    .json(new ApiResponse(200, { accesstoken, refreshtoken }, "Refresh token done"));
});

// ─────────────────────────────────────────────
// RESET PASSWORD
// ─────────────────────────────────────────────
export const resetpasswardss = asynchandler(async (req, res) => {
  const { oldapassward, newpassward, conform_passward } = req.body;

  const finduser = await User.findById(req.user?._id);
  const checkpassward = await finduser.isPasswordCorrect(oldapassward);

  if (!checkpassward) {
    throw new ApiError(400, "Invalid old password");
  }

  if (newpassward !== conform_passward) {
    throw new ApiError(400, "New password and confirm password don't match");
  }

  finduser.passward = newpassward;
  await finduser.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});

// ─────────────────────────────────────────────
// GET CURRENT USER
// ─────────────────────────────────────────────
export const getcurrentuser = asynchandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

// ─────────────────────────────────────────────
// UPDATE EMAIL / NAME / FULLNAME
// ─────────────────────────────────────────────
const Updateemailandnameandfullname = asynchandler(async (req, res) => {
  const { username, email, fullname } = req.body;

  if (!(username || email || fullname)) {
    throw new ApiError(400, "Please provide username, email, or fullname to update");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { username, email, fullname } },
    { new: true }
  ).select("-passward");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json(new ApiResponse(200, user, "User updated successfully"));
});

// ─────────────────────────────────────────────
// UPDATE AVATAR
// ─────────────────────────────────────────────
const updateprofilepicture = asynchandler(async (req, res) => {
  const avatar = req.file;

  if (!avatar) {
    throw new ApiError(400, "Avatar file not found");
  }

  // ✅ FIXED: .buffer instead of .path
  const uplodedavatar = await uplodeImage(avatar.buffer);

  if (!uplodedavatar) {
    throw new ApiError(400, "Failed to upload image to Cloudinary");
  }

  const saveingimage = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { avatar: uplodedavatar.url } },
    { new: true }
  ).select("-passward");

  if (!saveingimage) {
    throw new ApiError(400, "Error while updating avatar image");
  }

  return res.status(200).json(new ApiResponse(200, saveingimage, "Avatar updated successfully"));
});

// ─────────────────────────────────────────────
// UPDATE COVER IMAGE
// ─────────────────────────────────────────────
const updatecoverimage = asynchandler(async (req, res) => {
  const coverimage = req.file;

  if (!coverimage) {
    throw new ApiError(400, "Cover image file not found");
  }

  // ✅ FIXED: .buffer instead of .path
  const coverimageuplode = await uplodeImage(coverimage.buffer);

  if (!coverimageuplode) {
    throw new ApiError(400, "Failed to upload image to Cloudinary");
  }

  const savingcoverimage = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { coverImages: coverimageuplode.url } },
    { new: true }
  ).select("-passward");

  if (!savingcoverimage) {
    throw new ApiError(400, "Error while updating cover image");
  }

  return res.status(200).json(new ApiResponse(200, savingcoverimage, "Cover image updated successfully"));
});

// ─────────────────────────────────────────────
// GET CHANNEL PROFILE
// ─────────────────────────────────────────────
export const getuserchannalprofile = asynchandler(async (req, res) => {
  const { username } = req.params;

  if (!username?.trim()) {
    throw new ApiError(400, "Username is missing");
  }

  const channel = await User.aggregate([
    { $match: { username: username?.toLowerCase() } },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subcribedTO",
      },
    },
    {
      $addFields: {
        subcriberscount: { $size: "$subscribers" },
        channelSubcribedtocount: { $size: "$subcribedTO" },
        issubcsribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullname: 1,
        username: 1,
        subcriberscount: 1,
        channelSubcribedtocount: 1,
        avatar: 1,
        coverImages: 1,
        email: 1,
      },
    },
  ]);

  if (!channel?.length) {
    throw new ApiError(404, "Channel does not exist");
  }

  return res.status(200).json(new ApiResponse(200, channel[0], "User channel fetched successfully"));
});

// ─────────────────────────────────────────────
// GET WATCH HISTORY
// ─────────────────────────────────────────────
export const get_watchedhistory = asynchandler(async (req, res) => {
  const user = await User.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(req.user._id) } },
    {
      $lookup: {
        from: "videos",
        localField: "watchedhistory",
        foreignField: "_id",
        as: "watchedhistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                { $project: { fullname: 1, username: 1, avatar: 1 } },
              ],
            },
          },
          { $addFields: { owner: { $first: "$owner" } } },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, user[0].watchedhistory, "Watch history fetched successfully"));
});

// ─────────────────────────────────────────────
// PRACTICE
// ─────────────────────────────────────────────
export const createproduct = asynchandler(async (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ message: "Missing name to create product" });
  }
  return res.status(201).json({ message: "Product created successfully" });
});

// ─────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────
export default registerUser;
export { LoginUser };
export { GenrateAccessandRefershToken };
export { LogoutUser };
export { Updateemailandnameandfullname };
export { updateprofilepicture };
export { updatecoverimage };