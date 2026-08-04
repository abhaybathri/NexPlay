import { Router } from "express";
import { getAllLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controller/like.controler.js";
import verifyJwt from "../middlewares/auth.middleware.js";

const router = Router()
router.use(verifyJwt)
router.route('/videos').get(getAllLikedVideos)
router.route('/toggle/v/:videoId').post(toggleVideoLike)
router.route('/toggle/c/:commentId').post(toggleCommentLike)
router.route('/toggle/t/:tweetId').post(toggleTweetLike)

export default router
