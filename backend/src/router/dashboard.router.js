import { Router } from "express";
import verifyJwt from "../middlewares/auth.middleware.js";
import { getChannelStatus, getChannelVideo } from "../controller/dashboard.controler.js";

const router = Router()

// Public: anyone can view a channel's videos and stats
router.route('/get-videos/:userId').get(getChannelVideo)
router.route('/get-channel-status/:userId').get(getChannelStatus)

export default router
