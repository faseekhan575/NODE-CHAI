import { Router } from "express";
import {
  subscribe,
  unsubscribe,
  getVapidPublicKey,
} from "../controllers/push.controllers.js";
import jwtSecret from "../middlewares/auth.middelware.js";

const router = Router();

router.get("/vapid-public-key", getVapidPublicKey);          // public
router.post("/subscribe",   jwtSecret, subscribe);           // protected
router.delete("/unsubscribe", jwtSecret, unsubscribe);       // protected

export default router;