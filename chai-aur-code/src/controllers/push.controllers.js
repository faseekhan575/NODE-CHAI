import { PushSubscription } from "../models/pushSubscription.models.js";
import ApiResponse from "../utils/Api_Respoonse.js";
import { ApiError }   from "../utils/ApiErrors.js";
import { asynchandler } from "../utils/asynchandler.js";

// POST /api/v10/push/subscribe
// Body: { endpoint, keys: { p256dh, auth } }
const subscribe = asynchandler(async (req, res) => {
  const user = req.user?._id;
  if (!user) return res.status(401).json(new ApiError(401, "Unauthorized"));

  const { endpoint, keys } = req.body;
  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return res.status(400).json(new ApiError(400, "Invalid subscription object"));
  }

  // Upsert — same endpoint can belong to only one user record
  await PushSubscription.findOneAndUpdate(
    { endpoint },
    { user, endpoint, keys },
    { upsert: true, new: true }
  );

  return res.status(201).json(new ApiResponse(201, null, "Subscribed to push notifications"));
});

// DELETE /api/v10/push/unsubscribe
// Body: { endpoint }
const unsubscribe = asynchandler(async (req, res) => {
  const { endpoint } = req.body;
  await PushSubscription.findOneAndDelete({ endpoint });
  return res.status(200).json(new ApiResponse(200, null, "Unsubscribed"));
});

// GET /api/v10/push/vapid-public-key  (called by frontend on load)
const getVapidPublicKey = asynchandler(async (_req, res) => {
  return res.status(200).json(
    new ApiResponse(200, { publicKey: process.env.VAPID_PUBLIC_KEY }, "VAPID key")
  );
});

export { subscribe, unsubscribe, getVapidPublicKey };