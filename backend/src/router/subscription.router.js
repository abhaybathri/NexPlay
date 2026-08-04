import { Router } from "express";
import verifyJwt from "../middlewares/auth.middleware.js";
import { getSubscribedChannels, getUserChannelSubsribers, toggleSubscriptions } from "../controller/subscription.controller.js";

const router = new Router()

router.route('/get-subscribers/:channelId').get(verifyJwt, getUserChannelSubsribers)
router.route('/toggle-subscribe/:channelId').post(verifyJwt, toggleSubscriptions)
router.route('/get-channels-subsribed-by').get(verifyJwt, getSubscribedChannels)

export default router;