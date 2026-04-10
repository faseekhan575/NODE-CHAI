import webpush from "web-push";

webpush.setVapidDetails(
  process.env.VAPID_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

/**
 * Send push notification to a single subscription doc
 * @param {Object} subscriptionDoc  - PushSubscription mongoose doc
 * @param {Object} payload          - { title, body, icon, url }
 */
export const sendPush = async (subscriptionDoc, payload) => {
  const pushConfig = {
    endpoint: subscriptionDoc.endpoint,
    keys: {
      p256dh: subscriptionDoc.keys.p256dh,
      auth:   subscriptionDoc.keys.auth,
    },
  };

  try {
    await webpush.sendNotification(pushConfig, JSON.stringify(payload));
  } catch (err) {
    // 410 = subscription expired/unsubscribed — safe to delete
    if (err.statusCode === 410) {
      await subscriptionDoc.deleteOne();
      console.log("Removed stale push subscription");
    } else {
      console.error("Push error:", err.message);
    }
  }
};

/**
 * Send push notification to ALL subscriptions of a user
 * @param {ObjectId} userId
 * @param {Object}   payload - { title, body, icon, url }
 */
export const sendPushToUser = async (userId, payload) => {
  const { PushSubscription } = await import(
    "../models/pushSubscription.models.js"
  );
  const subs = await PushSubscription.find({ user: userId });
  await Promise.all(subs.map((sub) => sendPush(sub, payload)));
};