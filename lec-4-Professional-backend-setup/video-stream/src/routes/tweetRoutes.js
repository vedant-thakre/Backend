import express from "express";
import { verifyJwt } from "../middlewares/authMiddleware.js";
import { createTweet, deleteTweet, getUserTweets, updateTweet } from "../controllers/tweetController.js";

const router = express.Router();

// secured route
router.use(verifyJwt); // Apply verifyJWT middleware to all routes in this file

router.post("/add-tweet", createTweet);
router.patch("/update-tweet", updateTweet);
router.delete("/delete-tweet/:id", deleteTweet);
router.get("/get-all-tweets", getUserTweets);

export default router;
