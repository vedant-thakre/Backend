import express from "express";
import { verifyJwt } from "../middlewares/authMiddleware.js";
import { addSubscription, getSubscribedChannels, getUserChannelSubscribers, unsusbscribeChannel } from "../controllers/subscriptionController.js";

const router = express.Router();

// secured route
router.use(verifyJwt); // Apply verifyJWT middleware to all routes in this file

router.post("/add-subscription/:channelId", addSubscription);
router.get("/subscriber-list/:channelId", getUserChannelSubscribers);
router.get("/channel-list/:subscriberId", getSubscribedChannels);
router.delete("/remove-subscription/:channelId", unsusbscribeChannel);

export default router;
