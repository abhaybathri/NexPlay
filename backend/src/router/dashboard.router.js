import { Router } from "express";
import verifyJwt from "../middlewares/auth.middleware.js";
import { getChannelStatus, getChannelVideo } from "../controller/dashboard.controler.js";

const router = Router()
router.use(verifyJwt)
router.route('/get-channel-status').get(getChannelStatus)
router.route('/get-videos').get(getChannelVideo)

export default router