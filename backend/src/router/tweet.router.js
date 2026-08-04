import { Router } from "express";
import { createTweet, deleteTweet, getUserserTweets, updateTweet } from "../controller/tweet.controller.js";
import verifyJwt from "../middlewares/auth.middleware.js";

const router = new Router()
router.use(verifyJwt)
router.route("/publish").post(createTweet)
router.route("/update-tweet/:tweetId").patch(updateTweet)
router.route("/delete-tweet/:tweetId").patch(deleteTweet)
router.route("/get-tweets").get(getUserserTweets)

export default router
