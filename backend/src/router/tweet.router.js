import { Router } from "express";
import { createTweet, deleteTweet, getAllTweets, getChannelTweets, getUserserTweets, updateTweet } from "../controller/tweet.controller.js";
import verifyJwt from "../middlewares/auth.middleware.js";

const router = new Router()
router.route("/publish").post(verifyJwt,createTweet)
router.route("/update-tweet/:tweetId").patch(verifyJwt,updateTweet)
router.route("/delete-tweet/:tweetId").patch(verifyJwt,deleteTweet)
router.route("/get-tweets").get(getAllTweets)
router.route("/get-user-tweet").get(verifyJwt,getUserserTweets)
router.route('/get-channel-tweet/:userId').get(getChannelTweets)

export default router
