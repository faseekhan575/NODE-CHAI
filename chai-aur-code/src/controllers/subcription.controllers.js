// 
import ApiResponse from "../utils/Api_Respoonse.js";
import { ApiError } from "../utils/ApiErrors.js";
import { subscription } from "../models/susbription.js";
import { asynchandler } from "../utils/asynchandler.js";
import User from "../models/user.models.js";
import { sendPushToUser } from "../utils/sendPushNotification.js";


const togglesubcription = asynchandler(async (req, res) => {
  const { channalid } = req.params;
  const user = req.user?._id;

  const isSubscribed = await subscription.findOne({
    subscriber: user,
    channel: channalid,
  });

  if (isSubscribed) {
    await subscription.findByIdAndDelete(isSubscribed._id);
    return res
      .status(200)
      .json(new ApiResponse(200, { subscribe: false }, "Unsubscribed"));
  } else {
    await subscription.create({ subscriber: user, channel: channalid });

    // 🔔 Notify the channel owner that someone subscribed
    try {
      const subscriber = await User.findById(user).select("username fullname avatar");
      await sendPushToUser(channalid, {
        title: "New Subscriber! 🎉",
        body: `${subscriber?.fullname || subscriber?.username} just subscribed to your channel`,
        icon: subscriber?.avatar || "/icons/icon-192x192.png",
        url: `/channel/${user}`,   // deep-link on click
      });
    } catch (e) {
      console.error("Push (subscribe) error:", e.message);
    }

    return res
      .status(200)
      .json(new ApiResponse(200, { subscribe: true }, "Subscribed"));
  }
});

const getuserchannalsubcribers = asynchandler(async (req, res) => {
  const { channalid } = req.params;
  const subcribers = await subscription
    .find({ channel: channalid })
    .populate({ path: "subscriber", select: "username fullname avatar" });
  return res.status(200).json(new ApiResponse(200, subcribers, "Subscribers fetched"));
});

// FIX: "me" or any ID both work — uses logged-in user if "me"
const getsubcribedchannels = asynchandler(async (req, res) => {
  const { subscribeID } = req.params;
  const userId = (!subscribeID || subscribeID === "me") ? req.user._id : subscribeID;

  const channels = await subscription
    .find({ subscriber: userId })
    .populate({ path: "channel", select: "username fullname avatar" });

  return res.status(200).json(new ApiResponse(200, channels, "Subscribed channels fetched"));
});

export { togglesubcription, getsubcribedchannels, getuserchannalsubcribers };